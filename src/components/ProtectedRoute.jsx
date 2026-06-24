import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { getRoleHome } from '../utils/roles'
import LoadingSpinner from './LoadingSpinner'

function ProtectedRoute({ allowedRoles, children }) {
  const { appUser, loading, user } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner label="Checking authentication" />
  }

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  if (appUser?.status === 'banned') {
    return <Navigate replace to="/login" />
  }

  if (allowedRoles?.length && !allowedRoles.includes(appUser?.role)) {
    return <Navigate replace to={getRoleHome(appUser?.role)} />
  }

  return children
}

export default ProtectedRoute
