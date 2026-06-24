import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Edit3, Save, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { deleteFood, getFoods, updateFood } from '../../services/foodService'

function ManageFoodsPage() {
  const [editingFood, setEditingFood] = useState(null)
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['owner-foods'],
    queryFn: () => getFoods({ limit: 50 }),
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateFood(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-foods'] })
      queryClient.invalidateQueries({ queryKey: ['foods'] })
      setEditingFood(null)
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteFood,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-foods'] })
      queryClient.invalidateQueries({ queryKey: ['foods'] })
    },
  })

  if (isLoading) {
    return <LoadingSpinner label="Loading foods" />
  }

  if (isError) {
    return <div className="rounded-2xl bg-rose-50 p-5 font-bold text-rose-700">{error?.response?.data?.message || 'Unable to load foods.'}</div>
  }

  function updateEditing(field, value) {
    setEditingFood((current) => ({ ...current, [field]: value }))
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Manage Foods</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Menu Inventory</h1>
      </div>

      <div className="grid gap-4">
        {data.foods.map((food) => (
          <article className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[96px_1fr_auto]" key={food._id}>
            <img className="size-24 rounded-2xl object-cover" src={food.image} alt={food.name} />
            <div>
              <h2 className="text-xl font-black text-slate-950">{food.name}</h2>
              <p className="mt-1 text-sm font-bold text-orange-600">{food.category}</p>
              <p className="mt-2 line-clamp-2 leading-7 text-slate-600">{food.description}</p>
              <p className="mt-2 font-black text-slate-950">${Number(food.price).toFixed(2)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <button className="inline-flex items-center gap-2 rounded-2xl bg-cyan-50 px-4 py-3 text-sm font-black text-cyan-700 hover:bg-cyan-100" onClick={() => setEditingFood(food)}>
                <Edit3 size={17} />
                Edit
              </button>
              <button className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700 hover:bg-rose-100" onClick={() => deleteMutation.mutate(food._id)}>
                <Trash2 size={17} />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {editingFood && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
          <form
            className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
            onSubmit={(event) => {
              event.preventDefault()
              updateMutation.mutate({
                id: editingFood._id,
                payload: { ...editingFood, price: Number(editingFood.price) },
              })
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-slate-950">Edit Food</h2>
              <button className="grid size-10 place-items-center rounded-2xl border border-slate-200" onClick={() => setEditingFood(null)} type="button">
                <X size={18} />
              </button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input className="min-h-12 rounded-2xl border border-slate-200 px-4 font-bold outline-none" onChange={(event) => updateEditing('name', event.target.value)} value={editingFood.name} />
              <input className="min-h-12 rounded-2xl border border-slate-200 px-4 font-bold outline-none" onChange={(event) => updateEditing('category', event.target.value)} value={editingFood.category} />
              <input className="min-h-12 rounded-2xl border border-slate-200 px-4 font-bold outline-none" onChange={(event) => updateEditing('price', event.target.value)} type="number" value={editingFood.price} />
              <input className="min-h-12 rounded-2xl border border-slate-200 px-4 font-bold outline-none" onChange={(event) => updateEditing('restaurantId', event.target.value)} value={editingFood.restaurantId} />
              <input className="min-h-12 rounded-2xl border border-slate-200 px-4 font-bold outline-none md:col-span-2" onChange={(event) => updateEditing('image', event.target.value)} value={editingFood.image} />
              <textarea className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3 font-bold outline-none md:col-span-2" onChange={(event) => updateEditing('description', event.target.value)} value={editingFood.description} />
            </div>
            <button className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-black text-white" disabled={updateMutation.isPending}>
              <Save size={18} />
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default ManageFoodsPage
