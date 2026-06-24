import useAuth from '../hooks/useAuth'

function ProfilePage() {
  const { appUser, user } = useAuth()

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-orange-500">
          My Profile
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
          Account Details
        </h1>
        <p className="mt-4 max-w-2xl leading-8 text-slate-600">
          Review the account information used across orders, carts, and dashboard access.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-bold text-slate-500">Name</p>
            <p className="mt-1 truncate text-xl font-black text-slate-950">
              {user?.displayName || appUser?.name || 'Customer'}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-bold text-slate-500">Email</p>
            <p className="mt-1 truncate text-xl font-black text-slate-950">
              {user?.email || appUser?.email}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-bold text-slate-500">Role</p>
            <p className="mt-1 capitalize text-xl font-black text-slate-950">
              {appUser?.role || 'customer'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfilePage
