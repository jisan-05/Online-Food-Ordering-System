import { Router } from 'express'
import {
  createFood,
  deleteFood,
  getFoodById,
  getFoods,
  updateFood,
} from '../controllers/foodController.js'
import authorizeRoles from '../middleware/authorizeRoles.js'
import verifyJwt from '../middleware/verifyJwt.js'

const router = Router()

router.get('/', getFoods)
router.get('/:id', getFoodById)
router.post('/', verifyJwt, authorizeRoles('owner', 'admin'), createFood)
router.patch('/:id', verifyJwt, authorizeRoles('owner', 'admin'), updateFood)
router.delete('/:id', verifyJwt, authorizeRoles('owner', 'admin'), deleteFood)

export default router
