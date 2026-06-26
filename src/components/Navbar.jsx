import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, NavLink } from 'react-router-dom'
import { LogOut, Menu, ShieldCheck, ShoppingCart, Utensils, X } from 'lucide-react'
import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import useCartDrawer from '../hooks/useCartDrawer'
import { getCart } from '../services/cartService'
import { getNavbarPanel, isCustomerRole } from '../utils/roles'

const linkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-bold transition ${
    isActive ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-100'
  }`

function Navbar() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { appUser, user, logout, loading } = useAuth()
  const { openCart } = useCartDrawer()
  const role = appUser?.role
  const panel = getNavbarPanel(role)
  const canUseCart = !user || isCustomerRole(role)
  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: Boolean(user) && isCustomerRole(role),
  })
  const cartCount = cart?.summary?.totalItems || 0

  function closeMenu() {
    setOpen(false)
  }

  function handleLogout() {
    logout()
    queryClient.removeQueries({ queryKey: ['cart'] })
    closeMenu()
  }

  function handleCartClick() {
    closeMenu()
    openCart()
  }

  const navLinks = (
    <>
      <NavLink className={linkClass} end onClick={closeMenu} to="/">
        Home
      </NavLink>
      <NavLink className={linkClass} onClick={closeMenu} to="/foods">
        Foods
      </NavLink>
      {user && !loading && panel && (
        <>
          <NavLink className={linkClass} end={panel.end} onClick={closeMenu} to={panel.to}>
            {panel.label}
          </NavLink>
          
        </>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link className="flex shrink-0 items-center gap-3" onClick={closeMenu} to="/">
          <div className="grid size-11 place-items-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/25">
            <Utensils size={22} />
          </div>
          <div className="hidden sm:block">
            <p className="text-lg font-black tracking-tight text-slate-950">CraveHub</p>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-500">Food Platform</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm lg:flex">
          {navLinks}
        </nav>

        <div className="flex items-center gap-2">
          {canUseCart && (
            <button
              aria-label={`Open cart${cartCount ? `, ${cartCount} items` : ''}`}
              className="relative inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-orange-600"
              onClick={handleCartClick}
              type="button"
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:inline">Cart</span>
              {user && cartCount > 0 && (
                <span className="grid min-w-5 place-items-center rounded-full bg-orange-500 px-1.5 text-xs font-black leading-5 text-white">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <Link
                  className="inline-flex max-w-[180px] items-center gap-2 truncate rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
                  onClick={closeMenu}
                  to="/profile"
                >
                  <ShieldCheck size={16} />
                  <span className="truncate">{user.displayName || user.email}</span>
                </Link>
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
                  onClick={handleLogout}
                  type="button"
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
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid size-10 place-items-center rounded-2xl border border-slate-200 bg-white lg:hidden"
            onClick={() => setOpen((current) => !current)}
            type="button"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="grid gap-2">
            {navLinks}
            {user ? (
              <>
                <Link
                  className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
                  onClick={closeMenu}
                  to="/profile"
                >
                  Profile
                </Link>
                <button
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-left text-sm font-bold text-white"
                  onClick={handleLogout}
                  type="button"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100" onClick={closeMenu} to="/login">
                  Login
                </Link>
                <Link className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-white" onClick={closeMenu} to="/register">
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
