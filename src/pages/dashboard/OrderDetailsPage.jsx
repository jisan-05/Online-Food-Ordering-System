import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, CreditCard, PackageCheck, Truck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getOrder, updateOrderStatus } from '../../services/orderService'

function OrderDetailsPage() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { data: order, isLoading, isError, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(id),
    enabled: Boolean(id),
  })
  const statusMutation = useMutation({
    mutationFn: (payload) => updateOrderStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  if (isLoading) {
    return <LoadingSpinner label="Loading order details" />
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 font-bold text-rose-700">
        {error?.response?.data?.message || 'Unable to load order.'}
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <Link className="inline-flex w-fit items-center gap-2 text-sm font-black text-slate-600 hover:text-orange-600" to="/dashboard/orders">
        <ArrowLeft size={17} />
        Back to orders
      </Link>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Order Details</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
          Order #{order._id.slice(-8).toUpperCase()}
        </h1>
        <p className="mt-3 font-bold text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-black text-slate-950">
            <PackageCheck className="text-orange-600" size={21} />
            Ordered Foods
          </h2>
          <div className="mt-5 grid gap-3">
            {order.foods.map((food) => (
              <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-3" key={food.foodId}>
                <img className="size-16 rounded-xl object-cover" src={food.image} alt={food.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-black text-slate-950">{food.name}</p>
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    {food.category} · Qty {food.quantity}
                  </p>
                </div>
                <p className="font-black text-orange-600">${(food.price * food.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="grid h-fit gap-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-black text-slate-950">
              <Truck className="text-orange-600" size={21} />
              Status
            </h2>
            <div className="mt-5 grid gap-3">
              <select
                className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 font-black outline-none"
                disabled={statusMutation.isPending}
                onChange={(event) => statusMutation.mutate({ orderStatus: event.target.value })}
                value={order.orderStatus}
              >
                {['pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled'].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <select
                className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 font-black outline-none"
                disabled={statusMutation.isPending}
                onChange={(event) => statusMutation.mutate({ paymentStatus: event.target.value })}
                value={order.paymentStatus}
              >
                {['unpaid', 'paid', 'failed', 'refunded'].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-black text-slate-950">
              <CreditCard className="text-orange-600" size={21} />
              Payment Summary
            </h2>
            <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
              <span className="font-black text-slate-950">Total Price</span>
              <span className="text-2xl font-black text-orange-600">${Number(order.totalPrice).toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default OrderDetailsPage
