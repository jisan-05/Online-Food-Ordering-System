import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getCart, removeCartItem, updateCartItem } from '../../services/cartService'

function CartPage() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }) => updateCartItem(id, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const removeMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  if (isLoading) {
    return <LoadingSpinner label="Loading cart" />
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 font-bold text-rose-700">
        {error?.response?.data?.message || 'Unable to load cart.'}
      </div>
    )
  }

  const items = data?.items || []
  const summary = data?.summary || { totalItems: 0, totalPrice: 0 }

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">My Cart</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Cart Items</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Update quantities, remove items, and review the total price before checkout.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-orange-50 text-orange-600">
            <ShoppingBag size={30} />
          </div>
          <h2 className="mt-5 text-2xl font-black text-slate-950">Your cart is empty</h2>
          <p className="mt-3 text-slate-600">Add foods from the menu to start building your order.</p>
          <Link className="mt-7 inline-flex rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/25 hover:bg-rose-600" to="/foods">
            Browse Foods
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="grid gap-4">
            {items.map((item) => {
              const food = item.foodId
              const lineTotal = Number(food?.price || 0) * item.quantity
              const isUpdating = updateMutation.isPending || removeMutation.isPending

              return (
                <article className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[120px_1fr_auto]" key={item._id}>
                  <img className="aspect-square w-full rounded-2xl object-cover md:w-[120px]" src={food?.image} alt={food?.name} />

                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-500">{food?.category}</p>
                    <h2 className="mt-2 text-xl font-black text-slate-950">{food?.name}</h2>
                    <p className="mt-2 line-clamp-2 leading-7 text-slate-600">{food?.description}</p>
                    <p className="mt-3 text-lg font-black text-orange-600">${Number(food?.price || 0).toFixed(2)}</p>
                  </div>

                  <div className="flex flex-row items-center justify-between gap-4 md:flex-col md:items-end">
                    <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 p-1">
                      <button
                        className="grid size-10 place-items-center rounded-xl bg-white text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={item.quantity <= 1 || isUpdating}
                        onClick={() => updateMutation.mutate({ id: item._id, quantity: item.quantity - 1 })}
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        className="h-10 w-14 bg-transparent text-center text-sm font-black text-slate-950 outline-none"
                        defaultValue={item.quantity}
                        key={`${item._id}-${item.quantity}`}
                        min="1"
                        onBlur={(event) => updateMutation.mutate({ id: item._id, quantity: Math.max(Number(event.target.value) || 1, 1) })}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.currentTarget.blur()
                          }
                        }}
                        type="number"
                      />
                      <button
                        className="grid size-10 place-items-center rounded-xl bg-white text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={isUpdating}
                        onClick={() => updateMutation.mutate({ id: item._id, quantity: item.quantity + 1 })}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Line Total</p>
                      <p className="mt-1 text-xl font-black text-slate-950">${lineTotal.toFixed(2)}</p>
                    </div>

                    <button
                      className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isUpdating}
                      onClick={() => removeMutation.mutate(item._id)}
                    >
                      <Trash2 size={17} />
                      Remove
                    </button>
                  </div>
                </article>
              )
            })}
          </div>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">Order Summary</h2>
            <div className="mt-6 grid gap-4">
              <div className="flex items-center justify-between text-sm font-bold text-slate-600">
                <span>Total Items</span>
                <span>{summary.totalItems}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-slate-600">
                <span>Subtotal</span>
                <span>${Number(summary.totalPrice || 0).toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-950">Total Price</span>
                  <span className="text-2xl font-black text-orange-600">${Number(summary.totalPrice || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Link className="mt-7 block w-full rounded-2xl bg-slate-950 px-5 py-4 text-center font-black text-white transition hover:bg-orange-600" to="/dashboard/checkout">
              Proceed to Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  )
}

export default CartPage
