import mongoose from 'mongoose'
import Cart from '../models/Cart.js'
import Order from '../models/Order.js'
import Coupon from '../models/Coupon.js'

const orderStatuses = ['pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled']
const paymentStatuses = ['unpaid', 'paid', 'failed', 'refunded']

function canAccessOrder(req, order) {
  return req.user.role === 'admin' || order.userId === req.user.uid
}

export async function placeOrder(req, res, next) {
  try {
    const { deliveryDetails, couponCode } = req.body
    const cartItems = await Cart.find({ userUid: req.user.uid }).populate('foodId')

    if (!cartItems.length) {
      return res.status(400).json({ message: 'Cart is empty' })
    }

    const foods = cartItems.map((item) => ({
      foodId: item.foodId._id,
      name: item.foodId.name,
      image: item.foodId.image,
      category: item.foodId.category,
      price: item.foodId.price,
      quantity: item.quantity,
    }))

    const subtotalPrice = foods.reduce((total, food) => total + food.price * food.quantity, 0)
    let discountAmount = 0

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim(), isActive: true })
      if (coupon) {
        if (coupon.discountType === 'percentage') {
          discountAmount = Number(((subtotalPrice * coupon.discountValue) / 100).toFixed(2))
        } else if (coupon.discountType === 'fixed') {
          discountAmount = Math.min(coupon.discountValue, subtotalPrice)
        }
      }
    }

    const totalPrice = Number((subtotalPrice - discountAmount).toFixed(2))

    const order = await Order.create({
      userId: req.user.uid,
      userEmail: req.user.email,
      foods,
      subtotalPrice,
      couponCode: couponCode ? couponCode.toUpperCase().trim() : undefined,
      discountAmount,
      totalPrice,
      orderStatus: 'pending',
      paymentStatus: 'unpaid',
      deliveryDetails,
    })

    await Cart.deleteMany({ userUid: req.user.uid })

    return res.status(201).json({ message: 'Order placed successfully', order })
  } catch (error) {
    return next(error)
  }
}

export async function getUserOrders(req, res, next) {
  try {
    const orders = await Order.find({ userId: req.user.uid }).sort({ createdAt: -1 })

    return res.status(200).json({ orders })
  } catch (error) {
    return next(error)
  }
}

export async function getManageOrders(_req, res, next) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })

    return res.status(200).json({ orders })
  } catch (error) {
    return next(error)
  }
}

export async function getOrderById(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order id' })
    }

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (!canAccessOrder(req, order)) {
      return res.status(403).json({ message: 'Forbidden order access' })
    }

    return res.status(200).json({ order })
  } catch (error) {
    return next(error)
  }
}

export async function updateManagedOrderStatus(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order id' })
    }

    const payload = {}

    if (req.body.orderStatus !== undefined) {
      if (!orderStatuses.includes(req.body.orderStatus)) {
        return res.status(400).json({ message: 'Invalid order status' })
      }

      payload.orderStatus = req.body.orderStatus
    }

    if (req.body.paymentStatus !== undefined) {
      if (!paymentStatuses.includes(req.body.paymentStatus)) {
        return res.status(400).json({ message: 'Invalid payment status' })
      }

      payload.paymentStatus = req.body.paymentStatus
    }

    if (!Object.keys(payload).length) {
      return res.status(400).json({ message: 'No status field provided' })
    }

    const order = await Order.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    })

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    return res.status(200).json({ message: 'Order status updated', order })
  } catch (error) {
    return next(error)
  }
}
