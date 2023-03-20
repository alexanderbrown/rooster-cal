import * as dotenv from 'dotenv'
dotenv.config()

const GOOGLE_ID = process.env.GOOGLE_ID
const GOOGLE_SECRET = process.env.GOOGLE_SECRET

import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

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

const authOptions: AuthOptions = {
 providers: [
  GoogleProvider({
   clientId: process.env.GOOGLE_ID!,
   clientSecret: process.env.GOOGLE_SECRET!,
   authorization: {
    params: {
     prompt: "consent",
     access_type: "offline",
     response_type: "code"
    }
   }
  }),
],
 session: {
  strategy: 'jwt',
 },
 
};
export default NextAuth(authOptions);