import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema(
  {
    userUid: {
      type: String,
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { timestamps: true },
)

cartSchema.index({ userUid: 1, foodId: 1 }, { unique: true })

const Cart = mongoose.model('Cart', cartSchema)

export default Cart
