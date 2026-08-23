/*
 * AuthProvider — tracks who is signed in, for the whole app.
 *
 * Reads the existing session once on mount (so a page refresh doesn't log you
 * out), then subscribes to auth changes so the UI reacts the instant someone
 * signs in, signs out, or a token silently refreshes.
 *
 * `loading` is what stops the login page flashing on refresh: until getSession
 * resolves we genuinely do not know whether there is a session, and treating
 * "don't know yet" as "signed out" would bounce users out of their own app.
 */
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { AuthContext } from './AuthContext'

function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // StrictMode mounts, unmounts, then remounts in development. This flag
    // discards the first run's getSession result if it lands after that run was
    // torn down — React 19 no longer warns about it, so it would fail silently.
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setLoading(false)
    })

    // Deliberately not async: this callback can run while supabase-js holds its
    // internal lock, and awaiting another supabase.auth call inside it deadlocks.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  // Derived, never stored separately — two states that must agree is a bug waiting to happen.
  const value = useMemo(
    () => ({ session, user: session?.user ?? null, loading }),
    [session, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
