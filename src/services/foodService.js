import api from './api'

export async function getFoods(params = {}) {
  const { data } = await api.get('/foods', { params })

  return data
}

export async function getFood(id) {
  const { data } = await api.get(`/foods/${id}`)

  return data.food
}

export async function createFood(payload) {
  const { data } = await api.post('/foods', payload)

  return data
}

export async function updateFood(id, payload) {
  const { data } = await api.patch(`/foods/${id}`, payload)

  return data
}

export async function deleteFood(id) {
  const { data } = await api.delete(`/foods/${id}`)

  return data
}
