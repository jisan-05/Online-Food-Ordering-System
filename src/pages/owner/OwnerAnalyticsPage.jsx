import { useQuery } from '@tanstack/react-query'
import { BarChart3, CircleDollarSign, ClipboardList, Soup } from 'lucide-react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getFoods } from '../../services/foodService'
import { getManageOrders } from '../../services/orderService'

function OwnerAnalyticsPage() {
  const foodsQuery = useQuery({ queryKey: ['owner-foods-summary'], queryFn: () => getFoods({ limit: 50 }) })
  const ordersQuery = useQuery({ queryKey: ['owner-orders'], queryFn: getManageOrders })

  if (foodsQuery.isLoading || ordersQuery.isLoading) {
    return <LoadingSpinner label="Loading analytics" />
  }

  const foods = foodsQuery.data?.foods || []
  const orders = ordersQuery.data || []
  const revenue = orders.reduce((total, order) => total + Number(order.totalPrice || 0), 0)
  const completedOrders = orders.filter((order) => order.orderStatus === 'completed').length

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Analytics</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Performance Snapshot</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Menu Items', foods.length, Soup],
          ['Orders', orders.length, ClipboardList],
          ['Completed', completedOrders, BarChart3],
          ['Revenue', `$${revenue.toFixed(2)}`, CircleDollarSign],
        ].map(([label, value, Icon]) => (
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm" key={label}>
            <Icon className="text-orange-600" size={26} />
            <p className="mt-4 text-sm font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
          </article>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Order Status Mix</h2>
        <div className="mt-5 grid gap-3">
          {['pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled'].map((status) => {
            const count = orders.filter((order) => order.orderStatus === status).length
            const width = orders.length ? `${Math.max((count / orders.length) * 100, 4)}%` : '4%'

            return (
              <div key={status}>
                <div className="mb-2 flex justify-between text-sm font-black text-slate-600">
                  <span className="capitalize">{status}</span>
                  <span>{count}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-orange-500" style={{ width }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default OwnerAnalyticsPage
