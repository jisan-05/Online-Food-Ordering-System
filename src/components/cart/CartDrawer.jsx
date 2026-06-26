import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useCartDrawer from '../../hooks/useCartDrawer'
import { getCart, removeCartItem, updateCartItem } from '../../services/cartService'
import { isCustomerRole } from '../../utils/roles'
import LoadingSpinner from '../LoadingSpinner'

function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`
}

function CartDrawer() {
  const { open, closeCart } = useCartDrawer()
  const { appUser, user } = useAuth()
  const canUseCart = !user || isCustomerRole(appUser?.role)
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: Boolean(user) && isCustomerRole(appUser?.role) && open,
  })

  useEffect(() => {
    if (open && user && !isCustomerRole(appUser?.role)) {
      closeCart()
    }
  }, [open, user, appUser?.role, closeCart])

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }) => updateCartItem(id, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const removeMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const items = data?.items || []
  const summary = data?.summary || { totalItems: 0, totalPrice: 0 }
  const isBusy = updateMutation.isPending || removeMutation.isPending

  useEffect(() => {
    if (!canUseCart) return undefined

    document.body.style.overflow = open ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [open, canUseCart])

  function updateQuantity(item, quantity) {
    const nextQuantity = Math.max(Number(quantity) || 1, 1)

    if (nextQuantity !== item.quantity) {
      updateMutation.mutate({ id: item._id, quantity: nextQuantity })
    }
  }

  if (!canUseCart) {
    return null
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            aria-label="Close cart"
            className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            type="button"
          />

          <motion.aside
            aria-label="Shopping cart"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">Your Cart</p>
                <h2 className="text-xl font-black text-slate-950">
                  {summary.totalItems} {summary.totalItems === 1 ? 'item' : 'items'}
                </h2>
              </div>
              <button
                aria-label="Close cart panel"
                className="grid size-10 place-items-center rounded-2xl border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                onClick={closeCart}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {!user ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="grid size-16 place-items-center rounded-3xl bg-orange-50 text-orange-600">
                    <ShoppingBag size={28} />
                  </div>
                  <h3 className="mt-5 text-xl font-black text-slate-950">Login to view your cart</h3>
                  <p className="mt-2 max-w-xs text-sm font-bold text-slate-500">
                    Sign in to add items, review totals, and checkout faster.
                  </p>
                  <Link
                    className="mt-6 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/25 hover:bg-rose-600"
                    onClick={closeCart}
                    to="/login"
                  >
                    Login to continue
                  </Link>
                </div>
              ) : isLoading ? (
                <LoadingSpinner label="Loading cart" />
              ) : isError ? (
                <div className="rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-700">
                  Unable to load cart. Please try again.
                </div>
              ) : items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="grid size-16 place-items-center rounded-3xl bg-orange-50 text-orange-600">
                    <ShoppingBag size={28} />
                  </div>
                  <h3 className="mt-5 text-xl font-black text-slate-950">Your cart is empty</h3>
                  <p className="mt-2 max-w-xs text-sm font-bold text-slate-500">
                    Browse our menu and add your favorite dishes.
                  </p>
                  <Link
                    className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-orange-600"
                    onClick={closeCart}
                    to="/foods"
                  >
                    Browse Foods
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {items.map((item) => {
                    const food = item.foodId
                    const lineTotal = Number(food?.price || 0) * item.quantity
                    const isItemBusy =
                      (updateMutation.isPending && updateMutation.variables?.id === item._id) ||
                      (removeMutation.isPending && removeMutation.variables === item._id)

                    return (
                      <article className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3" key={item._id}>
                        <img
                          className="size-20 shrink-0 rounded-xl object-cover"
                          src={food?.image || '/favicon.svg'}
                          alt={food?.name || 'Food item'}
                        />
                        <div className="min-w-0 flex-1">
                          <Link
                            className="truncate font-black text-slate-950 hover:text-orange-600"
                            onClick={closeCart}
                            to={`/foods/${food?._id}`}
                          >
                            {food?.name || 'Unavailable food'}
                          </Link>
                          <p className="mt-1 text-sm font-bold text-orange-600">{formatCurrency(food?.price)}</p>
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <div className="flex items-center rounded-xl border border-slate-200 bg-white p-0.5">
                              <button
                                aria-label="Decrease quantity"
                                className="grid size-8 place-items-center rounded-lg text-slate-700 disabled:opacity-40"
                                disabled={item.quantity <= 1 || isItemBusy}
                                onClick={() => updateQuantity(item, item.quantity - 1)}
                                type="button"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="min-w-8 text-center text-sm font-black">{item.quantity}</span>
                              <button
                                aria-label="Increase quantity"
                                className="grid size-8 place-items-center rounded-lg text-slate-700 disabled:opacity-40"
                                disabled={isItemBusy}
                                onClick={() => updateQuantity(item, item.quantity + 1)}
                                type="button"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-slate-950">{formatCurrency(lineTotal)}</span>
                              <button
                                aria-label="Remove item"
                                className="grid size-8 place-items-center rounded-lg text-rose-600 hover:bg-rose-50 disabled:opacity-40"
                                disabled={isItemBusy}
                                onClick={() => removeMutation.mutate(item._id)}
                                type="button"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </div>

            {user && items.length > 0 && (
              <div className="border-t border-slate-200 px-5 py-5">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-950">Subtotal</span>
                  <span className="text-2xl font-black text-orange-600">{formatCurrency(summary.totalPrice)}</span>
                </div>
                <Link
                  className={`mt-4 block w-full rounded-2xl px-5 py-4 text-center font-black text-white transition ${
                    isBusy ? 'pointer-events-none bg-slate-400' : 'bg-orange-500 hover:bg-rose-600'
                  }`}
                  onClick={closeCart}
                  to="/dashboard/checkout"
                >
                  Checkout
                </Link>
                <Link
                  className="mt-2 block w-full rounded-2xl border border-slate-200 px-5 py-3 text-center text-sm font-black text-slate-700 hover:border-orange-200 hover:text-orange-600"
                  onClick={closeCart}
                  to="/dashboard/cart"
                >
                  View full cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer
