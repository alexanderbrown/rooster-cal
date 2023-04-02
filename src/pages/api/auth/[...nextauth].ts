import * as dotenv from 'dotenv'
dotenv.config()

const GOOGLE_ID = process.env.GOOGLE_ID
const GOOGLE_SECRET = process.env.GOOGLE_SECRET

import NextAuth, { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';
import {AuthorizationParameters } from 'openid-client'

import { getRefreshToken, persistAccessToken, persistRefreshToken, refreshAccessToken } from '@/data/lib/tokenManagement';

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

let providerAuthParams: AuthorizationParameters = {
    scope: "openid email profile https://www.googleapis.com/auth/spreadsheets.readonly"
}

if (process.env.GOOGLE_FORCE_NEW_REFRESH_TOKEN==='true') {
  providerAuthParams = {...providerAuthParams, 
       prompt: "consent",
       access_type: "offline",
       response_type: "code", 
  }
}

const authOptions: AuthOptions = {
 providers: [
  GoogleProvider({
   clientId: process.env.GOOGLE_ID!,
   clientSecret: process.env.GOOGLE_SECRET!,
   authorization: {
    params: providerAuthParams
   }
  }),
],
 session: {
  strategy: 'jwt',
  maxAge: 60*60
 },
 callbacks: {
    async jwt({ token, account, profile }): Promise<JWT>{

        if (account) {
          // Save the access token and refresh token in the JWT on the initial login
          // account and profile are only available on initial login

          if (account.refresh_token && profile?.email){
            persistRefreshToken(profile.email, account.refresh_token)
            if (account.access_token) persistAccessToken(profile.email, account.access_token)
          }

          const newToken: JWT  = {
            name: profile?.name,
            email: profile?.email,
            picture: profile?.picture,
            expires_at: Math.floor(Date.now() / 1000 + (account.expires_in || 0)),
            access_token: account.access_token || '',
          }
          return newToken
        } 
        
        if (Date.now() > token.expires_at * 1000) {
          // If the access token has expired, try to refresh it
          try {
            if (!token.email) return { ...token, error: "RefreshAccessTokenError" as const }
            const refresh_token = await getRefreshToken(token.email || '')

            if (!refresh_token) return { ...token, error: "RefreshAccessTokenError" as const }
            const updatedTokens = await refreshAccessToken({refreshToken: refresh_token, 
                                                            id: GOOGLE_ID, secret: GOOGLE_SECRET})

            // Fall back to old access token
            persistAccessToken(token.email, updatedTokens.access_token ?? token.access_token)
            // Fall back to old refresh token - but may not be permitted to be used more than once
            persistRefreshToken(token.email, updatedTokens.refresh_token ?? refresh_token)
            token = {
              ...token, // Keep the previous token properties
              expires_at: Math.floor(Date.now() / 1000 + (updatedTokens.expires_in || 0)),
              access_token: updatedTokens.access_token ?? token.access_token
            }
          } catch (error) {
            // The error property will be used client-side to handle the refresh token error
            token = { ...token, error: "RefreshAccessTokenError" as const }
          }
        }
        return token
      },
      async session({session, token }) {
        session.error = token.error
        return session
      },
 }
};

declare module "next-auth/core/types" {
    interface Session {
      error?: "RefreshAccessTokenError"
    }
    interface Account {
        expires_in?: number
    }
    interface Profile {
      picture: string
    }
  }
  declare module "openid-client/types/index" {
    interface TokenSetParameters {
        expires_in?: number
    }
  }
  
  declare module "next-auth/jwt" {
    interface JWT {
      access_token: string
      expires_at: number
      error?: "RefreshAccessTokenError"
    }
  }

export default NextAuth(authOptions);