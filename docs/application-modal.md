# Add Application Modal - Feature 

## New files
- **`src/components/ApplicationModal.jsx`**
  New component for the "Add application" form. Renders as a modal overlay with fields for Company, Role, and Due date, plus a Submit button and a close (×) control. Styled with Tailwind using the project's theme tokens (`brand-black`, `brand-bg`, `brand-yellow`, `input-bg`, `input-placeholder`).

  Props:
  - `isOpen` (bool) — controls visibility
  - `onClose` (func) — called when the overlay or × is clicked
  - `onSubmit` (func) — called on form submit with `{ company, role, dueDate }`

  Includes:
  - Field validation on submit (Company, Role, Due date all required), with inline error messages shown under each field.
  - Due date uses a native `<input type="date">` picker, so the browser guarantees a valid date or empty value — no manual date parsing needed. Value is stored/passed in `YYYY-MM-DD` format.
  - Form resets after a successful submit. Closing without submitting (× or clicking outside the modal) intentionally does *not* clear the fields, so in-progress input isn't lost if the modal is closed by accident.

- **`src/components/ApplicationCard.jsx`**
  Displays a single application as a card: company logo (or initials fallback), location, role, and due date. Used to render entries within each `StatusColumn` on the dashboard.

## Updated files

- **`src/pages/DashboardPage.jsx`**
  - Imported and wired up `ApplicationModal`.
  - Added `isModalOpen` state.
  - "+ Add application" button now opens the modal (`cursor-default` placeholder removed).
  - `onSubmit` calls `insertApplication` (see `docs/kanban-drag-and-drop.md`) and appends the created row to the "To apply" column's state.

## Design notes

- Modal heading ("Add application") sits above and slightly overlapping the dark card, matching the original mockup. Achieved with a negative margin on the card and explicit `z-index` stacking (heading on top) so it renders above the card instead of being hidden behind it.
- Colors, font, and input styling pull from the project's Tailwind theme (`@theme` block) rather than hardcoded hex values, so it stays consistent with the rest of the app.

## Known follow-ups

- `dueDate` is stored as `YYYY-MM-DD` (native date input format) — will need formatting when displayed on `ApplicationCard`.