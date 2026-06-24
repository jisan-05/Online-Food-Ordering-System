import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { getJwtSecret } from '../config/jwt.js'

async function verifyJwt(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized request' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, getJwtSecret())
    const user = await User.findOne({ firebaseUid: decoded.uid })

    if (!user) {
      return res.status(401).json({ message: 'User account no longer exists' })
    }

    if (user.status === 'banned') {
      return res.status(403).json({ message: 'User account is banned' })
    }

    req.user = {
      uid: user.firebaseUid,
      email: user.email,
      role: user.role,
      status: user.status,
    }

    return next()
  } catch {
    return res.status(403).json({ message: 'Invalid or expired token' })
  }
}

export default verifyJwt
