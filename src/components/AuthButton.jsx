/*
 * AuthButton — the yellow primary action.
 *
 * Defaults to type="submit" since that's what every auth form needs; pass
 * type="button" for anything that shouldn't submit a form.
 *
 * `className` is the wrapper's spacing. It defaults to how the button sits in
 * an auth card, since all three pages want the same thing — pass your own to
 * override. The button's own look is fixed here so it can't drift per page.
 */
function AuthButton({ children, className = 'mb-5 sm:mx-12 md:mx-20', ...buttonProps }) {
  return (
    <div className={className}>
      <button
        type="submit"
        {...buttonProps}
        className="w-full cursor-pointer rounded-xl bg-brand-yellow p-2.5 font-bold transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {children}
      </button>
    </div>
  )
}

export default AuthButton
