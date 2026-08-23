/*
 * FormMessage — an inline error or success line inside an auth form.
 *
 * Exists as a component rather than a repeated <p className="text-error"> for
 * the reason docs/auth-pages.md gives: the styling is the easy half. The ARIA
 * role is the part four separate pages would forget, and it's what makes a
 * screen reader announce the message when it appears.
 */
function FormMessage({ tone = 'error', className = '', children }) {
  const isError = tone === 'error'

  return (
    <p
      role={isError ? 'alert' : 'status'}
      className={`mb-4 text-sm ${isError ? 'text-error' : 'text-success'} ${className}`}
    >
      {children}
    </p>
  )
}

export default FormMessage
