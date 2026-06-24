import mongoose from 'mongoose'
import Cart from '../models/Cart.js'
import Food from '../models/Food.js'

function formatCart(items) {
  const subtotal = items.reduce((total, item) => {
    const price = Number(item.foodId?.price || 0)

    return total + price * item.quantity
  }, 0)

  return {
    items,
    summary: {
      totalItems: items.reduce((total, item) => total + item.quantity, 0),
      subtotal,
      totalPrice: subtotal,
    },
  }
}

export async function getCart(req, res, next) {
  try {
    const items = await Cart.find({ userUid: req.user.uid })
      .populate('foodId')
      .sort({ updatedAt: -1 })

    return res.status(200).json(formatCart(items))
  } catch (error) {
    return next(error)
  }
}

export async function addToCart(req, res, next) {
  try {
    const { foodId, quantity = 1 } = req.body

    if (!mongoose.Types.ObjectId.isValid(foodId)) {
      return res.status(400).json({ message: 'Valid foodId is required' })
    }

    const food = await Food.findById(foodId)

    if (!food) {
      return res.status(404).json({ message: 'Food not found' })
    }

    const amount = Math.max(Number(quantity) || 1, 1)
    const item = await Cart.findOneAndUpdate(
      { userUid: req.user.uid, foodId },
      {
        $setOnInsert: {
          userUid: req.user.uid,
          userEmail: req.user.email,
          foodId,
        },
        $inc: { quantity: amount },
      },
      { new: true, setDefaultsOnInsert: true, upsert: true },
    ).populate('foodId')

    return res.status(201).json({ message: 'Food added to cart', item })
  } catch (error) {
    return next(error)
  }
}

export async function updateCartItem(req, res, next) {
  try {
    const { quantity } = req.body

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid cart item id' })
    }

    const nextQuantity = Number(quantity)

    if (!Number.isInteger(nextQuantity) || nextQuantity < 1) {
      return res.status(400).json({ message: 'Quantity must be a positive whole number' })
    }

    const item = await Cart.findOneAndUpdate(
      { _id: req.params.id, userUid: req.user.uid },
      { quantity: nextQuantity },
      { new: true, runValidators: true },
    ).populate('foodId')

    if (!item) {
      return res.status(404).json({ message: 'Cart item not found' })
    }

    return res.status(200).json({ message: 'Cart item updated', item })
  } catch (error) {
    return next(error)
  }
}

export async function removeCartItem(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid cart item id' })
    }

    const item = await Cart.findOneAndDelete({ _id: req.params.id, userUid: req.user.uid })

    if (!item) {
      return res.status(404).json({ message: 'Cart item not found' })
    }

    return res.status(200).json({ message: 'Cart item removed' })
  } catch (error) {
    return next(error)
  }
}
