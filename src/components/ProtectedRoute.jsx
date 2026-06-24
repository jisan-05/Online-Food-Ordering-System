import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'

function ProtectedRoute({ children }) {
  const { loading, user } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner label="Checking authentication" />
  }

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return children
}

export default ProtectedRoute
