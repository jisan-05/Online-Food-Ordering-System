import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Bike,
  Clock3,
  Coffee,
  Fish,
  IceCreamBowl,
  MapPin,
  Pizza,
  Salad,
  Sandwich,
  Search,
  ShieldCheck,
  Star,
  Tag,
  Utensils,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { categories, faqs, offers, restaurants, reviews } from '../../data/homeData'
import { getFoods } from '../../services/foodService'

const icons = { Coffee, Fish, IceCreamBowl, Pizza, Salad, Sandwich }

const categoryRoutes = {
  Pizza: 'Pizza',
  Burgers: 'Burger',
  Sushi: 'Sushi',
  Desserts: 'Dessert',
  Healthy: 'Healthy',
  Coffee: 'Coffee',
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!value) return undefined

    let frame = 0
    const totalFrames = 24
    const step = value / totalFrames

    const timer = window.setInterval(() => {
      frame += 1
      setDisplay(Math.min(Math.round(step * frame), value))

      if (frame >= totalFrames) {
        window.clearInterval(timer)
      }
    }, 30)

    return () => window.clearInterval(timer)
  }, [value])

  return display
}

function SectionHeader({ eyebrow, title, text }) {
  return (
    <motion.div
      className="mx-auto mb-10 max-w-2xl text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      transition={{ duration: 0.5 }}
    >
      <span className="text-sm font-black uppercase tracking-[0.22em] text-orange-600">{eyebrow}</span>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">{title}</h2>
      <p className="mt-4 leading-7 text-slate-600">{text}</p>
    </motion.div>
  )
}

function Rating({ value }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-black text-slate-800 shadow-sm">
      <Star className="fill-amber-400 text-amber-400" size={15} />
      {value}
    </span>
  )
}

export function HeroBanner() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const { data } = useQuery({
    queryKey: ['home-stats'],
    queryFn: () => getFoods({ page: 1, limit: 1 }),
    staleTime: 1000 * 60 * 5,
  })

  const foodCount = data?.pagination?.total || 0
  const categoryCount = data?.categories?.length || categories.length

  function handleSearch(event) {
    event.preventDefault()
    const query = search.trim()

    if (query) {
      navigate(`/foods?search=${encodeURIComponent(query)}`)
      return
    }

    navigate('/foods')
  }

  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
        <motion.div className="flex flex-col justify-center" initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.55 }}>
          <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-black text-orange-700">
            <ShieldCheck size={16} /> Fresh meals, trusted restaurants
          </span>
          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
            Order delicious food from your favorite local restaurants.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Browse menus, unlock curated deals, and get hot meals delivered with a clean ordering experience built for speed.
          </p>
          <form className="mt-8 flex max-w-xl flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm sm:flex-row" onSubmit={handleSearch}>
            <label className="flex min-h-12 flex-1 items-center gap-3 rounded-xl bg-white px-4 text-slate-500">
              <Search size={19} />
              <input
                className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-slate-400"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search pizza, sushi, burger..."
                value={search}
              />
            </label>
            <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition hover:bg-rose-600" type="submit">
              Find Food <ArrowRight size={17} />
            </button>
          </form>
          <div className="mt-7 grid max-w-lg grid-cols-3 gap-3 text-sm font-bold text-slate-600">
            {[
              [`${foodCount || '800'}+`, 'Live dishes'],
              [`${categoryCount || '12'}+`, 'Categories'],
              ['24/7', 'Support'],
            ].map(([value, label]) => (
              <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center shadow-sm" key={label}>
                <p className="text-lg font-black text-slate-950">
                  {typeof value === 'string' && value.endsWith('+') && foodCount ? (
                    <>
                      <AnimatedNumber value={foodCount} />+
                    </>
                  ) : (
                    value
                  )}
                </p>
                <p className="mt-1 text-xs font-bold text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="relative min-h-[460px] overflow-hidden rounded-[2rem] bg-slate-950" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
          <img className="absolute inset-0 h-full w-full object-cover opacity-90" src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=85" alt="Table filled with restaurant dishes" />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/15 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 grid gap-3 sm:grid-cols-3">
            {[
              [Clock3, '30 min', 'Average delivery'],
              [Bike, 'Live', 'Rider tracking'],
              [MapPin, 'Near you', 'Local favorites'],
            ].map(([Icon, title, text]) => (
              <div className="rounded-2xl bg-white/92 p-4 shadow-xl backdrop-blur" key={title}>
                <Icon className="mb-3 text-orange-600" size={22} />
                <p className="font-black text-slate-950">{title}</p>
                <p className="mt-1 text-xs font-bold text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function FoodCategories() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Categories" title="Explore cravings by category" text="Quickly jump into the meals customers order most often." />
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {categories.map((category, index) => {
          const Icon = icons[category.icon]
          const categoryParam = categoryRoutes[category.name] || category.name

          return (
            <motion.div initial="hidden" key={category.name} transition={{ delay: index * 0.04 }} variants={fadeUp} viewport={{ once: true }} whileInView="visible">
              <Link
                className="block rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
                to={`/foods?category=${encodeURIComponent(categoryParam)}`}
              >
                <div className={`mb-5 grid size-12 place-items-center rounded-2xl ${category.color}`}><Icon size={24} /></div>
                <p className="font-black text-slate-950">{category.name}</p>
                <p className="mt-1 text-sm font-bold text-slate-500">{category.count}</p>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

export function PopularFoods() {
  const { data, isLoading } = useQuery({
    queryKey: ['home-popular-foods'],
    queryFn: () => getFoods({ page: 1, limit: 6 }),
    staleTime: 1000 * 60 * 5,
  })

  const foods = data?.foods || []

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Popular" title="Most ordered dishes today" text="Fresh picks loaded live from our menu — updated as new dishes are added." />
      {isLoading ? (
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center font-bold text-slate-500">
          Loading popular dishes...
        </div>
      ) : foods.length === 0 ? (
        <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h3 className="text-2xl font-black text-slate-950">Menu coming soon</h3>
          <p className="mt-3 text-slate-600">Check back shortly or browse all foods.</p>
          <Link className="mt-6 inline-flex rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white" to="/foods">
            Browse Foods
          </Link>
        </div>
      ) : (
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {foods.map((food, index) => (
            <motion.article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl" initial="hidden" key={food._id} transition={{ delay: index * 0.06 }} variants={fadeUp} viewport={{ once: true }} whileInView="visible">
              <Link className="block" to={`/foods/${food._id}`}>
                <div className="relative aspect-[4/3]">
                  <img className="h-full w-full object-cover" src={food.image} alt={food.name} />
                  <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
                    {food.category}
                  </span>
                </div>
              </Link>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link className="text-xl font-black text-slate-950 transition hover:text-orange-600" to={`/foods/${food._id}`}>
                      {food.name}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-sm font-bold text-slate-500">{food.description}</p>
                  </div>
                  <Rating value="4.8" />
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-lg font-black text-orange-600">${Number(food.price).toFixed(2)}</span>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-500"><Clock3 size={16} /> 25 min</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
      {foods.length > 0 && (
        <div className="mx-auto mt-10 max-w-7xl text-center">
          <Link className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:bg-orange-600" to="/foods">
            View full menu <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </section>
  )
}

export function FeaturedRestaurants() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Restaurants" title="Featured restaurant partners" text="Showcase trusted partners with cuisine type, delivery promise, and ratings." />
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {restaurants.map((restaurant, index) => (
          <motion.article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" key={restaurant.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.06 }}>
            <img className="h-48 w-full object-cover" src={restaurant.image} alt={restaurant.name} />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-black text-slate-950">{restaurant.name}</h3><p className="mt-1 text-sm font-bold text-slate-500">{restaurant.cuisine}</p></div><Rating value={restaurant.rating} /></div>
              <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-700"><Bike size={16} /> {restaurant.delivery}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export function SpecialOffers() {
  return (
    <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <span className="text-sm font-black uppercase tracking-[0.22em] text-orange-300">Special offers</span>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Deals designed to move carts faster.</h2>
          <p className="mt-4 leading-7 text-slate-300">Use promotional tiles for campaigns, lunch windows, delivery offers, and restaurant-sponsored bundles.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {offers.map((offer) => (
            <motion.article className="rounded-2xl border border-white/10 bg-white/8 p-6" key={offer.code} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Tag className="mb-5 text-orange-300" size={28} />
              <h3 className="text-2xl font-black">{offer.title}</h3>
              <p className="mt-3 leading-7 text-slate-300">{offer.text}</p>
              <p className="mt-5 w-fit rounded-full bg-white px-4 py-2 text-sm font-black text-slate-950">{offer.code}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CustomerReviews() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Reviews" title="Loved by hungry customers" text="Social proof helps new customers feel confident before their first order." />
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {reviews.map((review) => (
          <motion.article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" key={review.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="mb-5 flex gap-1">{Array.from({ length: review.rating }).map((_, index) => <Star className="fill-amber-400 text-amber-400" key={index} size={18} />)}</div>
            <p className="leading-7 text-slate-700">"{review.quote}"</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-full bg-cyan-50 font-black text-cyan-700">{review.name.charAt(0)}</div>
              <div><p className="font-black text-slate-950">{review.name}</p><p className="text-sm font-bold text-slate-500">{review.role}</p></div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export function FAQSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="FAQ" title="Answers before checkout" text="Reduce support friction with clear customer-facing answers." />
      <div className="mx-auto grid max-w-4xl gap-4">
        {faqs.map((faq) => (
          <motion.details className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={faq.question} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <summary className="cursor-pointer list-none font-black text-slate-950">{faq.question}</summary>
            <p className="mt-3 leading-7 text-slate-600">{faq.answer}</p>
          </motion.details>
        ))}
      </div>
    </section>
  )
}

export function NewsletterSection() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <motion.div className="mx-auto grid max-w-7xl gap-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm md:grid-cols-[1fr_0.9fr] md:p-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
        <div>
          <span className="text-sm font-black uppercase tracking-[0.22em] text-orange-600">Newsletter</span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Get weekly deals and restaurant launches.</h2>
          <p className="mt-4 leading-7 text-slate-600">Send customers curated offers, new menu drops, and seasonal campaigns.</p>
        </div>
        <form className="flex flex-col gap-3 self-center sm:flex-row">
          <input className="min-h-12 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-orange-300" placeholder="Enter your email" type="email" />
          <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-orange-600">
            Subscribe <Utensils size={17} />
          </button>
        </form>
      </motion.div>
    </section>
  )
}
