/*
 * AuthFooter — the "Already have an account? Log in" row at the bottom of an
 * auth card. Every auth page ends with one of these, pointing at whichever
 * page the user probably wanted instead.
 */
import { Link } from 'react-router-dom'

function AuthFooter({ prompt, linkText, to }) {
  return (
    <div className="mb-5 flex flex-wrap justify-center gap-x-1 text-center text-sm sm:text-base">
      <p>{prompt}</p>
      <Link className="text-link underline" to={to}>
        {linkText}
      </Link>
    </div>
  )
}

export default AuthFooter
