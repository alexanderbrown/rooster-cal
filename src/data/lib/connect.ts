import * as dotenv from 'dotenv'
import { connect, ConnectOptions } from 'mongoose'
import { NextApiRequest } from 'next'
import { getToken } from 'next-auth/jwt'
import { getSession } from 'next-auth/react'

dotenv.config()

const MONGODB_URI = process.env.MONGO_URI
const DB_NAME = process.env.MONGO_DBNAME

let cached= global.mongoose

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null }
}

async function dbConnect() {

  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env'
    )
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts: ConnectOptions = {
      bufferCommands: false,
      dbName: DB_NAME,
    }

    cached.promise = connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

async function jwtDbConnect(req: NextApiRequest) {
  const session = await getSession ({ req });
  if (!session) {
    return null;
  }
  const token = await getToken({ req });

  if (token) {
    await dbConnect()
    return token;
  }

  return undefined
}

export default jwtDbConnect;
export {dbConnect}