import { NextApiRequest, NextApiResponse } from "next";

import * as types from '@/types'
import jwtDbConnect from "@/data/lib/connect";
import { Rota} from "@/data/models/Rota";
import mongoose from "mongoose";

type RotaDoc = (types.Rota & mongoose.Document) | null

export default async (req:NextApiRequest, res:NextApiResponse) => {
    const token = await jwtDbConnect(req)

    if (!token) {
      return res.status(403).end()
    }
    const rota = await Rota.findOne({user: token.email})
    if (!rota) {
        return res.status(409).end()
    }

    if (req.method==='PUT') {
        rota.shifts.push(req.body)
        return rota.save()
            .then(() => res.status(200).end())
            .catch(() => res.status(500).end())

    } else if (req.method==='DELETE'){
        (rota.shifts as any).pull(req.body._id) //TODO: This is hacky; find a way to type the fact that shifts will have a pull method
        return rota.save()
            .then(() => res.status(200).end())
            .catch(() => res.status(500).end())
    } else if (req.method==='PATCH'){
        const shift = (rota.shifts as any).id(req.body._id)
        shift.set(req.body)
        return rota.save()
            .then(() => res.status(200).end())
            .catch(() => res.status(500).end())
    }
}