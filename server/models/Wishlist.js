import mongoose from 'mongoose'

const wishlistSchema = new mongoose.Schema(
  {
    userUid: {
      type: String,
      required: true,
      index: true,
    },
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true,
      index: true,
    },
  },
  { timestamps: true },
)

wishlistSchema.index({ userUid: 1, foodId: 1 }, { unique: true })

const Wishlist = mongoose.model('Wishlist', wishlistSchema)

export default Wishlist
