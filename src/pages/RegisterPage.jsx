import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail, Send, UserRound } from 'lucide-react'
import useAuth from '../hooks/useAuth'

function RegisterPage() {
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await register(form)
      navigate('/profile', { replace: true })
    } catch (authError) {
      setError(authError.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setSubmitting(true)

    try {
      await loginWithGoogle()
      navigate('/profile', { replace: true })
    } catch (authError) {
      setError(authError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl place-items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-[2rem] border border-white bg-white/90 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-black text-slate-950">Create account</h1>
          <p className="mt-2 font-medium text-slate-500">Register with email or Google.</p>
        </div>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <Input
            icon={UserRound}
            label="Full name"
            name="name"
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            type="text"
            value={form.name}
          />
          <Input
            icon={Mail}
            label="Email address"
            name="email"
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            type="email"
            value={form.email}
          />
          <Input
            icon={LockKeyhole}
            label="Password"
            minLength={6}
            name="password"
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            type="password"
            value={form.password}
          />
          {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>}
          <button className="rounded-2xl bg-orange-500 px-5 py-3 font-black text-white hover:bg-red-500 disabled:opacity-70" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <button
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-700 hover:border-orange-200"
          disabled={submitting}
          onClick={handleGoogleLogin}
        >
          <Send size={18} />
          Continue with Google
        </button>
        <p className="mt-6 text-center text-sm font-medium text-slate-500">
          Already have an account?{' '}
          <Link className="font-black text-orange-600" to="/login">
            Login
          </Link>
        </p>
      </div>
    </section>
  )
}

function Input({ icon: Icon, label, ...props }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-700">
      {label}
      <span className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100">
        <Icon className="text-slate-400" size={18} />
        <input className="w-full bg-transparent outline-none" placeholder={label} required {...props} />
      </span>
    </label>
  )
}

export default RegisterPage
