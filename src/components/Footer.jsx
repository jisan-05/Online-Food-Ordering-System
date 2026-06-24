import { Link } from 'react-router-dom'
import { Mail, MapPin, MessageCircle, Phone, Send, Share2, Utensils } from 'lucide-react'

const footerLinks = [
  [
    'Explore',
    [
      { label: 'Home', to: '/' },
      { label: 'Browse foods', to: '/foods' },
      { label: 'Customer dashboard', to: '/dashboard' },
    ],
  ],
  [
    'Account',
    [
      { label: 'Login', to: '/login' },
      { label: 'Register', to: '/register' },
      { label: 'My orders', to: '/dashboard/orders' },
    ],
  ],
  [
    'Popular',
    [
      { label: 'Pizza delivery', to: '/foods?category=Pizza' },
      { label: 'Burger deals', to: '/foods?category=Burger' },
      { label: 'Healthy meals', to: '/foods?category=Healthy' },
    ],
  ],
]

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.1fr_2fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-orange-500 text-white">
              <Utensils size={22} />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight">CraveHub</p>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
                Food Platform
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-sm leading-7 text-slate-300">
            A modern online food ordering system for customers, restaurants, and platform teams.
          </p>
          <div className="mt-6 grid gap-3 text-sm font-bold text-slate-300">
            <span className="inline-flex items-center gap-2">
              <Phone size={16} /> +1 (555) 240-8812
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail size={16} /> hello@cravehub.com
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin size={16} /> 88 Market Street, New York
            </span>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerLinks.map(([title, links]) => (
            <div key={title}>
              <h3 className="font-black">{title}</h3>
              <div className="mt-4 grid gap-3">
                {links.map((link) => (
                  <Link
                    className="text-sm font-bold text-slate-300 transition hover:text-orange-300"
                    key={link.label}
                    to={link.to}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="text-sm font-bold text-slate-400">
            Copyright 2026 CraveHub. All rights reserved.
          </p>
          <div className="flex gap-2">
            {[MessageCircle, Send, Share2].map((Icon) => (
              <a
                aria-label={Icon.displayName || Icon.name}
                className="grid size-10 place-items-center rounded-full border border-white/10 text-slate-300 transition hover:border-orange-300 hover:text-orange-300"
                href="/"
                key={Icon.displayName || Icon.name}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
