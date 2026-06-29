import mongoose from 'mongoose'
import Wishlist from '../models/Wishlist.js'
import Food from '../models/Food.js'

export async function getWishlist(req, res, next) {
  try {
    const wishlistItems = await Wishlist.find({ userUid: req.user.uid })
      .populate('foodId')
      .sort({ createdAt: -1 })

    // Filter out items where the food might have been deleted from DB
    const items = wishlistItems.filter(item => item.foodId)

    return res.status(200).json({ items })
  } catch (error) {
    return next(error)
  }
}

export async function toggleWishlist(req, res, next) {
  try {
    const { foodId } = req.body

    if (!mongoose.Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({ message: 'Valid foodId is required' })
    }

    const food = await Food.findById(foodId)
    if (!food) {
      return res.status(404).json({ message: 'Food not found' })
    }

    const existing = await Wishlist.findOne({ userUid: req.user.uid, foodId })

    if (existing) {
      await Wishlist.deleteOne({ _id: existing._id })
      return res.status(200).json({ message: 'Removed from wishlist', saved: false })
    } else {
      await Wishlist.create({ userUid: req.user.uid, foodId })
      return res.status(201).json({ message: 'Added to wishlist', saved: true })
    }
  } catch (error) {
    return next(error)
  }
}

export async function getWishlistIds(req, res, next) {
  try {
    const items = await Wishlist.find({ userUid: req.user.uid }).select('foodId')
    const ids = items.map((item) => item.foodId.toString())

    return res.status(200).json({ ids })
  } catch (error) {
    return next(error)
  }
}
