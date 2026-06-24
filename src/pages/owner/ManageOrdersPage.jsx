import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, PackageX, Truck } from 'lucide-react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getManageOrders, updateManagedOrderStatus } from '../../services/orderService'

function ManageOrdersPage() {
  const queryClient = useQueryClient()
  const { data: orders = [], isLoading, isError, error } = useQuery({
    queryKey: ['owner-orders'],
    queryFn: getManageOrders,
  })
  const mutation = useMutation({
    mutationFn: ({ id, payload }) => updateManagedOrderStatus(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['owner-orders'] }),
  })

  if (isLoading) {
    return <LoadingSpinner label="Loading orders" />
  }

  if (isError) {
    return <div className="rounded-2xl bg-rose-50 p-5 font-bold text-rose-700">{error?.response?.data?.message || 'Unable to load orders.'}</div>
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Manage Orders</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Restaurant Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">No orders yet</h2>
          <p className="mt-3 text-slate-600">Incoming customer orders will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm" key={order._id}>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <h2 className="font-black text-slate-950">Order #{order._id.slice(-8).toUpperCase()}</h2>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  {order.userEmail} · {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="mt-3 font-black text-orange-600">${Number(order.totalPrice).toFixed(2)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black uppercase text-orange-700">{order.orderStatus}</span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase text-emerald-700">{order.paymentStatus}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700 hover:bg-emerald-100" disabled={mutation.isPending} onClick={() => mutation.mutate({ id: order._id, payload: { orderStatus: 'confirmed' } })}>
                  <CheckCircle2 size={17} />
                  Accept
                </button>
                <button className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700 hover:bg-rose-100" disabled={mutation.isPending} onClick={() => mutation.mutate({ id: order._id, payload: { orderStatus: 'cancelled' } })}>
                  <PackageX size={17} />
                  Reject
                </button>
                <select className="min-h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black outline-none" disabled={mutation.isPending} onChange={(event) => mutation.mutate({ id: order._id, payload: { orderStatus: event.target.value } })} value={order.orderStatus}>
                  {['pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled'].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <select className="min-h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black outline-none" disabled={mutation.isPending} onChange={(event) => mutation.mutate({ id: order._id, payload: { paymentStatus: event.target.value } })} value={order.paymentStatus}>
                  {['unpaid', 'paid', 'failed', 'refunded'].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button className="inline-flex items-center gap-2 rounded-2xl bg-cyan-50 px-4 py-3 text-sm font-black text-cyan-700 hover:bg-cyan-100" disabled={mutation.isPending} onClick={() => mutation.mutate({ id: order._id, payload: { orderStatus: 'delivering' } })}>
                  <Truck size={17} />
                  Out for Delivery
                </button>
              </div>
            </div>
          </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageOrdersPage
