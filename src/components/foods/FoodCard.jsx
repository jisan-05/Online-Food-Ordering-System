import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Clock3, ShoppingCart, Star } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { addToCart } from '../../services/cartService'

function FoodCard({ food }) {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const addMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  function handleAddToCart() {
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }

    addMutation.mutate({ foodId: food._id, quantity: 1 })
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link className="block" to={`/foods/${food._id}`}>
        <div className="relative aspect-[4/3] bg-slate-100">
          <img className="h-full w-full object-cover" src={food.image} alt={food.name} />
          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-wide text-orange-600 shadow-sm">
            {food.category}
          </span>
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
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-black text-amber-700">
            <Star className="fill-amber-400 text-amber-400" size={15} />
            4.8
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
            <button
              className="grid size-11 place-items-center rounded-full bg-slate-950 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={addMutation.isPending}
              onClick={handleAddToCart}
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default FoodCard
