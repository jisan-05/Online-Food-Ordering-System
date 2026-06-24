import { Router } from 'express'
import {
  getManageOrders,
  getOrderById,
  getUserOrders,
  placeOrder,
  updateManagedOrderStatus,
  updateOrderStatus,
} from '../controllers/orderController.js'
import verifyJwt from '../middleware/verifyJwt.js'

const router = Router()

router.use(verifyJwt)

router.post('/', placeOrder)
router.get('/my-orders', getUserOrders)
router.get('/manage/all', getManageOrders)
router.get('/:id', getOrderById)
router.patch('/manage/:id/status', updateManagedOrderStatus)
router.patch('/:id/status', updateOrderStatus)

export default router
