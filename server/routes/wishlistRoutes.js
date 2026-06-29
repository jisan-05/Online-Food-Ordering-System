import { Router } from 'express'
import {
  getWishlist,
  getWishlistIds,
  toggleWishlist,
} from '../controllers/wishlistController.js'
import authorizeRoles from '../middleware/authorizeRoles.js'
import verifyJwt from '../middleware/verifyJwt.js'

const router = Router()

router.use(verifyJwt, authorizeRoles('customer'))

router.get('/', getWishlist)
router.post('/toggle', toggleWishlist)
router.get('/ids', getWishlistIds)

export default router
