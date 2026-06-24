import { useQuery } from '@tanstack/react-query'
import { CreditCard, PackageCheck, Soup } from 'lucide-react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getFoods } from '../../services/foodService'
import { getManageOrders } from '../../services/orderService'

function OwnerDashboardPage() {
  const foodsQuery = useQuery({ queryKey: ['owner-foods-summary'], queryFn: () => getFoods({ limit: 50 }) })
  const ordersQuery = useQuery({ queryKey: ['owner-orders'], queryFn: getManageOrders })

  if (foodsQuery.isLoading || ordersQuery.isLoading) {
    return <LoadingSpinner label="Loading owner dashboard" />
  }

  const totalFoods = foodsQuery.data?.pagination?.total || foodsQuery.data?.foods?.length || 0
  const orders = ordersQuery.data || []
  const revenue = orders.reduce((total, order) => total + Number(order.totalPrice || 0), 0)
  const cards = [
    { label: 'Total Foods', value: totalFoods, icon: Soup, color: 'bg-orange-50 text-orange-600' },
    { label: 'Total Orders', value: orders.length, icon: PackageCheck, color: 'bg-cyan-50 text-cyan-700' },
    { label: 'Revenue', value: `$${revenue.toFixed(2)}`, icon: CreditCard, color: 'bg-emerald-50 text-emerald-700' },
  ]

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Owner Dashboard</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Restaurant Overview</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Manage menu items, orders, delivery progress, and restaurant performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" key={label}>
            <div className={`mb-5 grid size-12 place-items-center rounded-2xl ${color}`}>
              <Icon size={24} />
            </div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default OwnerDashboardPage
