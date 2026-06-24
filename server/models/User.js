import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    photoURL: String,
    role: {
      type: String,
      default: 'customer',
      enum: ['customer', 'admin'],
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'banned'],
      index: true,
    },
    lastLoginAt: Date,
  },
  { timestamps: true },
)

const User = mongoose.model('User', userSchema)

export default User
