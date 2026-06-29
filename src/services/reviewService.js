import api from './api'

export async function getFoodReviews(foodId) {
  const { data } = await api.get(`/foods/${foodId}/reviews`)
  return data
}

export async function createFoodReview({ foodId, rating, comment }) {
  const { data } = await api.post(`/foods/${foodId}/reviews`, { rating, comment })
  return data
}
