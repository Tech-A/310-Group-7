# Dashboard Wiring — Changes

## `DashboardPage.jsx`

- `columns` is now component state, initialized from `INITIAL_COLUMNS`, so new applications can be added without mutating the original data.
- Added `handleAddApplication`, passed as the modal's `onSubmit`:
  - Builds a new application object with a generated `id` (`company-role-timestamp`, lowercased and hyphenated) for use as the React list key.
  - Appends it to the **"To apply"** column's `applications` array immutably (maps over `columns`, only updating the matching column).
  - Closes the modal after adding.
- The dashboard grid now renders from `columns` state instead of the static `INITIAL_COLUMNS` import, so newly added applications actually appear on the board.

## Known follow-ups

- State is in-memory only — refreshing the page resets the board back to `INITIAL_COLUMNS`. Persisting submissions (localStorage or a backend) is a separate piece of work if needed.
- New applications always land in "To apply" — no way yet to choose a different starting column from the modal.