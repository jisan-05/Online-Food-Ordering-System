import mongoose from 'mongoose'
import Review from '../models/Review.js'
import Order from '../models/Order.js'
import Food from '../models/Food.js'

export async function getFoodReviews(req, res, next) {
  try {
    const { id: foodId } = req.params

    if (!mongoose.Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({ message: 'Invalid food id' })
    }

    const reviews = await Review.find({ foodId }).sort({ createdAt: -1 })

    // Calculate aggregated metrics
    const totalReviews = reviews.length
    const averageRating = totalReviews
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
      : 0

    // Calculate rating counts for progress bars
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    reviews.forEach((r) => {
      if (ratingCounts[r.rating] !== undefined) {
        ratingCounts[r.rating]++
      }
    })

    return res.status(200).json({
      reviews,
      stats: {
        totalReviews,
        averageRating,
        ratingCounts,
      },
    })
  } catch (error) {
    return next(error)
  }
}

export async function createFoodReview(req, res, next) {
  try {
    const { id: foodId } = req.params
    const { rating, comment } = req.body

    if (!mongoose.Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({ message: 'Invalid food id' })
    }

    const food = await Food.findById(foodId)
    if (!food) {
      return res.status(404).json({ message: 'Food not found' })
    }

    const numericRating = Number(rating)
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5' })
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length === 0) {
      return res.status(400).json({ message: 'Comment is required' })
    }

    // Find all orders by this user containing this food item
    const userOrders = await Order.find({
      userId: req.user.uid,
      'foods.foodId': foodId,
    })

    if (userOrders.length === 0) {
      return res.status(400).json({ message: 'You can only review food items that you have ordered.' })
    }

    const hasCompletedOrder = userOrders.some((o) => o.orderStatus === 'completed')
    if (!hasCompletedOrder) {
      return res.status(400).json({ message: 'You can only review food items after your order has been delivered.' })
    }

    const verifiedPurchase = true

    // Create the review. Fetch user photo/name from User collection or defaults
    const review = await Review.create({
      userUid: req.user.uid,
      userEmail: req.user.email,
      userName: req.user.name || req.user.email.split('@')[0],
      userPhoto: req.user.photoURL || '',
      foodId,
      rating: numericRating,
      comment: comment.trim(),
      verifiedPurchase,
    })

    return res.status(201).json({ message: 'Review added successfully', review })
  } catch (error) {
    return next(error)
  }
}
