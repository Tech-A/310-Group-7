# Authentication

Email and password sign-in via Supabase Auth. This covers how the pieces fit
together, the decisions that look odd until you know why, and what needs
configuring before it will run.

## Why this matters more than a login form

`schema.sql` gives both tables a `user_id` defaulting to `auth.uid()`, and
row-level security policies that check `auth.uid() = user_id`. **`auth.uid()` is
whoever is currently signed in.** So auth isn't a cosmetic gate in front of the
app — it's the thing that makes the whole schema secure. With nobody signed in,
`auth.uid()` is null and every policy returns nothing.

The same applies to the storage bucket: it's private, and its policy only allows
access to files whose first path segment matches the user's id.

## The pieces

| File | Role |
| --- | --- |
| `src/lib/supabaseClient.js` | The one shared client. Throws early if env vars are missing. |
| `src/context/AuthContext.js` | The context object, alone in its own file. |
| `src/context/AuthProvider.jsx` | Tracks the session app-wide. |
| `src/context/useAuth.js` | `const { user, session, loading } = useAuth()` |
| `src/components/ProtectedRoute.jsx` | Wraps pages needing a signed-in user. |
| `src/components/PublicOnlyRoute.jsx` | Wraps the auth forms. |
| `src/components/RouteLoading.jsx` | Shown while the session is being restored. |
| `src/components/FormMessage.jsx` | Inline error / success line, with the right ARIA role. |

`AuthProvider` wraps `<App />` inside `<BrowserRouter>` in `src/main.jsx`.

## How the session is tracked

`AuthProvider` does two things in one effect:

1. `supabase.auth.getSession()` — recovers an existing session on first load, so
   a refresh doesn't sign you out.
2. `supabase.auth.onAuthStateChange(...)` — keeps the app in sync afterwards, on
   sign-in, sign-out, and silent token refreshes.

It exposes `{ session, user, loading }` and nothing else. In particular it does
**not** wrap `signIn` / `signOut`. Pages call `supabase.auth.*` directly, so
there is one way to talk to Supabase rather than two competing ones, and the
official docs apply as written.

### `loading` is not cosmetic

Restoring a session is asynchronous. For the first render after a refresh there
is no session yet, even for a signed-in user. If `ProtectedRoute` treated that
as "signed out", it would throw people out of the app every time they pressed
F5. `loading` means "we don't know yet", which is distinct from "no".

### Three things that would break it

- **Not unsubscribing.** The effect returns a cleanup calling
  `subscription.unsubscribe()`. Without it, React StrictMode's mount → unmount →
  mount leaves two live subscriptions.
- **Writing state after teardown.** The `active` flag discards the first run's
  `getSession()` result if it lands after that run was torn down. React 19
  doesn't warn about this, so it fails silently.
- **A "run once" ref guard.** The common StrictMode advice is a `useRef(false)`
  guard. It is wrong here — the second mount would skip `onAuthStateChange`
  entirely and the app would never notice a sign-in or sign-out again.
  Idempotent subscribe plus cleanup is the correct shape.

The `onAuthStateChange` callback is also deliberately **not** `async`. It can run
while supabase-js holds an internal lock, and awaiting another `supabase.auth`
call inside it deadlocks.

## Why the context is three files

`eslint.config.js` extends `reactRefresh.configs.vite`, which sets
`react-refresh/only-export-components` to **error**. A single `AuthContext.jsx`
exporting the provider, the hook and the context is three lint failures. So:
context in `AuthContext.js`, hook in `useAuth.js` (the rule only scans `.jsx`),
component alone in `AuthProvider.jsx`.

Don't add a file whose name differs only by case — Windows is case-insensitive
and `.js` resolves before `.jsx`, so imports would silently pick the wrong one.

## Routes

| Path | Page | Guard |
| --- | --- | --- |
| `/` | Login | public only |
| `/signup` | Sign up | public only |
| `/forgot-password` | Request a reset link | public only |
| `/reset-password` | Set a new password | **none** |
| `/dashboard` | Dashboard | protected |
| `/documents` | Documents | protected |

Both guards use `<Navigate replace>`. Without `replace`, a redirect leaves the
blocked page in history, so pressing Back triggers the redirect again — an
inescapable loop.

`ProtectedRoute` passes the attempted location in `state.from`, and `LoginPage`
sends the user there after signing in rather than always to the dashboard.

Signing out needs no `navigate()` call: it clears the session, the provider
updates, and `ProtectedRoute` redirects on its own. If sign-out doesn't navigate,
the guards are wired wrong.

## Sign up and the "Confirm email" setting

That dashboard setting (Authentication → Providers → Email) changes what
`signUp` returns, so the page branches on the response rather than assuming:

- **`data.session` present** — confirmation is off, the user is already signed
  in, go to the dashboard.
- **`data.session` null** — confirmation is on; show "check your inbox".

Signing up with an **already-registered** address returns no error and a decoy
user object. That's deliberate on Supabase's part: it stops the form being used
to discover which emails have accounts. We show the same "check your inbox"
message either way rather than detecting it, because detecting it would put the
leak straight back. Same reasoning is why login shows Supabase's "Invalid login
credentials" verbatim instead of something friendlier.

## The password reset round trip

1. `/forgot-password` calls `resetPasswordForEmail(email, { redirectTo })`, where
   `redirectTo` is `${window.location.origin}/reset-password` — computed, not
   hard-coded, so one build works locally and on Netlify.
2. Supabase emails a one-time link.
3. Clicking it verifies the token and redirects to `/reset-password` with
   `#access_token=...&type=recovery` in the URL fragment.
4. The client's `detectSessionInUrl` (on by default) consumes that fragment at
   import time, turns it into a session, and clears the hash. **We parse none of
   this ourselves.**
5. `/reset-password` calls `updateUser({ password })`, then `signOut()`, then
   sends the user to login with a success message.

### Why `/reset-password` has no guard

Step 4 creates a **real session**. So:

- `PublicOnlyRoute` would bounce the user to the dashboard before they could
  change anything.
- `ProtectedRoute` would dump users with an expired link on the login page with
  no explanation.

The page reads `loading` and `session` itself and renders one of three states:
loading, invalid/expired, or the form.

### Why it signs you out afterwards

The recovery link left a live session. Signing out forces the user to prove they
know the new password, and means a forwarded reset email doesn't leave someone
signed in. If you'd rather keep them in, drop the `signOut()` — but that's a
security decision, so update this document too.

Note the ordering: `updateUser` must resolve **before** `signOut`, or the update
runs against a revoked token.

### Tutorials to ignore

Anything using `exchangeCodeForSession` is written for the PKCE flow. This client
uses the default **implicit** flow, where the token arrives in the URL fragment,
and calling that function throws on the flow mismatch.

## Documents storage

The bucket is **private**. Every file lives at `<user id>/<uuid>-<filename>`,
because the storage policy only checks the first path segment. Consequences:

- Uploads must include the `${user.id}/` prefix or they're rejected.
- Listing uses `list(user.id)`, not `list('')`.
- Downloads use `createSignedUrls(paths, ttl, { download: true })`.
  `getPublicUrl` returns a valid-looking URL that 400s on a private bucket —
  nothing errors until the user clicks, which is the worst way to fail.
- `{ download: true }` sets `Content-Disposition: attachment`, which is what
  makes `DocumentCard`'s `<a download>` work. Browsers ignore that attribute on
  cross-origin links otherwise.
- Signed URLs are built from a `Map` keyed on path, not zipped by index — the
  response order isn't guaranteed to match the request.
- Signed URLs are minted once per page load and last an hour. A tab left open
  longer has dead links until refreshed.

Files uploaded under the old scheme sat at the bucket root with no user folder.
They are unreachable under the new policy and were deleted from the dashboard.

## Configuration you need

**Environment** — `.env.local` with `VITE_SUPABASE_URL` and
`VITE_SUPABASE_PUBLISHABLE_KEY`. The client throws a named error if either is
missing, rather than failing obscurely later.

**Supabase dashboard:**

- Authentication → URL Configuration → **Site URL** `http://localhost:5173`, and
  add `http://localhost:5173/reset-password` to **Redirect URLs**. If it isn't
  allowlisted, Supabase silently falls back to the Site URL and the reset link
  lands on `/` — which looks like a routing bug but isn't.
- Authentication → Providers → Email → **Confirm email**: off is easier for
  development, on is correct for the demo.

**Deployment** — `public/_redirects` contains `/*  /index.html  200`. Without it,
loading `/reset-password` or `/documents` directly returns a 404 on Netlify,
which matters most for the emailed reset link. Add the deployed
`/reset-password` URL to the Redirect URLs allowlist too.

## Remaining work

- The greeting on both dashboard and documents pages is still the hardcoded
  "Hello, Stranger✦"; it could use `useAuth()`.
- The `applications` table isn't wired up — the dashboard is still mock data.
- No `*` catch-all route, so an unknown URL renders blank.
- Signed URLs are minted at page load rather than on click, so they can expire in
  a long-lived tab.
- No automated tests; the project has no test framework yet.
