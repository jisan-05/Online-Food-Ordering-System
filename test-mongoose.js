import 'dotenv/config'
import mongoose from 'mongoose'
import Wishlist from './server/models/Wishlist.js'
import Review from './server/models/Review.js'
import Order from './server/models/Order.js'

async function run() {
  try {
    console.log('Connecting to database...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected!')

    console.log('Testing Wishlist query...')
    const wishlist = await Wishlist.find({ userUid: 'test' }).populate('foodId')
    console.log('Wishlist query successful:', wishlist)

    console.log('Testing Review creation query...')
    // We try to find an order with a foodId
    const order = await Order.findOne()
    if (order && order.foods && order.foods.length > 0) {
      const foodId = order.foods[0].foodId
      console.log('Found foodId in order:', foodId)
      const existingOrder = await Order.findOne({
        userId: 'test',
        'foods.foodId': foodId,
        orderStatus: 'completed',
      })
      console.log('Order query successful:', !!existingOrder)
    } else {
      console.log('No orders found to test foodId query.')
    }

    console.log('Testing completed successfully!')
  } catch (err) {
    console.error('Error during test execution:', err)
  } finally {
    await mongoose.disconnect()
  }
}

run()
