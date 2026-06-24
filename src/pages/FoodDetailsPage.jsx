import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Clock3, Minus, Plus, ShoppingCart, Star, Store, Tag } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import useAuth from '../hooks/useAuth'
import { addToCart } from '../services/cartService'
import { getFood } from '../services/foodService'

function FoodDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState(1)
  const { data: food, isLoading, isError, error } = useQuery({
    queryKey: ['food', id],
    queryFn: () => getFood(id),
    enabled: Boolean(id),
  })
  const addMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  function handleAddToCart() {
    if (!user) {
      navigate('/login', { state: { from: location } })
      return
    }

    addMutation.mutate({ foodId: food._id, quantity })
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading food details" />
  }

  if (isError) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 font-bold text-rose-700">
          {error?.response?.data?.message || 'Unable to load food details.'}
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
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <img className="aspect-[4/3] w-full object-cover" src={food.image} alt={food.name} />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-5 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-orange-700">
              <Tag size={16} />
              {food.category}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-black text-amber-700">
              <Star className="fill-amber-400 text-amber-400" size={16} />
              4.8 rating
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
              <p className="mt-2 truncate font-black text-slate-950">{food.restaurantId}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-1 sm:w-40">
              <button
                className="grid size-11 place-items-center rounded-xl bg-white text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                disabled={quantity <= 1}
                onClick={() => setQuantity((current) => Math.max(current - 1, 1))}
              >
                <Minus size={17} />
              </button>
              <span className="font-black text-slate-950">{quantity}</span>
              <button
                className="grid size-11 place-items-center rounded-xl bg-white text-slate-700 shadow-sm"
                onClick={() => setQuantity((current) => current + 1)}
              >
                <Plus size={17} />
              </button>
            </div>
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-4 font-black text-white shadow-lg shadow-orange-500/25 transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              disabled={addMutation.isPending}
              onClick={handleAddToCart}
            >
              <ShoppingCart size={19} />
              {addMutation.isPending ? 'Adding...' : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FoodDetailsPage
