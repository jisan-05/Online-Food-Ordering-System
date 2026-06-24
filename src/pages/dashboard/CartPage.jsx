import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Minus, Plus, ReceiptText, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getCart, removeCartItem, updateCartItem } from '../../services/cartService'

const deliveryFee = 0

function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`
}

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
  const subtotal = Number(summary.totalPrice || 0)
  const total = subtotal + deliveryFee
  const isCartBusy = updateMutation.isPending || removeMutation.isPending

  function updateQuantity(item, quantity) {
    const nextQuantity = Math.max(Number(quantity) || 1, 1)

    if (nextQuantity !== item.quantity) {
      updateMutation.mutate({ id: item._id, quantity: nextQuantity })
    }
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">My Cart</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Shopping Cart</h1>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Review your selected foods, adjust quantities, and continue to checkout.
            </p>
          </div>
          <div className="rounded-2xl bg-orange-50 px-4 py-3 text-sm font-black text-orange-700">
            {summary.totalItems} {summary.totalItems === 1 ? 'item' : 'items'}
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-orange-50 text-orange-600">
            <ShoppingBag size={30} />
          </div>
          <h2 className="mt-5 text-2xl font-black text-slate-950">Your cart is empty</h2>
          <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
            Add foods from the menu and they will appear here with live totals before checkout.
          </p>
          <Link
            className="mt-7 inline-flex rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/25 hover:bg-rose-600"
            to="/foods"
          >
            Browse Foods
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[minmax(0,1fr)_140px_130px_96px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs font-black uppercase tracking-[0.14em] text-slate-500 lg:grid">
              <span>Item</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Total</span>
              <span className="text-right">Action</span>
            </div>

            <div className="divide-y divide-slate-100">
              {items.map((item) => {
                const food = item.foodId
                const lineTotal = Number(food?.price || 0) * item.quantity
                const isItemBusy =
                  (updateMutation.isPending && updateMutation.variables?.id === item._id) ||
                  (removeMutation.isPending && removeMutation.variables === item._id)

                return (
                  <article
                    className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_140px_130px_96px] lg:items-center"
                    key={item._id}
                  >
                    <div className="flex min-w-0 gap-4">
                      <img
                        className="size-24 shrink-0 rounded-2xl object-cover"
                        src={food?.image || '/favicon.svg'}
                        alt={food?.name || 'Food item'}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-orange-500">
                          {food?.category || 'Unavailable'}
                        </p>
                        <h2 className="mt-2 truncate text-xl font-black text-slate-950">
                          {food?.name || 'Unavailable food'}
                        </h2>
                        <p className="mt-2 line-clamp-2 leading-7 text-slate-600">
                          {food?.description || 'This food item is no longer available.'}
                        </p>
                        <p className="mt-3 font-black text-orange-600">
                          {formatCurrency(food?.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex w-fit items-center rounded-2xl border border-slate-200 bg-slate-50 p-1 lg:mx-auto">
                      <button
                        aria-label={`Decrease ${food?.name || 'item'} quantity`}
                        className="grid size-10 place-items-center rounded-xl bg-white text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={item.quantity <= 1 || isItemBusy}
                        onClick={() => updateQuantity(item, item.quantity - 1)}
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        aria-label={`${food?.name || 'Item'} quantity`}
                        className="h-10 w-14 bg-transparent text-center text-sm font-black text-slate-950 outline-none"
                        defaultValue={item.quantity}
                        key={`${item._id}-${item.quantity}`}
                        min="1"
                        onBlur={(event) => updateQuantity(item, event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.currentTarget.blur()
                          }
                        }}
                        type="number"
                      />
                      <button
                        aria-label={`Increase ${food?.name || 'item'} quantity`}
                        className="grid size-10 place-items-center rounded-xl bg-white text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={isItemBusy}
                        onClick={() => updateQuantity(item, item.quantity + 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between lg:block lg:text-right">
                      <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400 lg:hidden">
                        Line total
                      </span>
                      <p className="text-xl font-black text-slate-950">{formatCurrency(lineTotal)}</p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isItemBusy}
                        onClick={() => removeMutation.mutate(item._id)}
                      >
                        <Trash2 size={17} />
                        <span className="lg:hidden xl:inline">Remove</span>
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:sticky xl:top-24">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-orange-50 text-orange-600">
                <ReceiptText size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-950">Order Summary</h2>
                <p className="text-sm font-bold text-slate-500">Live cart total</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="flex items-center justify-between text-sm font-bold text-slate-600">
                <span>Items</span>
                <span>{summary.totalItems}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-slate-600">
                <span>Delivery</span>
                <span>{deliveryFee ? formatCurrency(deliveryFee) : 'Free'}</span>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-950">Total</span>
                  <span className="text-2xl font-black text-orange-600">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <Link
              aria-disabled={isCartBusy}
              className={`mt-7 block w-full rounded-2xl px-5 py-4 text-center font-black text-white transition ${
                isCartBusy
                  ? 'pointer-events-none bg-slate-400'
                  : 'bg-slate-950 hover:bg-orange-600'
              }`}
              to="/dashboard/checkout"
            >
              {isCartBusy ? 'Updating Cart...' : 'Proceed to Checkout'}
            </Link>
            <Link
              className="mt-3 block w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-black text-slate-700 transition hover:border-orange-200 hover:text-orange-600"
              to="/foods"
            >
              Add More Food
            </Link>
          </aside>
        </div>
      )}
    </div>
  )
}

export default CartPage
