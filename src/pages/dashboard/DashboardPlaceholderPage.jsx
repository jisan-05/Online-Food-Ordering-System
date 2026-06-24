import { Link, useLocation } from 'react-router-dom'

const pageContent = {
  '/dashboard/cart': {
    title: 'My Cart',
    text: 'Cart items will appear here when customers add foods from the menu.',
  },
  '/dashboard/orders': {
    title: 'My Orders',
    text: 'Customer order history, pending status, and completed deliveries will appear here.',
  },
  '/dashboard/wishlist': {
    title: 'Wishlist',
    text: 'Saved foods and favorite restaurant items will appear here.',
  },
}

function DashboardPlaceholderPage() {
  const { pathname } = useLocation()
  const content = pageContent[pathname] || pageContent['/dashboard/orders']

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Customer Dashboard</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">{content.title}</h1>
      <p className="mt-4 max-w-2xl leading-8 text-slate-600">{content.text}</p>
      <Link
        className="mt-8 inline-flex rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/25 hover:bg-rose-600"
        to="/foods"
      >
        Browse Foods
      </Link>
    </div>
  )
}

export default DashboardPlaceholderPage
