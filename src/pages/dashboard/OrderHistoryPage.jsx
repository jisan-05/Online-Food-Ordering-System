import { useQuery } from '@tanstack/react-query'
import { ClipboardList, Eye, PackageCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getUserOrders } from '../../services/orderService'

function StatusBadge({ value, tone = 'orange' }) {
  const styles = {
    orange: 'bg-orange-50 text-orange-700',
    green: 'bg-emerald-50 text-emerald-700',
  }

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wide ${styles[tone]}`}>
      {value}
    </span>
  )
}

function OrderHistoryPage() {
  const { data: orders = [], isLoading, isError, error } = useQuery({
    queryKey: ['orders'],
    queryFn: getUserOrders,
  })

  if (isLoading) {
    return <LoadingSpinner label="Loading orders" />
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 font-bold text-rose-700">
        {error?.response?.data?.message || 'Unable to load orders.'}
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">My Orders</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Order History</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Review current and past orders placed from your cart.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <ClipboardList className="mx-auto text-orange-600" size={42} />
          <h2 className="mt-5 text-2xl font-black text-slate-950">No orders yet</h2>
          <p className="mt-3 text-slate-600">Your checkout orders will appear here.</p>
          <Link className="mt-7 inline-flex rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white" to="/foods">
            Browse Foods
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm" key={order._id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="grid size-12 place-items-center rounded-2xl bg-orange-50 text-orange-600">
                    <PackageCheck size={24} />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-950">Order #{order._id.slice(-8).toUpperCase()}</h2>
                    <p className="mt-1 text-sm font-bold text-slate-500">
                      {new Date(order.createdAt).toLocaleString()} · {order.foods.length} items
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge value={order.orderStatus} />
                  <StatusBadge tone="green" value={order.paymentStatus} />
                  <p className="font-black text-orange-600">${Number(order.totalPrice).toFixed(2)}</p>
                  <Link className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white hover:bg-orange-600" to={`/dashboard/orders/${order._id}`}>
                    <Eye size={17} />
                    Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderHistoryPage
