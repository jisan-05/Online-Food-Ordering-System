import mongoose from 'mongoose'
import Coupon from '../models/Coupon.js'

export async function applyCoupon(req, res, next) {
  try {
    const { code, subtotal } = req.body

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ message: 'Coupon code is required' })
    }

    const numericSubtotal = Number(subtotal)
    if (isNaN(numericSubtotal) || numericSubtotal <= 0) {
      return res.status(400).json({ message: 'Valid subtotal is required to apply coupon' })
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true })

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon code' })
    }

    let discountAmount = 0
    if (coupon.discountType === 'percentage') {
      discountAmount = Number(((numericSubtotal * coupon.discountValue) / 100).toFixed(2))
    } else if (coupon.discountType === 'fixed') {
      discountAmount = Math.min(coupon.discountValue, numericSubtotal)
    }

    const totalPrice = Number((numericSubtotal - discountAmount).toFixed(2))

    return res.status(200).json({
      message: 'Coupon applied successfully',
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      totalPrice,
    })
  } catch (error) {
    return next(error)
  }
}

export async function getCoupons(req, res, next) {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 })
    return res.status(200).json({ coupons })
  } catch (error) {
    return next(error)
  }
}

export async function createCoupon(req, res, next) {
  try {
    const { code, discountType, discountValue } = req.body

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ message: 'Coupon code is required' })
    }

    const numericVal = Number(discountValue)
    if (isNaN(numericVal) || numericVal < 0) {
      return res.status(400).json({ message: 'Discount value must be a positive number' })
    }

    if (discountType === 'percentage' && numericVal > 100) {
      return res.status(400).json({ message: 'Percentage discount cannot exceed 100%' })
    }

    const upperCode = code.toUpperCase().trim()
    const existing = await Coupon.findOne({ code: upperCode })
    if (existing) {
      return res.status(400).json({ message: 'Coupon code already exists' })
    }

    const coupon = await Coupon.create({
      code: upperCode,
      discountType: discountType || 'percentage',
      discountValue: numericVal,
      isActive: true,
    })

    return res.status(201).json({ message: 'Coupon created successfully', coupon })
  } catch (error) {
    return next(error)
  }
}

export async function deleteCoupon(req, res, next) {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid coupon id' })
    }

    const coupon = await Coupon.findByIdAndDelete(id)

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' })
    }

    return res.status(200).json({ message: 'Coupon deleted successfully' })
  } catch (error) {
    return next(error)
  }
}

// Pre-seeding function for default coupons
export async function seedDefaultCoupons() {
  try {
    const count = await Coupon.countDocuments()
    if (count === 0) {
      await Coupon.create([
        { code: 'WELCOME10', discountType: 'percentage', discountValue: 10 },
        { code: 'FEAST20', discountType: 'fixed', discountValue: 20 },
        { code: 'SAVEMORE', discountType: 'percentage', discountValue: 15 },
        { code: 'FREE5', discountType: 'fixed', discountValue: 5 },
      ])
      console.log('Default coupons seeded successfully!')
    }
  } catch (error) {
    console.error('Error seeding coupons:', error.message)
  }
}
