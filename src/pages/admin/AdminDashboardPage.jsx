import { useQuery } from '@tanstack/react-query'
import {
  CircleDollarSign,
  ClipboardList,
  Soup,
  TrendingUp,
  UsersRound,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getAdminAnalytics, getAdminStats } from '../../services/adminService'

const categoryColors = ['#f97316', '#06b6d4', '#10b981', '#f43f5e', '#8b5cf6', '#f59e0b']

function ChartCard({ title, icon: Icon, children }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-2xl bg-orange-50 text-orange-600">
          <Icon size={22} />
        </div>
        <h2 className="text-xl font-black text-slate-950">{title}</h2>
      </div>
      <div className="h-80">{children}</div>
    </article>
  )
}

function EmptyChart({ label }) {
  return (
    <div className="grid h-full place-items-center rounded-2xl bg-slate-50 text-center">
      <p className="px-6 font-bold text-slate-500">{label}</p>
    </div>
  )
}

function AdminDashboardPage() {
  const analyticsQuery = useQuery({ queryKey: ['admin-analytics'], queryFn: getAdminAnalytics })
  const statsQuery = useQuery({ queryKey: ['admin-stats'], queryFn: getAdminStats })

  if (analyticsQuery.isLoading || statsQuery.isLoading) {
    return <LoadingSpinner label="Loading admin dashboard" />
  }

  const analytics = analyticsQuery.data || {}
  const stats = statsQuery.data || {}
  const monthlyRevenue = analytics.monthlyRevenue || []
  const ordersPerMonth = analytics.ordersPerMonth || []
  const userGrowth = analytics.userGrowth || []
  const foodCategories = analytics.foodCategories || []

  const cards = [
    {
      label: 'Total Revenue',
      value: `$${Number(stats.totalRevenue || 0).toFixed(2)}`,
      icon: CircleDollarSign,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: ClipboardList,
      color: 'bg-orange-50 text-orange-600',
    },
    {
      label: 'Total Users',
      value: stats.totalUsers || 0,
      icon: UsersRound,
      color: 'bg-cyan-50 text-cyan-700',
    },
    {
      label: 'Categories',
      value: foodCategories.length,
      icon: Soup,
      color: 'bg-fuchsia-50 text-fuchsia-700',
    },
  ]

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Admin Dashboard</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Platform Overview & Analytics</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Monitor platform performance, track user growth, analyze monthly revenue streams, and view food categories statistics from one unified dashboard.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm" key={label}>
            <div className={`mb-4 grid size-11 place-items-center rounded-2xl ${color}`}>
              <Icon size={22} />
            </div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard icon={CircleDollarSign} title="Monthly Revenue">
          {monthlyRevenue.length ? (
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={monthlyRevenue} margin={{ left: 0, right: 12, top: 12 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Revenue']} />
                <Area dataKey="revenue" fill="url(#revenueGradient)" stroke="#f97316" strokeWidth={3} type="monotone" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="No revenue data yet. Completed orders will populate this chart." />
          )}
        </ChartCard>

        <ChartCard icon={ClipboardList} title="Orders Per Month">
          {ordersPerMonth.length ? (
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={ordersPerMonth} margin={{ left: 0, right: 12, top: 12 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="#06b6d4" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="No orders yet. Checkout activity will appear here." />
          )}
        </ChartCard>

        <ChartCard icon={TrendingUp} title="User Growth">
          {userGrowth.length ? (
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={userGrowth} margin={{ left: 0, right: 12, top: 12 }}>
                <defs>
                  <linearGradient id="usersGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                <Tooltip />
                <Area dataKey="users" fill="url(#usersGradient)" stroke="#10b981" strokeWidth={3} type="monotone" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="No user registration data yet." />
          )}
        </ChartCard>

        <ChartCard icon={Soup} title="Food Categories Statistics">
          {foodCategories.length ? (
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="48%"
                  data={foodCategories}
                  dataKey="foods"
                  innerRadius={58}
                  nameKey="category"
                  outerRadius={108}
                  paddingAngle={4}
                >
                  {foodCategories.map((entry, index) => (
                    <Cell fill={categoryColors[index % categoryColors.length]} key={entry.category} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="No food category data yet. Add foods to populate this chart." />
          )}
        </ChartCard>
      </div>
    </div>
  )
}

export default AdminDashboardPage
