import 'dotenv/config'
import mongoose from 'mongoose'
import User from './server/models/User.js'

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    const users = await User.find()
    console.log('Registered Users in DB:')
    users.forEach(u => {
      console.log(`- Email: ${u.email}, Role: ${u.role}, UID: ${u.firebaseUid}`)
    })
  } catch (err) {
    console.error(err)
  } finally {
    await mongoose.disconnect()
  }
}

run()
