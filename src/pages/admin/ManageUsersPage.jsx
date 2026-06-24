import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UserX } from 'lucide-react'
import LoadingSpinner from '../../components/LoadingSpinner'
import { banUser, getAdminUsers, updateUserRole } from '../../services/adminService'

function ManageUsersPage() {
  const queryClient = useQueryClient()
  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAdminUsers,
  })
  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => updateUserRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  })
  const banMutation = useMutation({
    mutationFn: banUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  if (isLoading) return <LoadingSpinner label="Loading users" />
  if (isError) return <div className="rounded-2xl bg-rose-50 p-5 font-bold text-rose-700">{error?.response?.data?.message || 'Unable to load users.'}</div>

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Manage Users</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">Users</h1>
      </div>
      {users.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">No users found</h2>
          <p className="mt-3 text-slate-600">Registered users will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <article
              className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between"
              key={user._id}
            >
              <div>
                <h2 className="font-black text-slate-950">{user.name || 'Unnamed user'}</h2>
                <p className="mt-1 text-sm font-bold text-slate-500">{user.email}</p>
                <div className="mt-3 flex gap-2">
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black uppercase text-orange-700">
                    {user.role}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase text-slate-600">
                    {user.status || 'active'}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  className="min-h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-700 outline-none"
                  disabled={roleMutation.isPending}
                  onChange={(event) => roleMutation.mutate({ id: user._id, role: event.target.value })}
                  value={user.role}
                >
                  <option value="customer">customer</option>
                  <option value="owner">owner</option>
                  <option value="admin">admin</option>
                </select>
                <button
                  className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                  disabled={roleMutation.isPending || user.role === 'admin'}
                  onClick={() => roleMutation.mutate({ id: user._id, role: 'admin' })}
                >
                  Make Admin
                </button>
                <button
                  className="rounded-2xl bg-cyan-50 px-4 py-3 text-sm font-black text-cyan-700 hover:bg-cyan-100 disabled:opacity-50"
                  disabled={roleMutation.isPending || user.role !== 'admin'}
                  onClick={() => roleMutation.mutate({ id: user._id, role: 'customer' })}
                >
                  Remove Admin
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-black text-rose-700 hover:bg-rose-100"
                  disabled={banMutation.isPending || user.status === 'banned'}
                  onClick={() => banMutation.mutate(user._id)}
                >
                  <UserX size={17} />
                  {user.status === 'banned' ? 'Banned' : 'Ban User'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageUsersPage
