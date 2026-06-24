import mongoose from 'mongoose'
import Food from '../models/Food.js'

const allowedFields = ['name', 'image', 'category', 'price', 'description', 'restaurantId']

function pickFoodFields(body) {
  return allowedFields.reduce((payload, field) => {
    if (body[field] !== undefined) {
      payload[field] = body[field]
    }

    return payload
  }, {})
}

function buildFoodQuery({ search, category, restaurantId }) {
  const query = {}

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ]
  }

  if (category && category !== 'All') {
    query.category = category
  }

  if (restaurantId) {
    query.restaurantId = restaurantId
  }

  return query
}

export async function getFoods(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.min(Math.max(Number(req.query.limit) || 9, 1), 50)
    const skip = (page - 1) * limit
    const query = buildFoodQuery(req.query)

    const [foods, total, categories] = await Promise.all([
      Food.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Food.countDocuments(query),
      Food.distinct('category'),
    ])

    return res.status(200).json({
      foods,
      categories: categories.sort(),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    })
  } catch (error) {
    return next(error)
  }
}

export async function getFoodById(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid food id' })
    }

    const food = await Food.findById(req.params.id)

    if (!food) {
      return res.status(404).json({ message: 'Food not found' })
    }

    return res.status(200).json({ food })
  } catch (error) {
    return next(error)
  }
}

export async function createFood(req, res, next) {
  try {
    const food = await Food.create(pickFoodFields(req.body))

    return res.status(201).json({ message: 'Food created successfully', food })
  } catch (error) {
    return next(error)
  }
}

export async function updateFood(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid food id' })
    }

    const food = await Food.findByIdAndUpdate(req.params.id, pickFoodFields(req.body), {
      new: true,
      runValidators: true,
    })

    if (!food) {
      return res.status(404).json({ message: 'Food not found' })
    }

    return res.status(200).json({ message: 'Food updated successfully', food })
  } catch (error) {
    return next(error)
  }
}

export async function deleteFood(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid food id' })
    }

    const food = await Food.findByIdAndDelete(req.params.id)

    if (!food) {
      return res.status(404).json({ message: 'Food not found' })
    }

    return res.status(200).json({ message: 'Food deleted successfully' })
  } catch (error) {
    return next(error)
  }
}
