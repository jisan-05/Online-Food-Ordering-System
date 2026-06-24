import {
  CheckCircle2,
  Clock3,
  CreditCard,
  PackageCheck,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react'

const dashboardStats = [
  {
    label: 'Total Orders',
    value: '24',
    helper: '+4 this month',
    icon: ShoppingBag,
    style: 'bg-orange-50 text-orange-600',
  },
  {
    label: 'Pending Orders',
    value: '3',
    helper: 'Being prepared',
    icon: Clock3,
    style: 'bg-amber-50 text-amber-700',
  },
  {
    label: 'Completed Orders',
    value: '21',
    helper: 'Delivered successfully',
    icon: CheckCircle2,
    style: 'bg-emerald-50 text-emerald-700',
  },
  {
    label: 'Total Spending',
    value: '$486.50',
    helper: 'Lifetime orders',
    icon: CreditCard,
    style: 'bg-cyan-50 text-cyan-700',
  },
]

function DashboardHomePage() {
  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">
              Dashboard Home
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
              Customer Dashboard
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Track order activity, spending, and account shortcuts from one protected dashboard.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white">
            <TrendingUp size={18} />
            Active customer
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map(({ label, value, helper, icon: Icon, style }) => (
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm" key={label}>
            <div className={`mb-5 grid size-12 place-items-center rounded-2xl ${style}`}>
              <Icon size={24} />
            </div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
            <p className="mt-2 text-sm font-bold text-slate-500">{helper}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Recent Activity</h2>
          <div className="mt-5 grid gap-3">
            {['Chicken biryani order completed', 'Margherita pizza is pending', 'Wishlist updated with Sushi Box'].map((item) => (
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4" key={item}>
                <PackageCheck className="text-orange-600" size={20} />
                <p className="font-bold text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Spending Summary</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Sample dashboard data is ready to connect to real order APIs when order management is added.
          </p>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-3/4 rounded-full bg-orange-500" />
          </div>
          <p className="mt-3 text-sm font-bold text-slate-500">75% of monthly food budget used</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardHomePage
