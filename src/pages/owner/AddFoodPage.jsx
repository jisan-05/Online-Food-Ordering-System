import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { useState } from 'react'
import { createFood } from '../../services/foodService'

const emptyFood = {
  name: '',
  image: '',
  category: '',
  price: '',
  description: '',
  restaurantId: '66a111111111111111111111',
}

function AddFoodPage() {
  const [form, setForm] = useState(emptyFood)
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: createFood,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods'] })
      setForm(emptyFood)
    },
  })

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    mutation.mutate({ ...form, price: Number(form.price) })
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Add Food</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Create Menu Item</h1>

      <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <input className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 font-bold outline-none focus:border-orange-300" onChange={(event) => updateField('name', event.target.value)} placeholder="Food name" required value={form.name} />
          <input className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 font-bold outline-none focus:border-orange-300" onChange={(event) => updateField('category', event.target.value)} placeholder="Category" required value={form.category} />
          <input className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 font-bold outline-none focus:border-orange-300" min="0" onChange={(event) => updateField('price', event.target.value)} placeholder="Price" required type="number" value={form.price} />
          <input className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 font-bold outline-none focus:border-orange-300" onChange={(event) => updateField('restaurantId', event.target.value)} placeholder="Restaurant ID" required value={form.restaurantId} />
          <input className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 font-bold outline-none focus:border-orange-300 md:col-span-2" onChange={(event) => updateField('image', event.target.value)} placeholder="Image URL" required value={form.image} />
          <textarea className="min-h-32 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold outline-none focus:border-orange-300 md:col-span-2" onChange={(event) => updateField('description', event.target.value)} placeholder="Description" required value={form.description} />
        </div>

        {mutation.isError && (
          <p className="rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-700">
            {mutation.error?.response?.data?.message || 'Unable to add food.'}
          </p>
        )}
        {mutation.isSuccess && (
          <p className="rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
            Food added successfully.
          </p>
        )}

        <button className="inline-flex w-fit items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 font-black text-white shadow-lg shadow-orange-500/25 hover:bg-rose-600 disabled:opacity-60" disabled={mutation.isPending}>
          <Save size={18} />
          {mutation.isPending ? 'Saving...' : 'Add Food'}
        </button>
      </form>
    </div>
  )
}

export default AddFoodPage
