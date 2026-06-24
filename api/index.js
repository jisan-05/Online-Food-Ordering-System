import 'dotenv/config'
import connectDB from '../server/config/db.js'
import app from '../server/app.js'

await connectDB()

export default app
