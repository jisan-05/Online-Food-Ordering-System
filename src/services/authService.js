import api from './api'

export async function requestJwtToken(user) {
  const { data } = await api.post('/auth/jwt', user)
  return data.token
}

export function setAuthToken(token) {
  localStorage.setItem('accessToken', token)
}

export function clearAuthToken() {
  localStorage.removeItem('accessToken')
}
