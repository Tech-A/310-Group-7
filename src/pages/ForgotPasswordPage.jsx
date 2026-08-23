import { useState } from 'react'
import AuthButton from '../components/AuthButton'
import AuthCard from '../components/AuthCard'
import AuthFooter from '../components/AuthFooter'
import Field from '../components/Field'
import FormMessage from '../components/FormMessage'
import { supabase } from '../lib/supabaseClient'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [linkSent, setLinkSent] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // window.location.origin, not a hard-coded URL, so the same build works on
      // localhost, on Netlify, and in deploy previews. This exact path must be
      // in the Supabase dashboard's Redirect URLs allowlist, or Supabase
      // silently falls back to the Site URL and the link lands on "/" instead.
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setIsSubmitting(false)

    // Rate limiting is worth showing — otherwise testing twice in a row looks
    // like the form is broken.
    if (error && error.status === 429) {
      setErrorMessage(error.message)
      return
    }

    // Every other outcome shows the same neutral message, success or not, so
    // the form can't be used to find out which addresses have accounts.
    setLinkSent(true)
  }

  if (linkSent) {
    return (
      <AuthCard title="RESET">
        <p className="mb-5">
          If an account exists for <span className="font-bold">{email}</span>,
          we&apos;ve sent it a link to set a new password. The link expires
          after an hour.
        </p>

        <AuthFooter prompt="Remembered it?" linkText="Back to log in" to="/" />
      </AuthCard>
    )
  }

  return (
    <AuthCard title="RESET">
      <p className="mb-5">
        Enter the email address on your account and we&apos;ll send you a link
        to set a new password.
      </p>

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

        {errorMessage && <FormMessage>{errorMessage}</FormMessage>}

        <AuthButton disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Send reset link'}
        </AuthButton>
      </form>

      <AuthFooter prompt="Remembered it?" linkText="Back to log in" to="/" />
    </AuthCard>
  )
}

export default ForgotPasswordPage
