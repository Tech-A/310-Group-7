# Kanban board drag-and-drop + Supabase persistence

## Summary

The dashboard's application cards can be dragged within a column to reorder them and between columns to change their status, using [`@dnd-kit`](https://dndkit.com/). Board state lives in React state and is loaded from / saved to a Supabase `applications` table, so it persists across devices (not just one browser).

Data is scoped to the logged-in user via Supabase RLS — see [Supabase setup](#supabase-setup).

## New dependencies

- `@dnd-kit/core`
- `@dnd-kit/sortable`
- `@dnd-kit/utilities`

## Supabase setup

This project uses an existing `applications` table (`id`, `user_id`, `company_name`, `role`, `due_date` (`date`), `status`, `position`, `created_at`, `updated_at`). `status` has a CHECK constraint limited to `to_apply` / `applied` / `interview` / `offer` / `rejected` — it doesn't match the board's column titles (`To apply`, `Applied / Waiting`, etc.), so `src/lib/applications.js` maps between them (`rejected` has no corresponding column and is currently just not shown anywhere). The table has no `location` column by default, so add one if it isn't there already:

```sql
alter table applications add column if not exists location text;
```

Now that real auth (`docs/authentication.md`) is merged, the board is scoped per-user via RLS. `insertApplication` passes `user_id` (from `useAuth()`'s `user.id`); `fetchApplicationsByColumn`'s `select('*')` relies on RLS to only return the caller's own rows — no client-side filtering by user id. The project's `applications` table already has RLS enabled with policies shaped like this (verified working end-to-end with a real logged-in session):

```sql
alter table applications alter column user_id set not null;

create policy "Users can view their own applications"
  on applications for select
  using (auth.uid() = user_id);

create policy "Users can insert their own applications"
  on applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own applications"
  on applications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own applications"
  on applications for delete
  using (auth.uid() = user_id);
```

If a fresh/reset Supabase project doesn't have these yet, that's what a `42501 new row violates row-level security policy` error on insert (or a `select` that silently returns zero rows) means — apply the block above.

`.env` (not committed — see `.env.example`) needs:

```
VITE_SUPABASE_URL=<project-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-public-key>
```

Both come from the Supabase dashboard under Settings → API.

## New files

- **`src/components/SortableApplicationCard.jsx`**
  Thin wrapper around `ApplicationCard` that calls `@dnd-kit/sortable`'s `useSortable` and applies the drag transform/listeners to a wrapping `<div>`. Keeps `ApplicationCard` itself purely presentational — it has no drag-related props.

- **`src/lib/applications.js`**
  Supabase data-access layer for the board. Maps between the DB's column names/values (`company_name`, `status` as `to_apply`/`applied`/`interview`/`offer`) and the UI's shape (`company`, camelCase `dueDate`, column titles like `To apply`), via a `STATUS_BY_COLUMN` lookup:
  - `fetchApplicationsByColumn(columns)` — loads all rows and groups them by `status` (translated to column title) into the `{ columnTitle: [applications] }` shape the board uses.
  - `insertApplication(data)` — inserts a new row (including `user_id`, from the caller's session), returns it mapped to the UI's `{ id, company, location, role, dueDate }` shape.
  - `updateApplicationPositions(status, applications)` — persists `status`/`position` for a column's cards after a drag (one `update` per row).

## Updated files

- **`src/pages/dashboardData.js`**
  Trimmed down to just `COLUMNS` — static metadata (`title`, `tone`) for the four workflow stages. The hardcoded seed applications were removed; real data now comes from Supabase.

- **`src/components/StatusColumn.jsx`**
  Each column is now a drop target:
  - `useDroppable({ id })` on the column's content `<div>`, so a column can be dropped into even when it's empty.
  - Its card list is wrapped in a `SortableContext` (`verticalListSortingStrategy`) so cards can be reordered within the column.
  - Renders `SortableApplicationCard` instead of `ApplicationCard` directly.

- **`src/pages/DashboardPage.jsx`**
  - Board data lives in `items` state, starting empty and loaded from Supabase in a `useEffect` on mount (`fetchApplicationsByColumn`). Shows a small "Loading your applications…" / error message while that's in flight.
  - Wrapped the column grid in a `DndContext` with `PointerSensor` (8px activation distance, so clicks aren't mistaken for drags) and `KeyboardSensor` (for accessibility).
  - `onDragStart` — records both the dragged application (for the `DragOverlay`) and which column it started in (`dragStartContainer`), needed later to know which columns to persist.
  - `onDragOver` — when the dragged card is over a different column than it's currently in, moves it into that column's array in local state (this is what makes cross-column dragging feel live instead of only updating on drop).
  - `onDragEnd` — reorders the final column's array if needed, then calls `updateApplicationPositions` for the destination column (and the origin column too, if the card changed columns, since the remaining cards' positions shifted).
  - `DragOverlay` renders a floating copy of the card being dragged (slightly rotated) so it doesn't get visually clipped by column boundaries while dragging.
  - Reads `user` from `useAuth()` (the page is rendered inside `ProtectedRoute`, so a session is always present) and passes `user.id` into `insertApplication` so new rows are attributed to the signed-in user.
  - The "+ Add application" modal's `onSubmit` calls `insertApplication` and appends the returned row to state on success.

## How cross-column dragging works

`@dnd-kit` doesn't know about "columns" — it only knows about draggable/droppable ids. The board tracks membership itself via a small `findContainer(items, id)` helper:

- If `id` is itself a column title (i.e. a key of `items`), that id *is* the container — this happens when hovering over an empty column's droppable area.
- Otherwise, it searches each column's array for an application with that id.

`onDragOver` and `onDragEnd` both use this to figure out which column the dragged card started in and which column it's currently over, then move/reorder entries in the `items` state accordingly. Persistence to Supabase only happens once, in `onDragEnd` — not on every `onDragOver` frame.

## Testing and verification

- `npm run lint` and `npm run build` pass on all changed files.
- Drag-and-drop interaction (reorder within a column, move across columns, count badges updating, `DragOverlay`) was verified in a real browser against the previous `localStorage`-backed version.
- Add application → Supabase insert was verified end-to-end in a real logged-in browser session (headless Chromium against the dev server): submitting the modal produces a `POST .../rest/v1/applications` row scoped to the signed-in user, which then renders in the "To apply" column and survives a refresh.

## Known follow-ups

- **`due_date` is stored as free-text**, matching how `ApplicationModal`/`ApplicationCard` currently handle it, not as a real `date` column — revisit if date-based sorting/filtering is needed later.
- No automated tests were added, matching the rest of the project (no test framework is set up yet).
