import * as dotenv from 'dotenv'
import { connect, ConnectOptions } from 'mongoose'

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

export default dbConnect;