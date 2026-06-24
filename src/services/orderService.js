import api from './api'

export async function placeOrder(payload = {}) {
  const { data } = await api.post('/orders', payload)

  return data
}

export async function getUserOrders() {
  const { data } = await api.get('/orders/my-orders')

  return data.orders
}

export async function getManageOrders() {
  const { data } = await api.get('/orders/manage/all')

  return data.orders
}

export async function getOrder(id) {
  const { data } = await api.get(`/orders/${id}`)

  return data.order
}

export async function updateManagedOrderStatus(id, payload) {
  const { data } = await api.patch(`/orders/manage/${id}/status`, payload)

  return data
}
