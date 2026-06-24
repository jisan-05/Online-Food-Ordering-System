import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function createJwtToken(req, res, next) {
  try {
    const { uid, name, email, photoURL } = req.body

    if (!uid || !email) {
      return res.status(400).json({ message: 'Firebase uid and email are required' })
    }

    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { email, name, photoURL, lastLoginAt: new Date() },
      { new: true, setDefaultsOnInsert: true, upsert: true },
    )

    const token = jwt.sign(
      {
        uid: user.firebaseUid,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    )

    return res.status(200).json({ token })
  } catch (error) {
    return next(error)
  }
}

export function getCurrentUser(req, res) {
  return res.status(200).json({ user: req.user })
}
