import api from './api'

export async function applyCoupon({ code, subtotal }) {
  const { data } = await api.post('/coupons/apply', { code, subtotal })
  return data
}

export async function getCoupons() {
  const { data } = await api.get('/coupons')
  return data.coupons
}

export async function createCoupon(payload) {
  const { data } = await api.post('/coupons', payload)
  return data
}

export async function deleteCoupon(id) {
  const { data } = await api.delete(`/coupons/${id}`)
  return data
}
