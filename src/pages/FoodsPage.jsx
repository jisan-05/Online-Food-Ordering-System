import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import FoodCard from '../components/foods/FoodCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { getFoods } from '../services/foodService'

const fallbackCategories = ['All', 'Pizza', 'Burger', 'Sushi', 'Dessert', 'Healthy']

function FoodsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || 'All'
  const page = Number(searchParams.get('page') || 1)
  const limit = 9

  const queryParams = useMemo(
    () => ({
      search: search || undefined,
      category: category === 'All' ? undefined : category,
      page,
      limit,
    }),
    [category, page, search],
  )

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['foods', queryParams],
    queryFn: () => getFoods(queryParams),
    keepPreviousData: true,
  })

  const categories = data?.categories?.length ? ['All', ...data.categories] : fallbackCategories
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 }

  function updateFilters(nextValues) {
    const next = new URLSearchParams(searchParams)

    Object.entries(nextValues).forEach(([key, value]) => {
      if (!value || value === 'All') {
        next.delete(key)
      } else {
        next.set(key, value)
      }
    })

    if (!Object.hasOwn(nextValues, 'page')) {
      next.set('page', '1')
    }

    setSearchParams(next)
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Food Management</span>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">Browse Foods</h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Search, filter by category, and paginate food records from the backend API.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-600 shadow-sm">
          {pagination.total} foods found
        </div>
      </div>

      <div className="mb-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_auto]">
        <label className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
          <Search size={19} className="text-slate-400" />
          <input
            className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-slate-400"
            onChange={(event) => updateFilters({ search: event.target.value })}
            placeholder="Search by food, description, or category"
            value={search}
          />
        </label>

        <label className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
          <SlidersHorizontal size={19} className="text-slate-400" />
          <select
            className="min-w-44 bg-transparent text-sm font-black text-slate-700 outline-none"
            onChange={(event) => updateFilters({ category: event.target.value })}
            value={category}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isLoading && <LoadingSpinner label="Loading foods" />}

      {isError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 font-bold text-rose-700">
          {error?.response?.data?.message || 'Unable to load foods.'}
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {data?.foods?.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.foods.map((food) => (
                <FoodCard food={food} key={food._id} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">No foods found</h2>
              <p className="mt-3 text-slate-600">Try a different search term or category filter.</p>
            </div>
          )}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-slate-500">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={page <= 1}
                onClick={() => updateFilters({ page: String(page - 1) })}
              >
                <ChevronLeft size={17} />
                Previous
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40"
                disabled={page >= pagination.totalPages}
                onClick={() => updateFilters({ page: String(page + 1) })}
              >
                Next
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default FoodsPage
