import useAuth from '../hooks/useAuth'

function ProfilePage() {
  const { user } = useAuth()

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white bg-white p-6 shadow-xl shadow-slate-900/5">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-500">
          Protected route
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
          Authentication is connected.
        </h1>
        <p className="mt-4 max-w-2xl leading-8 text-slate-600">
          This placeholder page confirms private routing without adding food
          ordering features yet.
        </p>
        <div className="mt-8 rounded-3xl bg-slate-50 p-5">
          <p className="text-sm font-bold text-slate-500">Signed in as</p>
          <p className="mt-1 text-xl font-black text-slate-950">
            {user?.displayName || user?.email}
          </p>
        </div>
      </div>
    </section>
  )
}

export default ProfilePage
