# Kanban board drag-and-drop + Supabase persistence

## Summary

The dashboard's application cards can be dragged within a column to reorder them and between columns to change their status, using [`@dnd-kit`](https://dndkit.com/). Board state lives in React state and is loaded from / saved to a Supabase `applications` table, so it persists across devices (not just one browser).

This does **not** yet scope data to a logged-in user — see [Known follow-ups](#known-follow-ups).

## New dependencies

- `@dnd-kit/core`
- `@dnd-kit/sortable`
- `@dnd-kit/utilities`

## Supabase setup

This project uses an existing `applications` table (`id`, `user_id`, `company_name`, `role`, `due_date`, `status`, `position`, `created_at`, `updated_at`). It has no `location` column, so add one, and relax the `user_id`/RLS enforcement for now since real login/signup is being built separately (see `docs/auth-pages.md` — still UI-only stubs as of this writing) and there's no session yet to satisfy it:

```sql
alter table applications add column location text;
alter table applications alter column user_id drop not null;
alter table applications disable row level security;
```

**This is temporary.** Once real auth ships: re-enable RLS, restore `user_id not null`, add a policy scoped to `auth.uid() = user_id`, and have `insertApplication`/`fetchApplicationsByColumn` in `src/lib/applications.js` pass/filter by the logged-in user's id.

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
  Supabase data-access layer for the board. Maps between the DB's column names (`company_name`) and the UI's shape (`company`, camelCase `dueDate`, etc.):
  - `fetchApplicationsByColumn(columns)` — loads all rows and groups them by `status` into the `{ columnTitle: [applications] }` shape the board uses.
  - `insertApplication(data)` — inserts a new row, returns it mapped to the UI's `{ id, company, location, role, dueDate }` shape. Doesn't set `user_id` — see [Supabase setup](#supabase-setup).
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
  - The "+ Add application" modal's `onSubmit` now calls `insertApplication` and appends the returned row to state on success.

## How cross-column dragging works

`@dnd-kit` doesn't know about "columns" — it only knows about draggable/droppable ids. The board tracks membership itself via a small `findContainer(items, id)` helper:

- If `id` is itself a column title (i.e. a key of `items`), that id *is* the container — this happens when hovering over an empty column's droppable area.
- Otherwise, it searches each column's array for an application with that id.

`onDragOver` and `onDragEnd` both use this to figure out which column the dragged card started in and which column it's currently over, then move/reorder entries in the `items` state accordingly. Persistence to Supabase only happens once, in `onDragEnd` — not on every `onDragOver` frame.

## Testing and verification

- `npm run lint` and `npm run build` pass on all changed files.
- Drag-and-drop interaction (reorder within a column, move across columns, count badges updating, `DragOverlay`) was verified in a real browser against the previous `localStorage`-backed version. The Supabase-backed version reuses the same drag logic, so re-verify against your own Supabase project after running the setup above.

## Known follow-ups

- **RLS is disabled and `user_id` is unset.** This is the big one — see the "temporary" note in [Supabase setup](#supabase-setup). Right now every row is world-readable/writable by anyone with the anon key, and rows aren't tied to any user. Must be locked down once real login ships, or every user will see and edit the same shared board.
- **`due_date` is stored as free-text**, matching how `ApplicationModal`/`ApplicationCard` currently handle it, not as a real `date` column — revisit if date-based sorting/filtering is needed later.
- No automated tests were added, matching the rest of the project (no test framework is set up yet).
