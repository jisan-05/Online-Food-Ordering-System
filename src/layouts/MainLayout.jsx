import { Outlet, useLocation } from 'react-router-dom'
import CartDrawer from '../components/cart/CartDrawer'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { CartDrawerProvider } from '../context/CartDrawerContext'

function MainLayout() {
  const { pathname } = useLocation()
  const isDashboardRoute = ['/dashboard', '/owner', '/admin'].some((route) =>
    pathname.startsWith(route),
  )

  return (
    <CartDrawerProvider>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        {!isDashboardRoute && <Footer />}
        <CartDrawer />
      </div>
    </CartDrawerProvider>
  )
}

export default MainLayout
