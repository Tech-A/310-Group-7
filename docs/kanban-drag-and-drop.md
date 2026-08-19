# Kanban board drag-and-drop + local persistence

## Summary

The dashboard's application cards can now be dragged within a column to reorder them and between columns to change their status, using [`@dnd-kit`](https://dndkit.com/). Board state moved from a static, read-only import into React state, and that state is persisted to `localStorage` so it survives a page refresh.

This does **not** yet sync across devices or tie to a user account — see [Known follow-ups](#known-follow-ups).

## New dependencies

- `@dnd-kit/core`
- `@dnd-kit/sortable`
- `@dnd-kit/utilities`

## New files

- **`src/components/SortableApplicationCard.jsx`**
  Thin wrapper around `ApplicationCard` that calls `@dnd-kit/sortable`'s `useSortable` and applies the drag transform/listeners to a wrapping `<div>`. Keeps `ApplicationCard` itself purely presentational — it has no drag-related props.

## Updated files

- **`src/pages/dashboardData.js`**
  Split the old `INITIAL_COLUMNS` array into:
  - `COLUMNS` — static metadata only (`title`, `tone`) for the four workflow stages.
  - `INITIAL_ITEMS` — an object keyed by column title, each value an array of application objects. This is the shape the board state uses, since `@dnd-kit`'s multi-container pattern needs a `{ containerId: [items] }` map rather than a flat array.

- **`src/components/StatusColumn.jsx`**
  Each column is now a drop target:
  - `useDroppable({ id })` on the column's content `<div>`, so a column can be dropped into even when it's empty.
  - Its card list is wrapped in a `SortableContext` (`verticalListSortingStrategy`) so cards can be reordered within the column.
  - Renders `SortableApplicationCard` instead of `ApplicationCard` directly.

- **`src/pages/DashboardPage.jsx`**
  - Board data now lives in `items` state, seeded from `localStorage` (falling back to `INITIAL_ITEMS` on first run or if storage is empty/corrupt).
  - A `useEffect` writes `items` to `localStorage` (key: `kanban-board-items`) on every change.
  - Wrapped the column grid in a `DndContext` with `PointerSensor` (8px activation distance, so clicks aren't mistaken for drags) and `KeyboardSensor` (for accessibility).
  - `onDragStart` — tracks which application is being dragged, for the `DragOverlay`.
  - `onDragOver` — when the dragged card is over a different column than it started in, moves it into that column's array in state (this is what makes cross-column dragging feel live instead of only updating on drop).
  - `onDragEnd` — if the card ended up in a different position within its final column, reorders that column's array with `arrayMove`.
  - `DragOverlay` renders a floating copy of the card being dragged (slightly rotated) so it doesn't get visually clipped by column boundaries while dragging.
  - Also wired up the "+ Add application" modal's `onSubmit` (previously a `TODO`/`console.log`): it now generates an id from the company, role, and timestamp, and appends the new application to the "To apply" column's state.

## How cross-column dragging works

`@dnd-kit` doesn't know about "columns" — it only knows about draggable/droppable ids. The board tracks membership itself via a small `findContainer(items, id)` helper:

- If `id` is itself a column title (i.e. a key of `items`), that id *is* the container — this happens when hovering over an empty column's droppable area.
- Otherwise, it searches each column's array for an application with that id.

`onDragOver` and `onDragEnd` both use this to figure out which column the dragged card started in and which column it's currently over, then move/reorder entries in the `items` state accordingly.

## Testing and verification

- `npm run lint` passes on all changed files.
- Manually verified in a real browser (Vite dev server + headless Chromium via Playwright):
  - Reordering a card within a column updates the order, count badge unchanged.
  - Dragging a card to a different column moves it there and both columns' count badges update.
  - Reloading the page after moving cards preserves the new arrangement (confirms `localStorage` persistence works).
  - No console errors during any of the above.

## Known follow-ups

- **Persistence is local-only.** `localStorage` is scoped to one browser on one device — it doesn't sync across devices and isn't tied to a user account. Once Supabase auth is implemented (see `docs/dashboard-changes.md`), this should move to a Supabase table (e.g. `applications` with `user_id`, `status`, `position` columns) so progress follows the logged-in user.
- **New application ids** are generated client-side (`company-role-timestamp`, slugified). A real backend would generate these instead (e.g. a UUID primary key).
- No automated tests were added, matching the rest of the project (no test framework is set up yet).
