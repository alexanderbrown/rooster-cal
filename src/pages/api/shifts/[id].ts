import { NextApiRequest, NextApiResponse } from "next";

import jwtDbConnect from "@/data/lib/connect";
import { Rota} from "@/data/models/Rota";
import { HydratedArraySubdocument, HydratedDocument } from "mongoose";
import { Shift } from "@/types";

export default async function handler (req:NextApiRequest, res:NextApiResponse) {
    const token = await jwtDbConnect(req)
    const {id} = req.query

    if (typeof id !== 'string' || id.length !== 24){
        return res.status(400).end()
    }

    if (!token) {
      return res.status(403).end()
    }

    if (typeof token.email !== 'string') {
        return res.status(400).end()
    }

    const rota = await Rota.findOne({user: token.email.toLowerCase()})
    if (!rota) {
        return res.status(409).end()
    }

    if (req.method==='DELETE'){
        console.log(rota.shifts.length);
        (rota.shifts as any).pull(id) //TODO: This is hacky; find a way to type the fact that shifts will have a pull method
        console.log(rota.shifts.length);
        return rota.save()
            .then(() => res.status(200).end())
            .catch(() => res.status(500).end())
    }
}