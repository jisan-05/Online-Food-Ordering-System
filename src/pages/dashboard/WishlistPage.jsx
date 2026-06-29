import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'
import useCartDrawer from '../../hooks/useCartDrawer'
import { addToCart } from '../../services/cartService'
import { getWishlist, toggleWishlist } from '../../services/wishlistService'

function WishlistPage() {
  const queryClient = useQueryClient()
  const { openCart } = useCartDrawer()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['wishlist'],
    queryFn: getWishlist,
  })

  const cartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      openCart()
    },
  })

  const removeMutation = useMutation({
    mutationFn: toggleWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      queryClient.invalidateQueries({ queryKey: ['wishlistIds'] })
    },
  })

  if (isLoading) {
    return <LoadingSpinner label="Loading your wishlist" />
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 font-bold text-rose-700">
        {error?.response?.data?.message || 'Unable to load wishlist.'}
      </div>
    )
  }

  const items = data?.items || []

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Saved Items</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">My Wishlist</h1>
          <p className="mt-2 text-slate-600">Keep track of your favorite meals and add them to your cart in one click.</p>
        </div>
        <div className="w-fit rounded-2xl bg-orange-50 px-4 py-2 text-sm font-black text-orange-700">
          {items.length} {items.length === 1 ? 'item' : 'items'} saved
        </div>
      </div>

      {!items.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="grid size-20 place-items-center rounded-full bg-rose-50 text-rose-500">
            <Heart className="size-10 fill-rose-500/20" />
          </div>
          <h2 className="mt-6 text-2xl font-black text-slate-950">Your wishlist is empty</h2>
          <p className="mt-2 max-w-sm text-slate-500">
            Explore our delicious menu items and save your favorites for quick access!
          </p>
          <Link
            className="mt-8 inline-flex rounded-2xl bg-orange-500 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-500/25 hover:bg-rose-600 transition"
            to="/foods"
          >
            Browse Foods
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const food = item.foodId
            if (!food) return null
            return (
              <article
                key={item._id}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Food Image */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    src={food.image}
                    alt={food.name}
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white px-2.5 py-1 text-xs font-black uppercase tracking-wide text-orange-600 shadow-sm">
                    {food.category}
                  </span>
                  {/* Quick Delete Overlay Button */}
                  <button
                    onClick={() => removeMutation.mutate(food._id)}
                    disabled={removeMutation.isPending}
                    className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Details */}
                <div className="p-5">
                  <Link
                    to={`/foods/${food._id}`}
                    className="text-lg font-black text-slate-950 transition hover:text-orange-600 line-clamp-1"
                  >
                    {food.name}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 h-10">
                    {food.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Price</p>
                      <p className="mt-0.5 text-xl font-black text-orange-600">${Number(food.price).toFixed(2)}</p>
                    </div>

                    <button
                      onClick={() => cartMutation.mutate({ foodId: food._id, quantity: 1 })}
                      disabled={cartMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white hover:bg-orange-600 disabled:bg-slate-400 transition"
                    >
                      <ShoppingCart size={14} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default WishlistPage
