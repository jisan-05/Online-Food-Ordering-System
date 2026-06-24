import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl place-items-center px-4 py-12 text-center sm:px-6 lg:px-8">
      <div className="max-w-xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">404</p>
        <h1 className="mt-4 text-5xl font-black tracking-tight text-slate-950">Page not found</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          The route you are looking for does not exist in this project setup.
        </p>
        <Link className="mt-8 inline-flex rounded-2xl bg-orange-500 px-6 py-3 font-black text-white hover:bg-red-500" to="/">
          Back to home
        </Link>
      </div>
    </section>
  )
}

export default NotFoundPage
