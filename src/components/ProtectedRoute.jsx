/*
 * ProtectedRoute — wraps a page that requires a signed-in user.
 *
 * The `loading` branch is the important one: on a page refresh the session is
 * restored asynchronously, so for the first render there is no session yet.
 * Redirecting then would throw the user out of the app every time they hit F5.
 *
 * `replace` matters too — without it, being bounced from /dashboard to / leaves
 * /dashboard in history, so pressing Back redirects again in an endless loop.
 */
import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../context/useAuth'
import RouteLoading from './RouteLoading'

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) return <RouteLoading />

  if (!session) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
