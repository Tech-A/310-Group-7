function ApplicationCard({
  id,
  company,
  location,
  role,
  dueDate,
  logo,
  onDelete,
}) {
  const initials = company
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)

  return (
    <article className="rounded-2xl bg-white px-4 py-3.5 text-brand-black shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        {logo ? (
          <img
            src={logo}
            alt={`${company} logo`}
            className="size-10 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-input-bg text-xs font-bold text-brand-black/60"
            aria-label={`${company} logo placeholder`}
          >
            {initials}
          </div>
        )}

        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold leading-tight">{company}</h3>
          <p className="mt-0.5 truncate text-xs text-brand-black/65">{location}</p>
        </div>
      </div>

      <p className="mt-3 truncate text-xs font-medium">{role}</p>

      <footer className="mt-2 flex items-center justify-between text-[0.6875rem] text-brand-black/55">
        <span>Due {dueDate}</span>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(id)}
            onPointerDown={(event) => event.stopPropagation()}
            className="cursor-pointer text-brand-black/35 transition-colors hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black"
            aria-label={`Remove ${company} application`}
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
              <path
                d="M5 7h14M10 7V5.5A1.5 1.5 0 0 1 11.5 4h1A1.5 1.5 0 0 1 14 5.5V7m-7 0 .6 12.02A2 2 0 0 0 9.6 21h4.8a2 2 0 0 0 2-1.98L17 7"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </footer>
    </article>
  )
}

export default ApplicationCard
