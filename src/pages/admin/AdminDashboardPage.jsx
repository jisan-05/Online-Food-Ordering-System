import { useQuery } from '@tanstack/react-query'
import { CreditCard, PackageCheck, UsersRound } from 'lucide-react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getAdminStats } from '../../services/adminService'

function AdminDashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-stats'], queryFn: getAdminStats })

  if (isLoading) {
    return <LoadingSpinner label="Loading admin dashboard" />
  }

  const cards = [
    { label: 'Total Users', value: data?.totalUsers || 0, icon: UsersRound, color: 'bg-cyan-50 text-cyan-700' },
    { label: 'Total Orders', value: data?.totalOrders || 0, icon: PackageCheck, color: 'bg-orange-50 text-orange-600' },
    { label: 'Total Revenue', value: `$${Number(data?.totalRevenue || 0).toFixed(2)}`, icon: CreditCard, color: 'bg-emerald-50 text-emerald-700' },
  ]

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Admin Dashboard</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Platform Overview</h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">Monitor users, orders, restaurants, foods, and revenue from one protected admin area.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" key={label}>
            <div className={`mb-5 grid size-12 place-items-center rounded-2xl ${color}`}><Icon size={24} /></div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboardPage
