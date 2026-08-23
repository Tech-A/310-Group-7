# Responsive layout

## Summary

The application layout supports desktop, tablet, and mobile screens. The responsive implementation preserves the existing visual design while changing navigation, content columns, spacing, typography, controls, and decorative artwork to suit the available width.

The smallest supported viewport width is 320px.

## Breakpoints

The interface uses Tailwind CSS responsive utilities with the following main breakpoints:

| Viewport | Layout behaviour |
| --- | --- |
| Mobile, below 640px | Compact top navigation, stacked headers and actions, and one dashboard column |
| Tablet, 640px to 1279px | Wider controls and typography, with two dashboard columns from 640px |
| Desktop, 768px and above | Navigation moves to the left sidebar |
| Large desktop, 1280px and above | Dashboard displays four columns and decorative dashboard artwork |

## Navigation

`Sidebar.jsx` adapts to the screen width:

- On mobile, it is displayed as a horizontal navigation bar above the page content.
- Navigation labels are hidden on the narrowest screens while the icons remain visible.
- From the `sm` breakpoint, navigation labels are shown.
- From the `md` breakpoint, navigation becomes a vertical left sidebar.
- Active and hover states are preserved at every size.

## Dashboard

`DashboardPage.jsx` no longer uses a fixed 1200px minimum width or a fixed viewport height.

- The page can grow vertically and scroll when its content is taller than the viewport.
- The heading and Add application button stack on mobile.
- The Add application button fills the available width on mobile.
- Status columns use one column on mobile, two on tablet, and four on large desktop screens.
- Each status column has a minimum height so empty workflow stages remain clear.
- The split beaver and grass artwork is hidden below the large desktop breakpoint to prevent overlap with content.

## Documents page

`DocumentsPage.jsx`, `DocumentCard.jsx`, and `DocumentDropzone.jsx` adjust to narrow screens.

- The page header and Add document button stack on mobile.
- The documents panel uses smaller padding and corner radii on mobile.
- Long filenames are truncated instead of creating horizontal overflow.
- Document and download icons scale down on small screens.
- The drop zone has a practical minimum height and responsive icon and text sizes.

## Authentication pages

The shared authentication components support narrow screens without changing the form structure.

- Card padding decreases on mobile and returns to the original spacing on larger screens.
- Page headings use fluid font sizing.
- Primary buttons use the full available width on mobile.
- Footer text can wrap cleanly.
- Decorative grass and beaver artwork scales down on mobile.
- Visible keyboard focus styles are provided for primary actions.

These changes apply to login, sign-up, and password reset because all three pages use the shared authentication components.

## Application modal

`ApplicationModal.jsx` remains usable on short and narrow screens.

- The dialog can scroll vertically when its form does not fit in the viewport.
- Outer padding, heading size, card spacing, and form gaps decrease on mobile.
- Form controls remain within the available width.
- The Submit button fills the modal width on mobile and returns to its compact size on larger screens.

## Verification

The responsive implementation passes:

- `npm run lint`
- `npm run build`
- `git diff --check`

The layouts should also be manually reviewed at representative widths before merging:

- 375px mobile
- 768px tablet
- 1440px desktop

## Files changed

- `src/components/ApplicationModal.jsx`
- `src/components/AuthButton.jsx`
- `src/components/AuthCard.jsx`
- `src/components/AuthFooter.jsx`
- `src/components/DocumentCard.jsx`
- `src/components/DocumentDropzone.jsx`
- `src/components/Sidebar.jsx`
- `src/components/StatusColumn.jsx`
- `src/index.css`
- `src/pages/DashboardPage.jsx`
- `src/pages/DocumentsPage.jsx`

