import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, CreditCard, MapPin, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getCart } from '../../services/cartService'
import { placeOrder } from '../../services/orderService'

function CheckoutPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [deliveryDetails, setDeliveryDetails] = useState({ name: '', phone: '', address: '' })
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  })
  const orderMutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: ({ order }) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      navigate(`/dashboard/orders/${order._id}`)
    },
  })

  if (isLoading) {
    return <LoadingSpinner label="Preparing checkout" />
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 font-bold text-rose-700">
        {error?.response?.data?.message || 'Unable to load checkout.'}
      </div>
    )
  }

  const items = data?.items || []
  const summary = data?.summary || { totalItems: 0, totalPrice: 0 }
  const isDeliveryComplete = Object.values(deliveryDetails).every((value) => value.trim().length > 1)

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <ShoppingBag className="mx-auto text-orange-600" size={42} />
        <h1 className="mt-5 text-3xl font-black text-slate-950">Your cart is empty</h1>
        <p className="mt-3 text-slate-600">Add food before starting checkout.</p>
        <Link className="mt-7 inline-flex rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white" to="/foods">
          Browse Foods
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Checkout</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Review Your Order</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Confirm cart items and place a protected order using your signed-in account.
        </p>
      </div>

      <form
        className="grid gap-6 xl:grid-cols-[1fr_360px]"
        onSubmit={(event) => {
          event.preventDefault()
          orderMutation.mutate({ deliveryDetails })
        }}
      >
        <div className="grid gap-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-black text-slate-950">
              <MapPin className="text-orange-600" size={21} />
              Delivery Details
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Full name
                <input
                  className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 font-bold outline-none focus:border-orange-300"
                  onChange={(event) => setDeliveryDetails((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Full name"
                  required
                  value={deliveryDetails.name}
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">
                Phone number
                <input
                  className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 font-bold outline-none focus:border-orange-300"
                  onChange={(event) => setDeliveryDetails((current) => ({ ...current, phone: event.target.value }))}
                  placeholder="Phone number"
                  required
                  type="tel"
                  value={deliveryDetails.phone}
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-700 md:col-span-2">
                Delivery address
                <input
                  className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 font-bold outline-none focus:border-orange-300"
                  onChange={(event) => setDeliveryDetails((current) => ({ ...current, address: event.target.value }))}
                  placeholder="Delivery address"
                  required
                  value={deliveryDetails.address}
                />
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-black text-slate-950">
              <CreditCard className="text-orange-600" size={21} />
              Payment
            </h2>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="font-black text-slate-950">Cash on Delivery</p>
              <p className="mt-1 text-sm font-bold text-slate-500">
                Payment status will be created as unpaid until payment is collected.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Items</h2>
            <div className="mt-5 grid gap-3">
              {items.map((item) => (
                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-3" key={item._id}>
                  <img className="size-16 rounded-xl object-cover" src={item.foodId?.image} alt={item.foodId?.name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black text-slate-950">{item.foodId?.name}</p>
                    <p className="mt-1 text-sm font-bold text-slate-500">Qty {item.quantity}</p>
                  </div>
                  <p className="font-black text-orange-600">
                    ${(Number(item.foodId?.price || 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">Summary</h2>
          <div className="mt-6 grid gap-4">
            <div className="flex justify-between text-sm font-bold text-slate-600">
              <span>Total Items</span>
              <span>{summary.totalItems}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-600">
              <span>Total Price</span>
              <span>${Number(summary.totalPrice || 0).toFixed(2)}</span>
            </div>
          </div>
          {orderMutation.isError && (
            <p className="mt-5 rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-700">
              {orderMutation.error?.response?.data?.message || 'Unable to place order.'}
            </p>
          )}
          <button
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 font-black text-white shadow-lg shadow-orange-500/25 transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={orderMutation.isPending || !isDeliveryComplete}
            type="submit"
          >
            <CheckCircle2 size={19} />
            {orderMutation.isPending ? 'Placing Order...' : 'Place Order'}
          </button>
        </aside>
      </form>
    </div>
  )
}

export default CheckoutPage
