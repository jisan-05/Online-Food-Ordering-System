import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Calendar, 
  ShoppingBag, 
  Heart, 
  Camera, 
  Save, 
  Settings, 
  Activity, 
  Sparkles
} from 'lucide-react'
import useAuth from '../hooks/useAuth'
import { getWishlist } from '../services/wishlistService'
import { getUserOrders } from '../services/orderService'
import { isCustomerRole, getRoleLabel } from '../utils/roles'

function ProfilePage() {
  const { appUser, user, updateUserProfile } = useAuth()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('settings')

  // Form states
  const [name, setName] = useState('')
  const [photoURL, setPhotoURL] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Initialize form
  useEffect(() => {
    if (user) {
      setName(user.displayName || appUser?.name || '')
      setPhotoURL(user.photoURL || appUser?.photoURL || '')
    }
  }, [user, appUser])

  // Queries for User Stats (only enabled for customer roles)
  const isCustomer = isCustomerRole(appUser?.role)

  const { data: wishlistData, isLoading: wishlistLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: getWishlist,
    enabled: Boolean(user && isCustomer),
  })

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: getUserOrders,
    enabled: Boolean(user && isCustomer),
  })

  const wishlistCount = wishlistData?.items?.length || 0
  const ordersCount = ordersData?.length || 0

  // Update Profile handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Name cannot be empty')
      return
    }

    setIsSaving(true)
    try {
      await updateUserProfile({ name: name.trim(), photoURL: photoURL.trim() })
      toast.success('Profile updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    } catch (error) {
      console.error(error)
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  // Formatting joining date
  const joinedDate = appUser?.createdAt 
    ? new Date(appUser.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently Joined'

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Minimal Header Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
          {/* Avatar Container */}
          <div className="relative">
            <div className="relative size-24 overflow-hidden rounded-full border border-slate-200 bg-slate-50">
              {photoURL ? (
                <img 
                  className="h-full w-full object-cover" 
                  src={photoURL} 
                  alt={name || 'Profile picture'} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'User')}`;
                  }}
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-slate-100 text-2xl font-bold text-slate-600">
                  {(name || user?.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full bg-white border border-slate-200 text-slate-500 shadow-sm">
              <Camera size={13} />
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{name || 'User Account'}</h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                <Sparkles size={11} className="text-slate-500" />
                {getRoleLabel(appUser?.role)}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-slate-500 font-medium">{user?.email}</p>
            <p className="mt-3 text-xs text-slate-400 font-medium flex items-center justify-center sm:justify-start gap-1.5">
              <Calendar size={12} />
              Member since {joinedDate}
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr]">
        {/* Navigation Tabs List */}
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition cursor-pointer ${
                activeTab === 'settings' 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Settings size={15} />
              Profile Settings
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold transition mt-1 cursor-pointer ${
                activeTab === 'stats' 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Activity size={15} />
              Activity & Stats
            </button>
          </div>

          {/* Minimal Security Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Security</h3>
            <div className="mt-3 space-y-3.5">
              <div className="flex items-start gap-2.5">
                <Shield className="text-slate-500 mt-0.5 shrink-0" size={15} />
                <div>
                  <p className="text-xs font-bold text-slate-800">Verified Account</p>
                  <p className="text-[10px] text-slate-400">Linked to Firebase Auth</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="text-slate-500 mt-0.5 shrink-0" size={15} />
                <div>
                  <p className="text-xs font-bold text-slate-800">Primary Email</p>
                  <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Details Panel */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Tab 1: Profile Settings */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-lg font-bold text-slate-900">Profile Settings</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Update your account's display name and profile picture URL.
              </p>

              <form onSubmit={handleUpdateProfile} className="mt-6 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-xs font-bold text-slate-500">
                    Display Name
                    <span className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus-within:border-slate-400">
                      <UserIcon className="text-slate-400" size={16} />
                      <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-transparent outline-none text-slate-800 font-semibold"
                        required
                      />
                    </span>
                  </label>

                  <label className="grid gap-1.5 text-xs font-bold text-slate-500">
                    Email Address (Read Only)
                    <span className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-100/70 px-3 py-2.5 text-sm font-semibold text-slate-400 cursor-not-allowed">
                      <Mail className="text-slate-400" size={16} />
                      <input 
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full bg-transparent outline-none cursor-not-allowed"
                      />
                    </span>
                  </label>
                </div>

                <label className="grid gap-1.5 text-xs font-bold text-slate-500">
                  Profile Image URL
                  <span className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 focus-within:border-slate-400">
                    <Camera className="text-slate-400" size={16} />
                    <input 
                      type="url"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-transparent outline-none text-slate-800 font-semibold"
                    />
                  </span>
                </label>

                {photoURL && (
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 w-fit">
                    <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Avatar Preview</p>
                    <div className="size-16 overflow-hidden rounded-full border border-slate-200 bg-white">
                      <img 
                        src={photoURL} 
                        alt="Preview" 
                        className="h-full w-full object-cover" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://api.dicebear.com/7.x/initials/svg?seed=preview';
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition disabled:bg-slate-300 cursor-pointer shadow-sm"
                  >
                    <Save size={14} />
                    {isSaving ? 'Saving Changes...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab 2: Stats & Activity */}
          {activeTab === 'stats' && (
            <div>
              <h2 className="text-lg font-bold text-slate-900">Activity & Stats</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Overview of your platform activities, orders, and saved items.
              </p>

              {isCustomer ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {/* Orders Stat Card */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-5 transition hover:bg-slate-50">
                    <div className="flex items-center gap-3.5">
                      <div className="grid size-10 place-items-center rounded-lg bg-slate-100 text-slate-600">
                        <ShoppingBag size={18} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900">
                          {ordersLoading ? '...' : ordersCount}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Orders</p>
                      </div>
                    </div>
                  </div>

                  {/* Wishlist Stat Card */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-5 transition hover:bg-slate-50">
                    <div className="flex items-center gap-3.5">
                      <div className="grid size-10 place-items-center rounded-lg bg-slate-100 text-slate-600">
                        <Heart size={18} />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900">
                          {wishlistLoading ? '...' : wishlistCount}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Wishlist Items</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-5 text-slate-600 text-xs font-semibold">
                  Detailed analytics and shop metrics are available inside your {getRoleLabel(appUser?.role)} Panel!
                </div>
              )}

              {/* Status Section */}
              <div className="mt-6 border-t border-slate-100 pt-6">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Account Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg bg-slate-50/50 px-3 py-2 text-xs">
                    <span className="font-semibold text-slate-400">Security Verification</span>
                    <span className="font-bold text-emerald-600">Active</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50/50 px-3 py-2 text-xs">
                    <span className="font-semibold text-slate-400">Last Login Date</span>
                    <span className="font-bold text-slate-700">
                      {appUser?.lastLoginAt ? new Date(appUser.lastLoginAt).toLocaleString() : 'Just now'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProfilePage
