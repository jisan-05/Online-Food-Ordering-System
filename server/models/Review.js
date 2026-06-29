import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
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
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userPhoto: {
      type: String,
      trim: true,
    },
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

reviewSchema.index({ foodId: 1, userUid: 1 })

const Review = mongoose.model('Review', reviewSchema)

export default Review
