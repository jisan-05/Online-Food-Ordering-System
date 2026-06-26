import { Router } from 'express'
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from '../controllers/cartController.js'
import verifyJwt from '../middleware/verifyJwt.js'
import authorizeRoles from '../middleware/authorizeRoles.js'

const router = Router()

router.use(verifyJwt, authorizeRoles('customer'))

router.get('/', getCart)
router.post('/', addToCart)
router.patch('/:id', updateCartItem)
router.delete('/:id', removeCartItem)

export default router
