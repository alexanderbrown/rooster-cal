import { dbConnect } from "./connect"

import * as types from '@/types'
import { User } from "../models/User"
import { TokenSet } from "next-auth"

export async function getAccessToken(email: string) {
    await dbConnect()
    const user: types.User | null = await User.findOne({email})
    return user?.accessToken 
  }
  
export async function getRefreshToken(email: string) {
    await dbConnect()
    const user: types.User | null = await User.findOne({email})
    return user?.refreshToken 
  }
  
export async function persistAccessToken(email: string, accessToken: string){
    await dbConnect()
    return await User.findOneAndUpdate({email}, {accessToken}, {upsert: true, new: true})
  }
  
  
export async function persistRefreshToken(email: string, refreshToken: string){
    await dbConnect()
    return await User.findOneAndUpdate({email}, {refreshToken}, {upsert: true, new: true})
  }
  
export async function refreshAccessToken({refreshToken, id, secret}: {refreshToken: string, id: string, secret: string}){
    // https://accounts.google.com/.well-known/openid-configuration
    // We need the `token_endpoint`.
    const response = await fetch("https://oauth2.googleapis.com/token", {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: id,
        client_secret: secret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      method: "POST",
    })
  
    const tokens: TokenSet = await response.json()
    if (!response.ok) throw tokens
    return tokens
  }