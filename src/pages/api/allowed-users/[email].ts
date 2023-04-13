import * as dotenv from 'dotenv'
dotenv.config()

import { NextApiRequest, NextApiResponse } from "next";

import { dbConnect } from "@/data/lib/connect";
import { AllowedUser } from "@/data/models/AllowedUser";

export default async (req:NextApiRequest, res:NextApiResponse) => {
    if (process.env.ALLOWLIST_ONLY !== 'true'){
        return res.status(200).end()
    }
    const {email} = req.query

    await dbConnect()
    const match = await AllowedUser.findOne({email: email})
    if (match) {
        return res.status(200).end()
    } else {
        return res.status(401).end()
    }
}