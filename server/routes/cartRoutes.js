import { Router } from 'express'
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from '../controllers/cartController.js'
import verifyJwt from '../middleware/verifyJwt.js'

const router = Router()

router.use(verifyJwt)

router.get('/', getCart)
router.post('/', addToCart)
router.patch('/:id', updateCartItem)
router.delete('/:id', removeCartItem)

export default router
