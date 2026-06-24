import api from './api'

export async function getAdminStats() {
  const { data } = await api.get('/admin/stats')

  return data
}

export async function getAdminAnalytics() {
  const { data } = await api.get('/admin/analytics')

  return data
}

export async function getAdminUsers() {
  const { data } = await api.get('/admin/users')

  return data.users
}

export async function updateUserRole(id, role) {
  const { data } = await api.patch(`/admin/users/${id}/role`, { role })

  return data
}

export async function banUser(id) {
  const { data } = await api.patch(`/admin/users/${id}/ban`)

  return data
}

export async function getAdminRestaurants() {
  const { data } = await api.get('/admin/restaurants')

  return data.restaurants
}

export async function createRestaurant(payload) {
  const { data } = await api.post('/admin/restaurants', payload)

  return data
}

export async function deleteRestaurant(id) {
  const { data } = await api.delete(`/admin/restaurants/${id}`)

  return data
}

export async function getAdminFoods() {
  const { data } = await api.get('/admin/foods')

  return data.foods
}

export async function deleteAdminFood(id) {
  const { data } = await api.delete(`/admin/foods/${id}`)

  return data
}
