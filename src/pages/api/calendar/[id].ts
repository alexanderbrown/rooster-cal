import * as dotenv from 'dotenv'
dotenv.config()

const GOOGLE_ID = process.env.GOOGLE_ID
const GOOGLE_SECRET = process.env.GOOGLE_SECRET

import ical, {ICalEventData} from 'ical-generator'
import { DateTime, Duration } from 'luxon';
import { NextApiRequest, NextApiResponse } from 'next'


import { dbConnect } from '@/data/lib/connect';
import { Rota } from '@/data/models/Rota';
import * as types from '@/types';
import {  getRefreshToken, persistAccessToken, persistRefreshToken, refreshAccessToken } from '@/data/lib/tokenManagement';
import { parseDate, parseTime } from '@/utils/datetime'

export default async function handler (req:NextApiRequest, res:NextApiResponse) {
  if (!GOOGLE_ID)  {
    throw new Error(
      'Please define the GOOGLE_ID environment variable inside .env'
    )
  }
  if (!GOOGLE_SECRET)  {
    throw new Error(
        'Please define the GOOGLE_SECRET environment variable inside .env'
    )
  }

  const {rota_doc, access_token} = await authenticate(req, GOOGLE_ID, GOOGLE_SECRET)
  if ((rota_doc===null) || (access_token===null)) return res.status(404).end()

  
  const dates = await getSheetColumnData({...rota_doc.toObject(), column: rota_doc.dates_column, access_token: access_token})
  const shifts = await getSheetColumnData({...rota_doc.toObject(), column: rota_doc.shifts_column, access_token: access_token})
  
  const data = dates.map((d, i) => {return{date: d, shift: shifts[i]}})

  const results = data.map(entry => convertToCalendar(entry.date, entry.shift, rota_doc.shifts))

  const cal = ical({name: `${rota_doc.user.replace('@gmail.com', '')} Rota`, 
                   prodId: {company: 'rooster', product: 'googlesheet_exporter', language: 'EN'}})
  results.forEach(result => {
    if (result) {
      const event = toICSObject(result)
      if (event) cal.createEvent(event)
    }
  })

  res.status(200).send(cal.toString());
};


async function authenticate(req: NextApiRequest, id: string, secret: string) {
  const {id: calendar_ics} = req.query
  const calendar_id = (calendar_ics as string).replace('.ics', '')

  await dbConnect()
  const rota_doc = await Rota.findOne({calendar_id})
  if (!rota_doc) return {rota_doc, access_token: null}

  const refresh_token = await getRefreshToken(rota_doc.user)
  if (!refresh_token) return {rota_doc, access_token: null}

  const updatedTokens = await refreshAccessToken({refreshToken: refresh_token, id, secret})
  // Fall back to blank as we have no other access token
  const access_token = updatedTokens.access_token || ''
  persistAccessToken(rota_doc.user,access_token)
  // Fall back to old refresh token - but may not be permitted to be used more than once
  persistRefreshToken(rota_doc.user, updatedTokens.refresh_token ?? refresh_token)

  return {rota_doc, access_token}
}

interface IgetSheetColumnData {
  spreadsheet: string,
  sheet: string, 
  column: string, 
  start_row: number, 
  end_row: number, 
  access_token: string
}

async function getSheetColumnData(opts: IgetSheetColumnData) {
  const range=`${opts.sheet}!${opts.column}${opts.start_row}:${opts.column}${opts.end_row}`
  const results = await getSheetData(opts.spreadsheet, range, opts.access_token)
  if (!results) return []
  return results.values.map((item: string[]) => item[0])
}

async function getSheetData(spreadsheetId: string, range: string, accessToken: any, ): Promise<types.SheetsValueRange | null> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`
  const res = await fetch(url,
        {headers:{
        Authorization: `Bearer ${accessToken}`,
        },})
  if (res.status!==200) return null
  const data = await res.json()
  return data
};

function convertToCalendar(date: string, shiftCell: string, shiftPattern: types.Shift[]){

  if (!date || !shiftCell) return null

  const shiftPatternRegexResults = shiftPattern.map(pattern => shiftCell.match('^' + pattern.string + '(?<remainder>.*)'))
  const shiftPatternMatches = shiftPatternRegexResults.map(result => result?.index === 0)
  const matchIdx = shiftPatternMatches.indexOf(true)

  const matchingShift = matchIdx < 0 ? null : shiftPattern[matchIdx]

  const remainder = shiftPatternRegexResults[matchIdx]?.groups?.remainder ?? shiftCell //fall back to entry on google sheet if we haven't found a match

  return {date, matchingShift, remainder }
}


interface parsedResults {
  date: string | undefined,
  matchingShift: types.Shift | null,
  remainder: string}

function toICSObject(entry: parsedResults): ICalEventData | null{
    if (!entry.date) return null

    const date = parseDate(entry.date)
    const shiftStartTime = entry.matchingShift?.start? parseTime(entry.matchingShift?.start) : '00:00'

    if (entry.matchingShift){
      if (entry.matchingShift.allday){
        const startTime = DateTime.fromFormat(date, 'dd/MM/yyyy')
        return {
          start: startTime.toISODate(),
          summary: entry.matchingShift.name + entry.remainder,
          allDay: true
        }
      } else {
        const startTime = DateTime.fromFormat(`${date} ${shiftStartTime}`, 'dd/MM/yyyy HH:mm')
        const endTime = startTime.plus(Duration.fromObject({hours: entry.matchingShift.duration}))
        return {
          start: startTime.toISO(),
          end: endTime.toISO(),
          summary: entry.matchingShift.name + entry.remainder,
          allDay: false,
          timezone: 'Europe/London'
        }
      }
    } else {
      const startTime = DateTime.fromFormat(date, 'dd/MM/yyyy')
      return {
        start: startTime.toISODate(),
        summary: entry.remainder,
        allDay: true
      }
    }
}