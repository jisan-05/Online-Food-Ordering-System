import api from './api'

export async function getCart() {
  const { data } = await api.get('/cart')

  return data
}

export async function addToCart(payload) {
  const { data } = await api.post('/cart', payload)

  return data
}

export async function updateCartItem(id, quantity) {
  const { data } = await api.patch(`/cart/${id}`, { quantity })

  return data
}

export async function removeCartItem(id) {
  const { data } = await api.delete(`/cart/${id}`)

  return data
}
