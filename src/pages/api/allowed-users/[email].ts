import * as dotenv from 'dotenv'
dotenv.config()

import { NextApiRequest, NextApiResponse } from "next";

import { dbConnect } from "@/data/lib/connect";
import { AllowedUser } from "@/data/models/AllowedUser";

export default async function handler (req:NextApiRequest, res:NextApiResponse) {
    if (process.env.ALLOWLIST_ONLY !== 'true'){
        return res.status(200).end()
    }
    const {email} = req.query

    if (typeof email !== 'string'){
        return res.status(400).end()
    }

    await dbConnect()
    const match = await AllowedUser.findOne({email: email.toLowerCase()})
    if (match) {
        return res.status(200).end()
    } else {
        return res.status(401).end()
    }
}