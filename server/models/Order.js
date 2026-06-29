import mongoose from 'mongoose'

const orderFoodSchema = new mongoose.Schema(
  {
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    foods: {
      type: [orderFoodSchema],
      required: true,
      validate: {
        validator(value) {
          return value.length > 0
        },
        message: 'Order must include at least one food item',
      },
    },
    subtotalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    couponCode: {
      type: String,
      uppercase: true,
      trim: true,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    orderStatus: {
      type: String,
      default: 'pending',
      enum: ['pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled'],
      index: true,
    },
    paymentStatus: {
      type: String,
      default: 'unpaid',
      enum: ['unpaid', 'paid', 'failed', 'refunded'],
      index: true,
    },
    deliveryDetails: {
      name: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true },
)

const Order = mongoose.model('Order', orderSchema)

export default Order
