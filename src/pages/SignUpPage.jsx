import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthButton from '../components/AuthButton'
import AuthCard from '../components/AuthCard'
import AuthFooter from '../components/AuthFooter'
import Field from '../components/Field'
import FormMessage from '../components/FormMessage'
import { supabase } from '../lib/supabaseClient'

// Matches the minimum length Supabase enforces (Authentication → Providers →
// Email). Checking it here too means instant feedback instead of a round trip.
const MINIMUM_PASSWORD_LENGTH = 6

function SignUpPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

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
    const { data, error } = await supabase.auth.signUp({ email, password })
    setIsSubmitting(false)

    if (error) {
      setErrorMessage(error.message)
      return
    }

    // Two possible outcomes, depending on whether "Confirm email" is switched on
    // in the Supabase dashboard. Branch on the response rather than assuming.
    if (data.session) {
      // Confirmation off: signUp signed them straight in.
      navigate('/dashboard', { replace: true })
      return
    }

    // Confirmation on: no session until they click the emailed link.
    //
    // Note we show this even if the address is already registered. Supabase
    // returns a decoy user with no error in that case, specifically so the form
    // can't be used to discover which emails have accounts — detecting it would
    // put that leak straight back.
    setConfirmationSent(true)
  }

  if (confirmationSent) {
    return (
      <AuthCard title="SIGN UP">
        <p className="mb-5">
          Check your inbox — we&apos;ve sent a confirmation link to{' '}
          <span className="font-bold">{email}</span>. Click it to finish setting
          up your account.
        </p>

        <AuthFooter prompt="Already confirmed?" linkText="Log in" to="/" />
      </AuthCard>
    )
  }

  return (
    <AuthCard title="SIGN UP">
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
          autoComplete="new-password"
          placeholder="Create a password"
          className="mb-5"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <Field
          id="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          className="mb-5"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        {errorMessage && <FormMessage>{errorMessage}</FormMessage>}

        <AuthButton disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create Account'}
        </AuthButton>
      </form>

      <AuthFooter prompt="Already have an account?" linkText="Log in" to="/" />
    </AuthCard>
  )
}

export default SignUpPage
