# Auth pages

Login, sign up and password reset. This covers the UI; the auth behaviour
behind it is in [authentication.md](authentication.md).

## Routes

| Path | Page | File |
| --- | --- | --- |
| `/` | Login | `src/pages/LoginPage.jsx` |
| `/signup` | Sign up | `src/pages/SignUpPage.jsx` |
| `/forgot-password` | Request a reset link | `src/pages/ForgotPasswordPage.jsx` |
| `/reset-password` | Set a new password | `src/pages/ResetPasswordPage.jsx` |

`/` is login for now. When the landing page lands it takes `/`, and login
moves to `/login` — one line in `src/App.jsx`, plus the `to` props on the
`AuthFooter`s that point back at login.

Routing lives in `src/App.jsx`; `<BrowserRouter>` wraps the app in
`src/main.jsx`. Internal navigation uses `<Link>`, never `<a href>` — an `<a>`
triggers a full page reload and drops all React state.

## Components

All in `src/components/`. Each one owns how it looks; the caller owns where it
sits (spacing comes in via `className`).

**`AuthCard`** — the shared shell: page background, logo, heading, the card
itself, and all four decorative images. Takes `title` and `children`. A page
using it only has to describe its own form.

**`Field`** — a label plus an input. `id` is required and must be unique on the
page: it wires the `<label htmlFor>` to the input, which is what makes clicking
the label focus the field and lets screen readers announce them as a pair.
Anything else you pass (`type`, `placeholder`, `autoComplete`, and later
`value`/`onChange`) is spread onto the `<input>`.

**`AuthButton`** — the yellow submit button. Defaults to `type="submit"` and to
the spacing every auth card wants.

**`AuthFooter`** — the "Already have an account? Log in" row. Takes `prompt`,
`linkText` and `to`.

**`Logo`** — the Pipeline wordmark, shared with the sidebar. `className` sets
the text size (the wordmark inherits it), `markClassName` the ring; the inner
dot is a percentage of the ring so they stay in proportion at any size.

**`FormMessage`** — an inline error or success line. Takes `tone`
(`'error'` by default, or `'success'`) and children. It exists as a component
rather than a repeated `<p>` because the ARIA role — `alert` for errors,
`status` for success — is the part four separate pages would forget, and it is
what makes a screen reader announce the message when it appears.

## The layering

The one genuinely non-obvious part. The heading sits behind the card, the
beaver is split across it, and the grass sits in front:

```
heading  →  beaver body (z-0)  →  card (z-10)  →  grass + beaver arms (z-20)
```

Two things this depends on:

- **The beaver is a sibling of the card, not a child.** A child element can
  never paint behind its own parent's background, no matter its z-index. This
  is why the two beaver images live outside the card's `<div>`.
- **`z-index` needs a positioned element.** Everything in that chain carries
  `relative` or `absolute`; adding a z-index to a static element does nothing.

The two beaver images share `BEAVER_POSITION` so they can't drift apart — they
are one piece of artwork split in half, and any difference in position shows up
as a visible seam.

Nothing in the chain may have `overflow-hidden`, or the grass and beaver get
clipped where they hang past the card's edges.

## Colours and fonts

Design tokens are in `src/styles/preset.css`, inside Tailwind v4's `@theme`
block (v4 has no JS config file — this is its equivalent). Defining
`--color-link` there generates `text-link`, `bg-link`, `border-link` and so on.

Use a token when a colour has a role that recurs — `--color-link`,
`--color-input-bg`, `--color-error`, `--color-success`. One-off decorative
values can stay inline.

Poppins is loaded in `index.html` and set as `--font-sans`, so it applies
everywhere without a `font-sans` class.

## Conventions

- **Tokens for values, components for markup.** We deliberately avoid `@apply`
  and shared CSS classes: a CSS class carries only the styling, so a caller can
  still get the structure or the `htmlFor`/`id` pairing wrong. A component
  carries all three.
- **Long `className` strings are accepted.** Tailwind class lists routinely run
  past 100 characters and breaking them up hurts readability more than it
  helps. Everything else stays within normal line lengths.

## Not done yet

- `beaver.png` is ~666 KB and `beaverArms.png` ~209 KB, most of the bundle.
  They should be re-exported as SVG like the grass.
- No automated tests — the project has no test framework yet.
