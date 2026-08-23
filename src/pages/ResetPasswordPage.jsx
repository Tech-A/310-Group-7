/*
 * ResetPasswordPage — where the emailed recovery link lands.
 *
 * This route is deliberately unguarded. The recovery link signs the user in for
 * real, so PublicOnlyRoute would bounce them to the dashboard before they could
 * change anything; and an expired link leaves no session at all, so
 * ProtectedRoute would drop them on the login page with no explanation. The
 * page reads the session itself and handles all three cases.
 *
 * We parse nothing out of the URL by hand. The Supabase client's
 * detectSessionInUrl option (on by default) consumes the #access_token fragment
 * at import time and turns it into a session before React even mounts.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthButton from '../components/AuthButton'
import AuthCard from '../components/AuthCard'
import AuthFooter from '../components/AuthFooter'
import Field from '../components/Field'
import FormMessage from '../components/FormMessage'
import RouteLoading from '../components/RouteLoading'
import useAuth from '../context/useAuth'
import { supabase } from '../lib/supabaseClient'

const MINIMUM_PASSWORD_LENGTH = 6

// On a bad link supabase-js throws before it clears the fragment, so the reason
// is still sitting in the URL for us to show.
function readLinkError() {
  const params = new URLSearchParams(window.location.hash.slice(1))
  return params.get('error_description') ?? ''
}

function ResetPasswordPage() {
  const navigate = useNavigate()
  const { session, loading } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')

    if (password.length < MINIMUM_PASSWORD_LENGTH) {
      setErrorMessage(
        `Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters.`,
      )
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setIsSubmitting(false)
      setErrorMessage(error.message)
      return
    }

    // Sign out afterwards so the user has to prove they know the new password,
    // and so a forwarded reset email doesn't leave a live session behind.
    // Must run after updateUser resolves, or the token is already revoked.
    await supabase.auth.signOut()

    navigate('/', { replace: true, state: { passwordUpdated: true } })
  }

  // Still restoring the session from the link — without this the valid case
  // flashes the "expired" message for a moment on every single reset.
  if (loading) return <RouteLoading />

  if (!session) {
    return (
      <AuthCard title="RESET">
        <p className="mb-5">
          This reset link is invalid or has expired. Reset links can only be
          used once, and they run out after an hour.
        </p>

        {readLinkError() && <FormMessage>{readLinkError()}</FormMessage>}

        <AuthFooter
          prompt="Need another?"
          linkText="Request a new link"
          to="/forgot-password"
        />
      </AuthCard>
    )
  }

  return (
    <AuthCard title="RESET">
      <p className="mb-5">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit}>
        <Field
          id="password"
          label="New password"
          type="password"
          autoComplete="new-password"
          placeholder="Enter a new password"
          className="mb-5"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <Field
          id="confirmPassword"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your new password"
          className="mb-5"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        {errorMessage && <FormMessage>{errorMessage}</FormMessage>}

        <AuthButton disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save new password'}
        </AuthButton>
      </form>

      <AuthFooter prompt="Changed your mind?" linkText="Back to log in" to="/" />
    </AuthCard>
  )
}

export default ResetPasswordPage
