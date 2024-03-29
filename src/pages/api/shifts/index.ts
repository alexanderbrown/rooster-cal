import { NextApiRequest, NextApiResponse } from "next";

import jwtDbConnect from "@/data/lib/connect";
import { Rota} from "@/data/models/Rota";

export default async function handler (req:NextApiRequest, res:NextApiResponse) {
    const token = await jwtDbConnect(req)

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

    if (req.method==='PUT') {
        rota.shifts.push(req.body)
        return rota.save()
            .then(() => res.status(200).end())
            .catch(() => res.status(500).end())
    } else if (req.method==='PATCH'){
        console.dir(req.body, { depth: null });
        const shift = (rota.shifts as any).id(req.body._id)
        shift.set(req.body)
        return rota.save()
            .then(() => res.status(200).end())
            .catch(() => res.status(500).end())
    }
}