import { ArrowLeft, Bike, CheckCircle2, ChefHat, ClipboardList, CreditCard, MapPin, PackageCheck, Truck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getOrder } from '../../services/orderService'

function statusBadgeClass(status) {
  if (status === 'completed' || status === 'paid') return 'bg-emerald-50 text-emerald-700'
  if (status === 'cancelled' || status === 'failed') return 'bg-rose-50 text-rose-700'
  if (status === 'refunded') return 'bg-violet-50 text-violet-700'
  return 'bg-orange-50 text-orange-700'
}

function OrderDetailsPage() {
  const { id } = useParams()
  const { data: order, isLoading, isError, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(id),
    enabled: Boolean(id),
    refetchInterval: 5000, // Poll every 5 seconds to show live updates! Very premium.
  })

  if (isLoading) {
    return <LoadingSpinner label="Loading order details" />
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 font-bold text-rose-700">
        {error?.response?.data?.message || 'Unable to load order.'}
      </div>
    )
  }

  // Stepper tracking steps definition
  const steps = [
    { key: 'pending', label: 'Order Placed', desc: 'Awaiting restaurant approval', icon: ClipboardList },
    { key: 'confirmed', label: 'Confirmed', desc: 'Accepted by kitchen', icon: PackageCheck },
    { key: 'preparing', label: 'Preparing', desc: 'Meal is being cooked', icon: ChefHat },
    { key: 'delivering', label: 'Out for Delivery', desc: 'Rider is on the way', icon: Truck },
    { key: 'completed', label: 'Delivered', desc: 'Enjoy your meal!', icon: CheckCircle2 },
  ]

  const statusIndexMap = {
    pending: 0,
    confirmed: 1,
    preparing: 2,
    delivering: 3,
    completed: 4,
  }

  const currentStepIndex = statusIndexMap[order.orderStatus] ?? -1
  const isCancelled = order.orderStatus === 'cancelled'

  return (
    <div className="grid gap-6">
      <Link className="inline-flex w-fit items-center gap-2 text-sm font-black text-slate-600 hover:text-orange-600" to="/dashboard/orders">
        <ArrowLeft size={17} />
        Back to orders
      </Link>

      {/* Header Info */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Customer Order Tracking</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <div className="flex gap-2">
            <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black uppercase ${statusBadgeClass(order.orderStatus)}`}>
              {order.orderStatus}
            </span>
            <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black uppercase ${statusBadgeClass(order.paymentStatus)}`}>
              {order.paymentStatus}
            </span>
          </div>
        </div>
        <p className="mt-3 font-bold text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
      </div>

      {/* Status Stepper Tracker */}
      {!isCancelled ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950 mb-6">Delivery Progress</h2>
          
          <div className="relative flex flex-col md:flex-row justify-between gap-8 md:gap-4 md:items-start px-2 py-4">
            {/* Background connecting progress line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 hidden md:block" />
            <div 
              className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 transition-all duration-1000 hidden md:block"
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, idx) => {
              const StepIcon = step.icon
              const isCompleted = idx < currentStepIndex
              const isActive = idx === currentStepIndex

              return (
                <div key={step.key} className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-2 flex-1 text-left md:text-center">
                  {/* Circle Indicator */}
                  <div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      isCompleted
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                        : isActive
                        ? 'bg-slate-950 text-white ring-4 ring-orange-100 scale-110 shadow-lg shadow-slate-950/10'
                        : 'bg-white border-2 border-slate-200 text-slate-400'
                    }`}
                  >
                    <StepIcon size={20} className={isActive ? 'animate-pulse' : ''} />
                  </div>

                  {/* Labels */}
                  <div className="mt-0 md:mt-2">
                    <p className={`font-black text-sm transition-colors ${
                      isActive ? 'text-slate-950' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </p>
                    <p className="text-xs font-bold text-slate-400 mt-0.5 max-w-[150px] leading-relaxed mx-auto">
                      {step.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center">
          <h2 className="text-2xl font-black text-rose-800">Order Cancelled</h2>
          <p className="mt-2 text-sm font-semibold text-rose-600">
            This order has been cancelled by the restaurant or customer and is no longer being processed.
          </p>
        </div>
      )}

      {/* Live Map Tracker simulation (active during Out for Delivery stage) */}
      {order.orderStatus === 'delivering' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
                <Bike className="text-orange-500 animate-bounce" size={22} />
                Live Rider Tracking
              </h2>
              <p className="text-sm font-bold text-slate-500 mt-1">
                Rider John is heading your way on a Vespa scooter!
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">ETA</span>
              <p className="text-2xl font-black text-orange-600">12 mins away</p>
            </div>
          </div>

          {/* Styled Map Simulator Container */}
          <div className="relative w-full h-44 rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 shadow-inner mt-4">
            {/* Grid street layout */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] bg-[size:20px_20px]" />
            
            {/* CSS style block for custom drive simulation animations */}
            <style>{`
              @keyframes dash {
                to {
                  stroke-dashoffset: -40;
                }
              }
              @keyframes pulsate {
                0% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.3); opacity: 1; }
                100% { transform: scale(1); opacity: 0.8; }
              }
              @keyframes driveAlong {
                0% { offset-distance: 0%; }
                100% { offset-distance: 100%; }
              }
            `}</style>

            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              {/* Delivery Path line */}
              <path
                id="deliveryPath"
                d="M 60,90 Q 200,30 350,90 T 700,90"
                fill="none"
                stroke="#334155"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M 60,90 Q 200,30 350,90 T 700,90"
                fill="none"
                stroke="#f97316"
                strokeWidth="4"
                strokeDasharray="8 6"
                strokeLinecap="round"
                style={{ animation: 'dash 2s linear infinite' }}
              />

              {/* Start node: CraveHub Restaurant */}
              <g transform="translate(60, 90)">
                <circle r="12" fill="#1e293b" stroke="#f97316" strokeWidth="3" />
                <circle r="4" fill="#f97316" />
                <text y="-20" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">CRAVEHUB</text>
              </g>

              {/* End node: Home */}
              <g transform="translate(700, 90)">
                <circle r="12" fill="#1e293b" stroke="#10b981" strokeWidth="3" style={{ animation: 'pulsate 2s infinite' }} />
                <circle r="4" fill="#10b981" />
                <text y="-20" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">HOME</text>
              </g>

              {/* Moving Scooter Marker */}
              <g style={{
                offsetPath: "path('M 60,90 Q 200,30 350,90 T 700,90')",
                animation: 'driveAlong 12s linear infinite',
              }}>
                {/* Circle pointer background */}
                <circle r="14" fill="#f97316" className="shadow-lg" />
                {/* Embedded bike outline */}
                <path
                  d="M -7,2 A 2,2 0 1,1 -7,-2 A 2,2 0 1,1 -7,2 M 7,2 A 2,2 0 1,1 7,-2 A 2,2 0 1,1 7,2 M -7,0 L 7,0 M -2,-5 L 2,0 L -2,5"
                  stroke="#ffffff"
                  strokeWidth="2"
                  fill="none"
                />
              </g>
            </svg>
            
            {/* Interactive Status Card on bottom left of map */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-xl text-left">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Courier Dispatch</p>
              <p className="text-xs font-black text-white mt-0.5">Vespa #30282</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Foods vs Payment/Status Info */}
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Left column: Food items */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-black text-slate-950">
            <PackageCheck className="text-orange-600" size={21} />
            Ordered Foods
          </h2>
          <div className="mt-5 grid gap-3">
            {order.foods.map((food) => (
              <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-3" key={food.foodId}>
                <img className="size-16 rounded-xl object-cover" src={food.image} alt={food.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-black text-slate-950">{food.name}</p>
                  <p className="mt-1 text-sm font-bold text-slate-500">
                    {food.category} · Qty {food.quantity}
                  </p>
                </div>
                <p className="font-black text-orange-600">${(food.price * food.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: delivery & payments */}
        <aside className="grid h-fit gap-4">
          {/* Delivery location info */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-black text-slate-950">
              <MapPin className="text-orange-600" size={21} />
              Destination
            </h2>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 space-y-2 text-sm">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Recipient</p>
                <p className="font-black text-slate-950 mt-0.5">{order.deliveryDetails?.name || 'Customer'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Phone</p>
                <p className="font-bold text-slate-700 mt-0.5">{order.deliveryDetails?.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">Address</p>
                <p className="font-bold text-slate-700 mt-0.5">{order.deliveryDetails?.address || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xl font-black text-slate-950">
              <CreditCard className="text-orange-600" size={21} />
              Payment Summary
            </h2>
            
            <div className="mt-5 grid gap-2.5 text-sm border-b border-slate-100 pb-4">
              <div className="flex justify-between font-bold text-slate-600">
                <span>Subtotal</span>
                <span>${Number(order.subtotalPrice || order.totalPrice).toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between font-bold text-emerald-600">
                  <span>Discount ({order.couponCode})</span>
                  <span>-${Number(order.discountAmount).toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4">
              <span className="font-black text-slate-950">Total Paid</span>
              <span className="text-2xl font-black text-orange-600">${Number(order.totalPrice).toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default OrderDetailsPage
