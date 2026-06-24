import { Router } from 'express'
import {
  banUser,
  createRestaurant,
  deleteRestaurant,
  getAdminAnalytics,
  getAdminFoods,
  getAdminStats,
  getRestaurants,
  getUsers,
  updateUserAdmin,
} from '../controllers/adminController.js'
import { deleteFood } from '../controllers/foodController.js'
import authorizeRoles from '../middleware/authorizeRoles.js'
import verifyJwt from '../middleware/verifyJwt.js'

const router = Router()

router.use(verifyJwt)
router.use(authorizeRoles('admin'))

router.get('/stats', getAdminStats)
router.get('/analytics', getAdminAnalytics)
router.get('/users', getUsers)
router.patch('/users/:id/role', updateUserAdmin)
router.patch('/users/:id/ban', banUser)
router.get('/restaurants', getRestaurants)
router.post('/restaurants', createRestaurant)
router.delete('/restaurants/:id', deleteRestaurant)
router.get('/foods', getAdminFoods)
router.delete('/foods/:id', deleteFood)

export default router
