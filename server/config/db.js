import mongoose from 'mongoose'

const cached = global.mongoose ?? { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing from environment variables')
  }

  if (!cached.promise) {
    mongoose.set('strictQuery', true)
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then((connection) => {
      console.log('MongoDB connected')
      return connection
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default connectDB
