import mongoose from 'mongoose'
import Food from '../models/Food.js'
import Order from '../models/Order.js'
import Restaurant from '../models/Restaurant.js'
import User from '../models/User.js'

export async function getAdminStats(_req, res, next) {
  try {
    const [totalUsers, totalOrders, revenueResult] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }]),
    ])

    return res.status(200).json({
      totalUsers,
      totalOrders,
      totalRevenue: revenueResult[0]?.totalRevenue || 0,
    })
  } catch (error) {
    return next(error)
  }
}

export async function getAdminAnalytics(_req, res, next) {
  try {
    const [monthlyRevenue, ordersPerMonth, userGrowth, foodCategories] = await Promise.all([
      Order.aggregate([
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            revenue: { $sum: '$totalPrice' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Order.aggregate([
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            orders: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      User.aggregate([
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            users: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Food.aggregate([
        {
          $group: {
            _id: '$category',
            foods: { $sum: 1 },
          },
        },
        { $sort: { foods: -1 } },
      ]),
    ])

    function formatMonthly(items, valueKey) {
      return items.map((item) => ({
        month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
        [valueKey]: item[valueKey],
      }))
    }

    return res.status(200).json({
      monthlyRevenue: formatMonthly(monthlyRevenue, 'revenue'),
      ordersPerMonth: formatMonthly(ordersPerMonth, 'orders'),
      userGrowth: formatMonthly(userGrowth, 'users'),
      foodCategories: foodCategories.map((item) => ({
        category: item._id || 'Uncategorized',
        foods: item.foods,
      })),
    })
  } catch (error) {
    return next(error)
  }
}

export async function getUsers(_req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 })

    return res.status(200).json({ users })
  } catch (error) {
    return next(error)
  }
}

export async function updateUserAdmin(req, res, next) {
  try {
    const { role } = req.body

    if (!['customer', 'owner', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid user role' })
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json({ message: 'User role updated', user })
  } catch (error) {
    return next(error)
  }
}

export async function banUser(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'banned' },
      { new: true, runValidators: true },
    )

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json({ message: 'User banned', user })
  } catch (error) {
    return next(error)
  }
}

export async function getAdminFoods(_req, res, next) {
  try {
    const foods = await Food.find().sort({ createdAt: -1 })

    return res.status(200).json({ foods })
  } catch (error) {
    return next(error)
  }
}

export async function getRestaurants(_req, res, next) {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 })

    return res.status(200).json({ restaurants })
  } catch (error) {
    return next(error)
  }
}

export async function createRestaurant(req, res, next) {
  try {
    const restaurant = await Restaurant.create(req.body)

    return res.status(201).json({ message: 'Restaurant created', restaurant })
  } catch (error) {
    return next(error)
  }
}

export async function deleteRestaurant(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid restaurant id' })
    }

    const restaurant = await Restaurant.findByIdAndDelete(req.params.id)

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' })
    }

    return res.status(200).json({ message: 'Restaurant deleted' })
  } catch (error) {
    return next(error)
  }
}
