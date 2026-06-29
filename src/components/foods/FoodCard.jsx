import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Clock3, Heart, ShoppingCart, Star } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useCartDrawer from '../../hooks/useCartDrawer'
import { addToCart } from '../../services/cartService'
import { getWishlistIds, toggleWishlist } from '../../services/wishlistService'
import { isCustomerRole } from '../../utils/roles'

function FoodCard({ food }) {
  const { appUser, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { openCart } = useCartDrawer()
  const queryClient = useQueryClient()
  
  const addMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      openCart()
    },
  })

  const isCustomer = !user || isCustomerRole(appUser?.role)

  // Query wishlist ids if user logged in
  const { data: wishlistIds = [] } = useQuery({
    queryKey: ['wishlistIds'],
    queryFn: getWishlistIds,
    enabled: Boolean(user && isCustomer),
  })

  const wishlistMutation = useMutation({
    mutationFn: toggleWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlistIds'] })
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })

  const isSaved = wishlistIds.includes(food._id)

  function handleAddToCart() {
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }

    addMutation.mutate({ foodId: food._id, quantity: 1 })
  }

  function handleWishlistToggle(event) {
    event.preventDefault()
    event.stopPropagation()
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }
    wishlistMutation.mutate(food._id)
  }

  const canAddToCart = !user || isCustomerRole(appUser?.role)

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link className="block" to={`/foods/${food._id}`}>
        <div className="relative aspect-[4/3] bg-slate-100">
          <img className="h-full w-full object-cover" src={food.image} alt={food.name} />
          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-wide text-orange-600 shadow-sm">
            {food.category}
          </span>
          {isCustomer && (
            <button
              onClick={handleWishlistToggle}
              disabled={wishlistMutation.isPending}
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:scale-110 active:scale-95 disabled:opacity-50 z-10 cursor-pointer"
              type="button"
            >
              <Heart
                className={`size-5 transition ${
                  isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-400 hover:text-rose-500'
                }`}
              />
            </button>
          )}
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link className="text-xl font-black text-slate-950 transition hover:text-orange-600" to={`/foods/${food._id}`}>
              {food.name}
            </Link>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{food.description}</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-black text-amber-700 shrink-0">
            <Star className="fill-amber-400 text-amber-400" size={15} />
            {food.averageRating > 0 ? food.averageRating : 'New'}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Price</p>
            <p className="mt-1 text-2xl font-black text-orange-600">${Number(food.price).toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1 rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-600 sm:inline-flex">
              <Clock3 size={14} />
              25 min
            </span>
            {canAddToCart && (
              <button
                className="grid size-11 place-items-center rounded-full bg-slate-950 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                disabled={addMutation.isPending}
                onClick={handleAddToCart}
                type="button"
              >
                <ShoppingCart size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default FoodCard
