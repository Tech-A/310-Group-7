/*
 * AuthCard — the shared shell for login, sign up and password reset.
 *
 * Owns the page background, logo, heading and all the decorative artwork,
 * so the pages themselves only describe their own form.
 *
 * Layering (this is the fiddly part — see the z-index comments below):
 *   heading  z-auto ─ beaver body  z-0 ─ card  z-10 ─ grass + beaver arms  z-20
 */
import Logo from './Logo'
import grassSingle from '../assets/grassSingle.svg'
import grassDouble from '../assets/grassDouble.svg'
import beaver from '../assets/beaver.png'
import beaverArms from '../assets/beaverArms.png'

// The two beaver layers are the same artwork split in half, so they have to
// sit at exactly the same spot — only their z-index differs. Sharing one
// position means they cannot drift apart.
const BEAVER_POSITION = 'pointer-events-none absolute -top-5 right-1 w-20 sm:-top-6 sm:right-4 sm:w-30'

function AuthCard({ title, children }) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-brand-black px-3 py-20 text-brand-bg sm:px-4 sm:py-16">
      <div className="absolute left-5 top-5 sm:left-6 sm:top-6">
        <Logo className="text-base sm:text-lg" markClassName="size-5 sm:size-6" />
      </div>

      <div className="relative w-full max-w-xl">
        {/*Card title*/}
        <h1 className="relative -top-4 text-center text-[clamp(3.25rem,15vw,6rem)] font-extrabold leading-none sm:-top-8">
          {title}
        </h1>

        <div className="relative z-10 -mt-7 w-full rounded-2xl bg-brand-bg px-5 pb-2 pt-10 text-brand-black sm:-mt-12 sm:px-12 md:px-22">
          {children}
          {/* Decorative assets. Absolute against the card, which is `relative`.
              pointer-events-none so it can never swallow a click on the form. */}
          <img
            src={grassSingle}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-2 -left-3 z-20 w-14 sm:-left-4 sm:w-20"
          />

          <img
            src={grassDouble}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-2 -right-3 z-20 w-20 sm:-right-4 sm:w-30"
          />
        </div>

        {/* Beaver sits OUTSIDE the card so the card can paint over its body:
            body behind the card (z-0), arms draped over the front (z-20). */}
        <img
          src={beaver}
          alt=""
          aria-hidden="true"
          className={`${BEAVER_POSITION} z-0`}
        />

        <img
          src={beaverArms}
          alt=""
          aria-hidden="true"
          className={`${BEAVER_POSITION} z-20`}
        />
      </div>
    </main>
  )
}

export default AuthCard
