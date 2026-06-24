import { useQuery } from '@tanstack/react-query'
import {
  CheckCircle2,
  Clock3,
  CreditCard,
  PackageCheck,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getCart } from '../../services/cartService'
import { getUserOrders } from '../../services/orderService'

const completedStatuses = ['completed']
const pendingStatuses = ['pending', 'confirmed', 'preparing', 'delivering']

function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`
}

function DashboardHomePage() {
  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: getUserOrders,
  })
  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  })

  if (ordersQuery.isLoading || cartQuery.isLoading) {
    return <LoadingSpinner label="Loading dashboard" />
  }

  if (ordersQuery.isError || cartQuery.isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 font-bold text-rose-700">
        {ordersQuery.error?.response?.data?.message ||
          cartQuery.error?.response?.data?.message ||
          'Unable to load dashboard data.'}
      </div>
    )
  }

  const orders = ordersQuery.data || []
  const cart = cartQuery.data || { items: [], summary: { totalItems: 0, totalPrice: 0 } }
  const pendingOrders = orders.filter((order) => pendingStatuses.includes(order.orderStatus))
  const completedOrders = orders.filter((order) => completedStatuses.includes(order.orderStatus))
  const totalSpending = orders.reduce((total, order) => total + Number(order.totalPrice || 0), 0)
  const latestOrders = orders.slice(0, 4)

  const dashboardStats = [
    {
      label: 'Total Orders',
      value: orders.length,
      helper: orders.length ? 'All orders placed' : 'No orders yet',
      icon: ShoppingBag,
      style: 'bg-orange-50 text-orange-600',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders.length,
      helper: pendingOrders.length ? 'Currently in progress' : 'Nothing pending',
      icon: Clock3,
      style: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'Completed Orders',
      value: completedOrders.length,
      helper: completedOrders.length ? 'Delivered successfully' : 'No completed orders',
      icon: CheckCircle2,
      style: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Total Spending',
      value: formatCurrency(totalSpending),
      helper: 'Lifetime order value',
      icon: CreditCard,
      style: 'bg-cyan-50 text-cyan-700',
    },
  ]

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">
              Dashboard Home
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
              Customer Dashboard
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Track real cart items, order progress, and spending from your account.
            </p>
          </div>
          <Link
            className="inline-flex w-fit items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-orange-600"
            to="/dashboard/cart"
          >
            <ShoppingCart size={18} />
            View Cart
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map(({ label, value, helper, icon: Icon, style }) => (
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm" key={label}>
            <div className={`mb-5 grid size-12 place-items-center rounded-2xl ${style}`}>
              <Icon size={24} />
            </div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
            <p className="mt-2 text-sm font-bold text-slate-500">{helper}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-black text-slate-950">Recent Orders</h2>
            <Link className="text-sm font-black text-orange-600 hover:text-rose-600" to="/dashboard/orders">
              View all
            </Link>
          </div>

          {latestOrders.length ? (
            <div className="mt-5 grid gap-3">
              {latestOrders.map((order) => (
                <Link
                  className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4 transition hover:bg-orange-50"
                  key={order._id}
                  to={`/dashboard/orders/${order._id}`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <PackageCheck className="shrink-0 text-orange-600" size={20} />
                    <div className="min-w-0">
                      <p className="truncate font-black text-slate-800">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                        {order.orderStatus} · {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="shrink-0 font-black text-orange-600">
                    {formatCurrency(order.totalPrice)}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl bg-slate-50 p-6 text-center">
              <p className="font-black text-slate-950">No orders yet</p>
              <p className="mt-2 text-sm font-bold text-slate-500">
                Your order history will appear after checkout.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-orange-50 text-orange-600">
              <TrendingUp size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-950">Cart Snapshot</h2>
              <p className="text-sm font-bold text-slate-500">Current checkout readiness</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="flex items-center justify-between text-sm font-bold text-slate-600">
              <span>Items in cart</span>
              <span>{cart.summary.totalItems}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold text-slate-600">
              <span>Cart subtotal</span>
              <span>{formatCurrency(cart.summary.totalPrice)}</span>
            </div>
            <Link
              className="mt-2 rounded-2xl bg-orange-500 px-5 py-3 text-center text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-rose-600"
              to={cart.items.length ? '/dashboard/checkout' : '/foods'}
            >
              {cart.items.length ? 'Continue Checkout' : 'Browse Foods'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHomePage
