import { Router } from 'express'
import {
  banUser,
  createRestaurant,
  deleteRestaurant,
  getAdminFoods,
  getAdminStats,
  getRestaurants,
  getUsers,
  updateUserAdmin,
} from '../controllers/adminController.js'
import { deleteFood } from '../controllers/foodController.js'
import verifyJwt from '../middleware/verifyJwt.js'

const router = Router()

router.use(verifyJwt)

router.get('/stats', getAdminStats)
router.get('/users', getUsers)
router.patch('/users/:id/role', updateUserAdmin)
router.patch('/users/:id/ban', banUser)
router.get('/restaurants', getRestaurants)
router.post('/restaurants', createRestaurant)
router.delete('/restaurants/:id', deleteRestaurant)
router.get('/foods', getAdminFoods)
router.delete('/foods/:id', deleteFood)

export default router
