import { Router } from 'express'
import {
  createFood,
  deleteFood,
  getFoodById,
  getFoods,
  updateFood,
} from '../controllers/foodController.js'

const router = Router()

router.get('/', getFoods)
router.get('/:id', getFoodById)
router.post('/', createFood)
router.patch('/:id', updateFood)
router.delete('/:id', deleteFood)

export default router
