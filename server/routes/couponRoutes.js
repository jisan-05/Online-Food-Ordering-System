import { Router } from 'express'
import {
  applyCoupon,
  createCoupon,
  deleteCoupon,
  getCoupons,
} from '../controllers/couponController.js'
import authorizeRoles from '../middleware/authorizeRoles.js'
import verifyJwt from '../middleware/verifyJwt.js'

const router = Router()

router.post('/apply', verifyJwt, authorizeRoles('customer'), applyCoupon)

router.get('/', verifyJwt, authorizeRoles('owner', 'admin'), getCoupons)
router.post('/', verifyJwt, authorizeRoles('owner', 'admin'), createCoupon)
router.delete('/:id', verifyJwt, authorizeRoles('owner', 'admin'), deleteCoupon)

export default router
