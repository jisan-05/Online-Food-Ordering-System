import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  Menu,
  PlusCircle,
  Soup,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const ownerLinks = [
  { label: 'Dashboard', to: '/owner', icon: LayoutDashboard, end: true },
  { label: 'Add Food', to: '/owner/add-food', icon: PlusCircle },
  { label: 'Manage Foods', to: '/owner/foods', icon: Soup },
  { label: 'Manage Orders', to: '/owner/orders', icon: ClipboardList },
  { label: 'Analytics', to: '/owner/analytics', icon: BarChart3 },
]

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
    isActive
      ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/15'
      : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600'
  }`

function OwnerSidebar({ onNavigate }) {
  const { appUser, user } = useAuth()

  return (
    <aside className="flex h-full flex-col">
      <div className="border-b border-slate-200 p-5">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">
          Restaurant Owner
        </p>
        <h2 className="mt-2 text-xl font-black text-slate-950">
          {user?.displayName || 'Restaurant Owner'}
        </h2>
        <p className="mt-1 truncate text-sm font-bold text-slate-500">{user?.email}</p>
        {appUser?.role && (
          <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-slate-400">{appUser.role}</p>
        )}
      </div>

      <nav className="grid gap-2 p-4">
        {ownerLinks.map(({ label, to, icon: Icon, end }) => (
          <NavLink className={linkClass} end={end} key={to} onClick={onNavigate} to={to}>
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

function OwnerDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <section className="bg-slate-50">
      <div className="mx-auto grid min-h-[calc(100vh-4.5rem)] max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
        <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
          <OwnerSidebar />
        </div>

        <div className="lg:hidden">
          <button
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
            Owner Menu
          </button>
        </div>

        {sidebarOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/40 p-4 lg:hidden">
            <div className="h-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <p className="font-black text-slate-950">Owner Dashboard</p>
                <button
                  className="grid size-10 place-items-center rounded-2xl border border-slate-200"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
              <OwnerSidebar onNavigate={() => setSidebarOpen(false)} />
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

export default OwnerDashboardLayout
