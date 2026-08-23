import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthButton from '../components/AuthButton'
import AuthCard from '../components/AuthCard'
import AuthFooter from '../components/AuthFooter'
import Field from '../components/Field'
import FormMessage from '../components/FormMessage'
import { supabase } from '../lib/supabaseClient'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Set by ResetPasswordPage after a successful password change.
  const passwordUpdated = location.state?.passwordUpdated ?? false
  // Set by ProtectedRoute, so we can return the user to where they were headed.
  const destination = location.state?.from?.pathname ?? '/dashboard'

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setIsSubmitting(false)

    if (error) {
      // Shown verbatim on purpose. Supabase returns the same message for a wrong
      // password and an account that doesn't exist, which stops the form being
      // used to find out which email addresses are registered.
      setErrorMessage(error.message)
      return
    }

    navigate(destination, { replace: true })
  }

  return (
    <AuthCard title="LOGIN">
      <form onSubmit={handleSubmit}>
        <Field
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          className="mb-5"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <Field
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          className="mb-2"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <div className="flex justify-end w-full">
          <Link className="text-link underline mb-5" to="/forgot-password">
            Forgot password?
          </Link>
        </div>

        {passwordUpdated && !errorMessage && (
          <FormMessage tone="success">
            Password updated. Log in with your new password.
          </FormMessage>
        )}

        {errorMessage && <FormMessage>{errorMessage}</FormMessage>}

        <AuthButton disabled={isSubmitting}>
          {isSubmitting ? 'Logging in…' : 'Log In'}
        </AuthButton>
      </form>

      <AuthFooter
        prompt="Don't have an account?"
        linkText="Create account"
        to="/signup"
      />
    </AuthCard>
  )
}

export default LoginPage
