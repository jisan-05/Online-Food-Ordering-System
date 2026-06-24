import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { deleteAdminFood, getAdminFoods } from '../../services/adminService'

function AdminFoodsPage() {
  const queryClient = useQueryClient()
  const { data: foods = [], isLoading, isError, error } = useQuery({
    queryKey: ['admin-foods'],
    queryFn: getAdminFoods,
  })
  const deleteMutation = useMutation({
    mutationFn: deleteAdminFood,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-foods'] }),
  })

  if (isLoading) return <LoadingSpinner label="Loading foods" />
  if (isError) return <div className="rounded-2xl bg-rose-50 p-5 font-bold text-rose-700">{error?.response?.data?.message || 'Unable to load foods.'}</div>

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Manage Foods</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">All Foods</h1>
      </div>
      {foods.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">No foods found</h2>
          <p className="mt-3 text-slate-600">Foods created by restaurant owners will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {foods.map((food) => (
          <article className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[96px_1fr_auto]" key={food._id}>
            <img className="size-24 rounded-2xl object-cover" src={food.image} alt={food.name} />
            <div>
              <h2 className="text-xl font-black text-slate-950">{food.name}</h2>
              <p className="mt-1 text-sm font-bold text-orange-600">{food.category}</p>
              <p className="mt-2 line-clamp-2 leading-7 text-slate-600">{food.description}</p>
              <p className="mt-2 font-black text-slate-950">${Number(food.price).toFixed(2)}</p>
            </div>
            <button className="inline-flex h-fit items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700 hover:bg-rose-100" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(food._id)}>
              <Trash2 size={17} />
              Delete Food
            </button>
          </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminFoodsPage
