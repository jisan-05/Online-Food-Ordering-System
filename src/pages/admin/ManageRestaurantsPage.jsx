import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { createRestaurant, deleteRestaurant, getAdminRestaurants } from '../../services/adminService'

const emptyRestaurant = { name: '', cuisine: '', address: '', image: '', ownerEmail: '' }

function ManageRestaurantsPage() {
  const [form, setForm] = useState(emptyRestaurant)
  const queryClient = useQueryClient()
  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ['admin-restaurants'],
    queryFn: getAdminRestaurants,
  })
  const createMutation = useMutation({
    mutationFn: createRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-restaurants'] })
      setForm(emptyRestaurant)
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteRestaurant,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-restaurants'] }),
  })

  if (isLoading) return <LoadingSpinner label="Loading restaurants" />

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Manage Restaurants</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Restaurants</h1>
      </div>

      <form className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2" onSubmit={(event) => { event.preventDefault(); createMutation.mutate(form) }}>
        {Object.entries({ name: 'Restaurant name', cuisine: 'Cuisine', address: 'Address', image: 'Image URL', ownerEmail: 'Owner email' }).map(([field, label]) => (
          <input className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 font-bold outline-none focus:border-orange-300" key={field} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} placeholder={label} required={field !== 'image' && field !== 'ownerEmail'} value={form[field]} />
        ))}
        <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-black text-white md:w-fit" disabled={createMutation.isPending}>
          <Plus size={18} />
          Add Restaurant
        </button>
      </form>

      {restaurants.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">No restaurants yet</h2>
          <p className="mt-3 text-slate-600">Add restaurant partners with the form above.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {restaurants.map((restaurant) => (
          <article className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between" key={restaurant._id}>
            <div>
              <h2 className="font-black text-slate-950">{restaurant.name}</h2>
              <p className="mt-1 text-sm font-bold text-slate-500">{restaurant.cuisine} · {restaurant.address}</p>
              <p className="mt-2 text-sm font-bold text-orange-600">{restaurant.ownerEmail || 'No owner assigned'}</p>
            </div>
            <button className="inline-flex w-fit items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700 hover:bg-rose-100" disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate(restaurant._id)}>
              <Trash2 size={17} />
              Delete Restaurant
            </button>
          </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageRestaurantsPage
