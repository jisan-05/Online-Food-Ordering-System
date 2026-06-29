import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import connectDB from './config/db.js'
import adminRoutes from './routes/adminRoutes.js'
import authRoutes from './routes/authRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import foodRoutes from './routes/foodRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import wishlistRoutes from './routes/wishlistRoutes.js'
import couponRoutes from './routes/couponRoutes.js'
import errorHandler from './middleware/errorHandler.js'

const app = express()
const allowedOrigins = [
  ...(process.env.CLIENT_URL || '').split(',').map((origin) => origin.trim()),
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      try {
        const { hostname } = new URL(origin)
        const isNetlifyPreview = hostname.endsWith('.netlify.app')
        const isVercelPreview = hostname.endsWith('.vercel.app')

        if (isNetlifyPreview || isVercelPreview) {
          return callback(null, true)
        }
      } catch {
        // ignore invalid origin URLs
      }

      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    next(error)
  }
})

app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'CraveHub API',
    health: '/api/health',
  })
})

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'CraveHub API' })
})

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/foods', foodRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/coupons', couponRoutes)
app.use(errorHandler)

export default app
