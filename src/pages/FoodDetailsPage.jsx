import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Clock3, Heart, Minus, Plus, ShoppingCart, Star, Store, Tag } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import useAuth from '../hooks/useAuth'
import useCartDrawer from '../hooks/useCartDrawer'
import { addToCart } from '../services/cartService'
import { getFood } from '../services/foodService'
import { getFoodReviews, createFoodReview } from '../services/reviewService'
import { getWishlistIds, toggleWishlist } from '../services/wishlistService'
import { isCustomerRole } from '../utils/roles'

function FoodDetailsPage() {
  const { id } = useParams()
  const { appUser, user } = useAuth()
  const { openCart } = useCartDrawer()
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState(1)

  // Review Form States
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(null)
  const [comment, setComment] = useState('')

  // Food Query
  const { data: food, isLoading: foodLoading, isError: foodErrorMsg, error: foodErr } = useQuery({
    queryKey: ['food', id],
    queryFn: () => getFood(id),
    enabled: Boolean(id),
  })

  // Reviews Query
  const { data: reviewData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => getFoodReviews(id),
    enabled: Boolean(id),
  })

  // Wishlist Query
  const isCustomer = !user || isCustomerRole(appUser?.role)
  const { data: wishlistIds = [] } = useQuery({
    queryKey: ['wishlistIds'],
    queryFn: getWishlistIds,
    enabled: Boolean(user && isCustomer),
  })

  // Mutations
  const addMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      openCart()
    },
  })

  const wishlistMutation = useMutation({
    mutationFn: toggleWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlistIds'] })
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })

  const reviewMutation = useMutation({
    mutationFn: createFoodReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', id] })
      setComment('')
      setRating(5)
    },
  })

  function handleAddToCart() {
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }
    addMutation.mutate({ foodId: food._id, quantity })
  }

  function handleWishlistToggle() {
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }
    wishlistMutation.mutate(food._id)
  }

  function handleReviewSubmit(e) {
    e.preventDefault()
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }
    reviewMutation.mutate({ foodId: food._id, rating, comment })
  }

  const isSaved = wishlistIds.includes(id)
  const canAddToCart = !user || isCustomerRole(appUser?.role)
  const reviews = reviewData?.reviews || []
  const stats = reviewData?.stats || { totalReviews: 0, averageRating: 0, ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }

  if (foodLoading) {
    return <LoadingSpinner label="Loading food details" />
  }

  if (foodErrorMsg) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 font-bold text-rose-700">
          {foodErr?.response?.data?.message || 'Unable to load food details.'}
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link className="mb-6 inline-flex items-center gap-2 text-sm font-black text-slate-600 transition hover:text-orange-600" to="/foods">
        <ArrowLeft size={17} />
        Back to foods
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        {/* Food Image */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <img className="aspect-[4/3] w-full object-cover" src={food.image} alt={food.name} />
        </div>

        {/* Details Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-5 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-orange-700">
              <Tag size={16} />
              {food.category}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-black text-amber-700">
              <Star className="fill-amber-400 text-amber-400" size={16} />
              {stats.averageRating > 0 ? `${stats.averageRating} (${stats.totalReviews} reviews)` : 'New'}
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">{food.name}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">{food.description}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Price</p>
              <p className="mt-2 text-2xl font-black text-orange-600">${Number(food.price).toFixed(2)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <Clock3 className="text-cyan-600" size={22} />
              <p className="mt-2 font-black text-slate-950">25-35 min</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <Store className="text-emerald-600" size={22} />
              <p className="mt-2 truncate font-black text-slate-950">
                {food.restaurantId?.name || 'CraveHub Restaurant'}
              </p>
            </div>
          </div>

          {canAddToCart ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {/* Quantity Selector */}
              <div className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-1 sm:w-40">
                <button
                  className="grid size-11 place-items-center rounded-xl bg-white text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((current) => Math.max(current - 1, 1))}
                  type="button"
                >
                  <Minus size={17} />
                </button>
                <span className="font-black text-slate-950">{quantity}</span>
                <button
                  className="grid size-11 place-items-center rounded-xl bg-white text-slate-700 shadow-sm"
                  onClick={() => setQuantity((current) => current + 1)}
                  type="button"
                >
                  <Plus size={17} />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-black text-white shadow-lg shadow-orange-500/25 transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60 flex-1"
                disabled={addMutation.isPending}
                onClick={handleAddToCart}
                type="button"
              >
                <ShoppingCart size={19} />
                {addMutation.isPending ? 'Adding...' : 'Add to cart'}
              </button>

              {/* Wishlist Toggle Heart */}
              {isCustomer && (
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistMutation.isPending}
                  className="grid size-14 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition shadow-sm cursor-pointer disabled:opacity-50"
                  title={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`size-6 transition ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              )}
            </div>
          ) : (
            <p className="mt-8 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500">
              Cart and ordering are available for customer accounts only.
            </p>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Reviews List */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <h2 className="text-2xl font-black tracking-tight text-slate-950 mb-6">Customer Reviews</h2>

          {reviewsLoading ? (
            <div className="py-10 text-center text-slate-500">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-bold">
              No reviews yet for this meal. Be the first to share your thoughts!
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {review.userPhoto ? (
                        <img className="size-10 rounded-full object-cover" src={review.userPhoto} alt={review.userName} />
                      ) : (
                        <div className="grid size-10 place-items-center rounded-full bg-orange-100 text-sm font-black text-orange-700">
                          {review.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-black text-slate-950 text-sm">{review.userName}</p>
                          {review.verifiedPurchase && (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-emerald-700">
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-slate-400 mt-0.5">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 font-medium pl-[52px]">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rating Breakdown & Form */}
        <div className="space-y-6">
          {/* Aggregated Rating Stats */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-950 mb-4">Rating Breakdown</h3>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl font-black text-slate-950">{stats.averageRating}</span>
              <div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.round(stats.averageRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                    />
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-500 mt-1">{stats.totalReviews} ratings</p>
              </div>
            </div>

            {/* Stars Bars */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = stats.ratingCounts[stars] || 0
                const percent = stats.totalReviews ? Math.round((count / stats.totalReviews) * 100) : 0
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs">
                    <span className="w-8 text-slate-500 font-bold">{stars} Star</span>
                    <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="w-8 text-right text-slate-400 font-bold">{percent}%</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Add Review Form */}
          {isCustomer && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black text-slate-950 mb-4">Add Your Review</h3>
              
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {/* Interactive Star Selector */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => {
                      const starValue = i + 1
                      const isHighlighted = hoverRating !== null ? starValue <= hoverRating : starValue <= rating
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="text-2xl transition hover:scale-115 active:scale-90 cursor-pointer"
                        >
                          <Star
                            size={28}
                            className={`transition ${isHighlighted ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                          />
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Comment Text */}
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                    Review Details
                  </label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you liked or disliked about this food..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold outline-none focus:border-orange-300 resize-none"
                    required
                  />
                </div>

                {reviewMutation.isError && (
                  <p className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl">
                    {reviewMutation.error?.response?.data?.message || 'Error submitting review.'}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={reviewMutation.isPending}
                  className="w-full inline-flex justify-center items-center rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white hover:bg-orange-600 transition cursor-pointer disabled:bg-slate-400"
                >
                  {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default FoodDetailsPage
