import { ObjectId } from "mongoose";

export type User = {
    email: string,
    accessToken?: string,
    refreshToken?: string,
  }

export type Rota = {
    user: string,
    spreadsheet: string,
    sheet: string,
    dates_column: string,
    shifts_column: string, 
    start_row: number,
    end_row: number,
    shifts: Shift[], 
    date_format: string,
    calendar_id?: string
}

export type Shift = {
    _id?: any,
    name: string,
    string: string,
    allday: boolean
    start?: string,
    duration?: number,    
}

export const BLANKSHIFT:Shift={
    name: '',
    string: '',
    allday: false,
    start: '08:30',
    duration: 8,
}

export type SheetsValueRange = {
    range: string,
    majorDimension: 'ROWS' | 'COLUMNS' | 'DIMENSION_UNSPECIFIED',
    values: string[][]
    }
