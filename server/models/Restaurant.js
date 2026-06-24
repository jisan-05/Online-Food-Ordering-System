import mongoose from 'mongoose'

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    cuisine: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    ownerEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'inactive'],
      index: true,
    },
  },
  { timestamps: true },
)

const Restaurant = mongoose.model('Restaurant', restaurantSchema)

export default Restaurant
