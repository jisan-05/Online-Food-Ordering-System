import api from './api'

export async function getWishlist() {
  const { data } = await api.get('/wishlist')
  return data
}

export async function toggleWishlist(foodId) {
  const { data } = await api.post('/wishlist/toggle', { foodId })
  return data
}

export async function getWishlistIds() {
  const { data } = await api.get('/wishlist/ids')
  return data.ids
}
