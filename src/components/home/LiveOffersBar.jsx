import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Tag } from 'lucide-react'
import { offers } from '../../data/homeData'

function LiveOffersBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (offers.length <= 1) return undefined

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % offers.length)
    }, 4000)

    return () => window.clearInterval(timer)
  }, [])

  const offer = offers[index]

  return (
    <section className="border-b border-orange-100 bg-linear-to-r from-orange-500 to-rose-500 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-3 text-sm font-bold sm:flex-row sm:px-6 lg:px-8">
        <p className="inline-flex items-center gap-2">
          <Tag size={16} />
          <span>{offer.title}: {offer.text}</span>
        </p>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-white/20 px-3 py-1 font-black">{offer.code}</span>
          <Link className="rounded-full bg-white px-4 py-1.5 font-black text-orange-600 transition hover:bg-orange-50" to="/foods">
            Order now
          </Link>
        </div>
      </div>
    </section>
  )
}

export default LiveOffersBar
