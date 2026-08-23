/*
 * RouteLoading — shown while we're still working out whether someone is signed
 * in. Uses the auth pages' dark background so there's no white flash before the
 * login card appears.
 */
import Logo from './Logo'

function RouteLoading() {
  return (
    <div
      role="status"
      className="grid min-h-screen place-items-center bg-brand-black text-brand-bg"
    >
      <Logo className="text-xl sm:text-2xl" />
      <span className="sr-only">Loading</span>
    </div>
  )
}

export default RouteLoading
