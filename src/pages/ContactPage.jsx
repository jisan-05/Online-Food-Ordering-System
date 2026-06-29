import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Clock, Send } from 'lucide-react'
import toast from 'react-hot-toast'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear errors when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function validateForm() {
    const nextErrors = {}
    if (!formData.name.trim()) {
      nextErrors.name = 'Name is required'
    }
    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = 'Invalid email address'
    }
    if (!formData.message.trim()) {
      nextErrors.message = 'Message is required'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix the errors in the form.')
      return
    }

    setIsSubmitting(true)
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success('Your message has been sent successfully!')
      setFormData({ name: '', email: '', message: '' })
    }, 1200)
  }

  const contactInfo = [
    {
      title: 'Call Us',
      detail: '+1 (555) 123-4567',
      text: 'Our support team is available during business hours.',
      icon: Phone,
      color: 'text-orange-600 bg-orange-50',
    },
    {
      title: 'Email Us',
      detail: 'support@cravehub.com',
      text: 'Send us an email, we reply within 24 hours.',
      icon: Mail,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Visit Us',
      detail: '123 Foodie Blvd, Suite 456',
      text: 'Gourmet City, GC 78910',
      icon: MapPin,
      color: 'text-cyan-600 bg-cyan-50',
    },
    {
      title: 'Working Hours',
      detail: 'Mon - Sun: 8:00 AM - 11:00 PM',
      text: 'Open daily to assist you with order delivery.',
      icon: Clock,
      color: 'text-fuchsia-600 bg-fuchsia-50',
    },
  ]

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="text-sm font-black uppercase tracking-[0.2em] text-orange-600">Contact Us</span>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Get in touch with our team
          </h1>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Have questions about your order, food delivery, or restaurant partnership? Reach out to us.
          </p>
        </div>

        {/* Layout grid */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Contact Form */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-2xl font-black text-slate-950">Send a Message</h2>
            <p className="mt-2 text-sm text-slate-500 font-bold mb-6">
              Fill out the form below and we will get back to you shortly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className={`w-full rounded-xl border px-4 py-3 text-sm font-bold outline-none transition focus:border-orange-500 ${
                    errors.name ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-slate-50'
                  }`}
                />
                {errors.name && <p className="mt-1 text-xs font-bold text-rose-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={`w-full rounded-xl border px-4 py-3 text-sm font-bold outline-none transition focus:border-orange-500 ${
                    errors.email ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-slate-50'
                  }`}
                />
                {errors.email && <p className="mt-1 text-xs font-bold text-rose-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-2" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="How can we help you?"
                  className={`w-full rounded-xl border px-4 py-3 text-sm font-bold outline-none transition focus:border-orange-500 ${
                    errors.message ? 'border-rose-400 bg-rose-50' : 'border-slate-200 bg-slate-50'
                  }`}
                />
                {errors.message && <p className="mt-1 text-xs font-bold text-rose-500">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send size={16} />
              </button>
            </form>
          </motion.div>

          {/* Contact Details */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-black text-slate-950 px-2">Contact Details</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                return (
                  <motion.div
                    key={info.title}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className={`grid size-12 shrink-0 place-items-center rounded-2xl ${info.color}`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">
                        {info.title}
                      </h3>
                      <p className="mt-1 text-lg font-black text-slate-950">{info.detail}</p>
                      <p className="mt-1 text-xs font-bold text-slate-500">{info.text}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
