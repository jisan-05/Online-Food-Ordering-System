import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getManageOrders, updateManagedOrderStatus } from '../../services/orderService'

function AdminOrdersPage() {
  const queryClient = useQueryClient()
  const { data: orders = [], isLoading, isError, error } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: getManageOrders,
  })
  const mutation = useMutation({
    mutationFn: ({ id, payload }) => updateManagedOrderStatus(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  })

  if (isLoading) return <LoadingSpinner label="Loading orders" />
  if (isError) return <div className="rounded-2xl bg-rose-50 p-5 font-bold text-rose-700">{error?.response?.data?.message || 'Unable to load orders.'}</div>

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Manage Orders</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">All Orders</h1>
      </div>
      {orders.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">No orders found</h2>
          <p className="mt-3 text-slate-600">Customer orders will appear here after checkout.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
          <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm xl:flex-row xl:items-center xl:justify-between" key={order._id}>
            <div>
              <h2 className="font-black text-slate-950">Order #{order._id.slice(-8).toUpperCase()}</h2>
              <p className="mt-1 text-sm font-bold text-slate-500">{order.userEmail} · {new Date(order.createdAt).toLocaleString()}</p>
              <p className="mt-2 font-black text-orange-600">${Number(order.totalPrice).toFixed(2)}</p>
              {order.deliveryDetails && (
                <div className="mt-3 max-w-sm rounded-2xl border border-slate-100 bg-slate-50 p-3.5 text-xs font-bold text-slate-600 shadow-inner">
                  <p className="font-black text-slate-900 mb-1.5 uppercase tracking-wider text-[10px]">Delivery Details</p>
                  <p className="text-slate-800"><span className="text-slate-400">Name:</span> {order.deliveryDetails.name || 'N/A'}</p>
                  <p className="mt-0.5 text-slate-800"><span className="text-slate-400">Phone:</span> {order.deliveryDetails.phone || 'N/A'}</p>
                  <p className="mt-1 text-slate-800"><span className="text-slate-400">Address:</span> {order.deliveryDetails.address || 'N/A'}</p>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <select className="min-h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black outline-none" disabled={mutation.isPending} onChange={(event) => mutation.mutate({ id: order._id, payload: { orderStatus: event.target.value } })} value={order.orderStatus}>
                {['pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled'].map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <select className="min-h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black outline-none" disabled={mutation.isPending} onChange={(event) => mutation.mutate({ id: order._id, payload: { paymentStatus: event.target.value } })} value={order.paymentStatus}>
                {['unpaid', 'paid', 'failed', 'refunded'].map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
          </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminOrdersPage
