/*
 * PublicOnlyRoute — wraps the auth pages. A signed-in user has no business on
 * the login or sign up form, so send them to the dashboard instead.
 *
 * Note /reset-password is deliberately NOT wrapped in this: the password
 * recovery link creates a real session, so this guard would bounce the user to
 * the dashboard before they could ever set a new password.
 */
import { Navigate } from 'react-router-dom'
import useAuth from '../context/useAuth'
import RouteLoading from './RouteLoading'

function PublicOnlyRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) return <RouteLoading />

  if (session) return <Navigate to="/dashboard" replace />

  return children
}

export default PublicOnlyRoute
