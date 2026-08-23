/*
 * Logo — the Pipeline wordmark: a white ring with a grey dot, then the name.
 *
 * Sized by the caller. `className` sets the text size and the wordmark inherits
 * it; `markClassName` sets the ring. The inner dot is a percentage of the ring,
 * so the two stay in proportion at any size.
 *
 * Designed for dark backgrounds — the ring is white and the wordmark inherits
 * whatever text colour its parent sets.
 */
function Logo({ className = '', markClassName = 'size-7' }) {
  return (
    <span className={`flex items-center gap-2 font-bold ${className}`}>
      <span
        className={`grid shrink-0 place-items-center rounded-full bg-white ${markClassName}`}
      >
        <span className="size-[42%] rounded-full bg-input-bg" />
      </span>
      Pipeline
    </span>
  )
}

export default Logo
