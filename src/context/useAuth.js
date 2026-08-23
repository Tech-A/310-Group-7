/*
 * useAuth — read the current session from anywhere in the app.
 *
 * Returns { session, user, loading }. Note it does NOT return signIn/signOut:
 * pages call supabase.auth.* directly, so there is one way to talk to Supabase
 * rather than two competing ones.
 */
import { useContext } from 'react'
import { AuthContext } from './AuthContext'

function useAuth() {
  const context = useContext(AuthContext)

  if (context === null) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}

export default useAuth
