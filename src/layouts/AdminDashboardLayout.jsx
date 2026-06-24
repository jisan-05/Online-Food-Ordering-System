import { BarChart3, ClipboardList, LayoutDashboard, Menu, Soup, Store, UsersRound, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const adminLinks = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Manage Users', to: '/admin/users', icon: UsersRound },
  { label: 'Manage Restaurants', to: '/admin/restaurants', icon: Store },
  { label: 'Manage Foods', to: '/admin/foods', icon: Soup },
  { label: 'Manage Orders', to: '/admin/orders', icon: ClipboardList },
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
]

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
    isActive
      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
      : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600'
  }`

function AdminSidebar({ onNavigate }) {
  return (
    <aside className="flex h-full flex-col">
      <div className="border-b border-slate-200 p-5">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">Admin Panel</p>
        <h2 className="mt-2 text-xl font-black text-slate-950">System Control</h2>
        <p className="mt-1 text-sm font-bold text-slate-500">Platform management</p>
      </div>
      <nav className="grid gap-2 p-4">
        {adminLinks.map(({ label, to, icon: Icon, end }) => (
          <NavLink className={linkClass} end={end} key={to} onClick={onNavigate} to={to}>
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

function AdminDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <section className="bg-slate-50">
      <div className="mx-auto grid min-h-[calc(100vh-4.5rem)] max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
          <AdminSidebar />
        </div>
        <div className="lg:hidden">
          <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm" onClick={() => setSidebarOpen(true)}>
            <Menu size={18} />
            Admin Menu
          </button>
        </div>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/40 p-4 lg:hidden">
            <div className="h-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <p className="font-black text-slate-950">Admin Dashboard</p>
                <button className="grid size-10 place-items-center rounded-2xl border border-slate-200" onClick={() => setSidebarOpen(false)}>
                  <X size={18} />
                </button>
              </div>
              <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </section>
  )
}

export default AdminDashboardLayout
