import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, NavLink } from 'react-router-dom'
import { LogOut, Menu, ShieldCheck, ShoppingCart, Utensils, X } from 'lucide-react'
import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import { getCart } from '../services/cartService'

const linkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-bold transition ${
    isActive ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-100'
  }`

function Navbar() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { appUser, user, logout } = useAuth()
  const canManageRestaurant = appUser?.role === 'owner' || appUser?.role === 'admin'
  const canManageAdmin = appUser?.role === 'admin'
  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: Boolean(user),
  })
  const cartCount = cart?.summary?.totalItems || 0

  function handleLogout() {
    logout()
    queryClient.removeQueries({ queryKey: ['cart'] })
    setOpen(false)
  }

  const cartLink = (onNavigate, compact = false) =>
    user ? (
      <NavLink
        aria-label={`Cart with ${cartCount} item${cartCount === 1 ? '' : 's'}`}
        className={({ isActive }) =>
          `relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
            isActive ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-100'
          } ${compact ? 'justify-between rounded-2xl px-4 py-3' : ''}`
        }
        onClick={onNavigate}
        to="/dashboard/cart"
      >
        <span className="inline-flex items-center gap-2">
          <ShoppingCart size={17} />
          Cart
        </span>
        <span className="grid min-w-5 place-items-center rounded-full bg-orange-500 px-1.5 text-xs font-black leading-5 text-white">
          {cartCount}
        </span>
      </NavLink>
    ) : null

  const nav = (onNavigate) => (
    <>
      <NavLink className={linkClass} onClick={onNavigate} to="/">
        Home
      </NavLink>
      <NavLink className={linkClass} onClick={onNavigate} to="/foods">
        Foods
      </NavLink>
      {user && (
        <>
          <NavLink className={linkClass} onClick={onNavigate} to="/dashboard">
            Dashboard
          </NavLink>
          {cartLink(onNavigate)}
          {canManageRestaurant && (
            <NavLink className={linkClass} onClick={onNavigate} to="/owner">
              Owner
            </NavLink>
          )}
          {canManageAdmin && (
            <NavLink className={linkClass} onClick={onNavigate} to="/admin">
              Admin
            </NavLink>
          )}
        </>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" to="/">
          <div className="grid size-11 place-items-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/25">
            <Utensils size={22} />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-slate-950">CraveHub</p>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
              Food Platform
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm md:flex">
          {nav()}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                <ShieldCheck size={16} />
                {user.displayName || user.email}
              </span>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="rounded-full px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100" to="/login">
                Login
              </Link>
              <Link className="rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:bg-red-500" to="/register">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="grid size-10 place-items-center rounded-2xl border border-slate-200 bg-white md:hidden"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="grid gap-2">
            {nav(() => setOpen(false))}
            {user ? (
              <>
                <button
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-left text-sm font-bold text-white"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100" to="/login">
                  Login
                </Link>
                <Link className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-white" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
