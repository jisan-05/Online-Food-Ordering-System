import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function MainLayout() {
  const { pathname } = useLocation()
  const isDashboardRoute = ['/dashboard', '/owner', '/admin'].some((route) =>
    pathname.startsWith(route),
  )

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isDashboardRoute && <Footer />}
    </div>
  )
}

export default MainLayout
