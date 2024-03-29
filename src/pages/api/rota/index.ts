import crypto from 'crypto'

import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

import jwtDbConnect from "@/data/lib/connect";
import { Rota } from "@/data/models/Rota";
import * as types from '@/types'


export default async function handler (req:NextApiRequest, res:NextApiResponse) {
    const token = await jwtDbConnect(req)

    if (!token) {
      return res.status(403).send(token)
    }

    if (typeof token.email !== 'string') {
        return res.status(400).end()
    }

    if (req.method==='GET') {
        const docs: mongoose.Document[] = await Rota.find({user: token.email.toLowerCase()})
        const rota_docs: Object[] = docs.map((doc) => {
            let rota_doc = doc.toObject()
            rota_doc._id = rota_doc._id.toString()
            return rota_doc
        })
        if (rota_docs.length===1){
            res.status(200).json({...rota_docs[0]});
        } else if (rota_docs.length > 1) {
            res.status(404).send(`Multiple rotas found for user ${token.email}` )
        } else {
            if (!token.email) return res.status(400).send('No user specified')
            const rota_doc: types.Rota = {
                user: token.email.toLowerCase(), 
                spreadsheet: '<Spreadsheet ID>', 
                sheet: '<Sheet Name>',
                shifts_column: 'B',
                dates_column: 'A',
                start_row: 1, 
                end_row: 1, 
                shifts: [
                    {name: 'Day', 
                    string: 'D', 
                    allday: false,
                    start: '08:30', 
                    duration: 8.5}
                ], 
                calendar_id: crypto.randomUUID()
            }
            let rota = new Rota(rota_doc)
            await rota.save()
            return res.status(200).json(rota_doc);
        }
      }  else if (req.method==='POST'){
          const filter = {user: token.email.toLowerCase()}
          const update = {[req.body.field]: req.body.value}
          await Rota.findOneAndUpdate(filter, update, {upsert: true})
          res.status(200).end()
      } else {
          res.status(405).end()
      }
};
