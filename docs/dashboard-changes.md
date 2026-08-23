# Dashboard frontend changes

## Summary

A responsive internship dashboard has been added based on the supplied design mockup. It uses the same Tailwind theme and decorative artwork as the existing authentication pages.

## New files

- `src/pages/DashboardPage.jsx` defines the dashboard page layout.
- `src/components/StatusColumn.jsx` provides the reusable workflow column.
- `src/pages/dashboardData.js` defines the four workflow stages and their theme colours.

## Routing

- Added the dashboard route at `/dashboard` in `src/App.jsx`.
- The existing login page remains at `/`.
- Login does not currently authenticate or redirect to the dashboard.
- The dashboard is not currently protected by an authenticated route.

## Dashboard interface

- Added a black sidebar containing the Pipeline logo and title.
- Added the greeting and internship dashboard subtitle.
- Added a visual `+ Add application` placeholder button. It has no click behaviour yet.
- Added four empty workflow columns:
  - To apply
  - Applied / Waiting
  - Interview
  - Offer
- Each column displays a count of `0`.
- Reduced the Applied / Waiting title size to prevent it touching its counter.
- Removed the example Atlassian application and all white placeholder cards.

## Artwork and layering

- Reused the existing split beaver artwork from the login module.
- The beaver body is placed behind the coloured columns.
- The beaver arms are rendered above the columns at the same coordinates.
- Grass artwork is centred across the boundary between the Interview and Offer columns.

## Styling

- The dashboard uses one workflow column on mobile, two on tablet, and four on large desktop screens.
- The sidebar becomes a compact top navigation on mobile and returns to a vertical sidebar on desktop.
- Decorative dashboard artwork is hidden below the large desktop breakpoint to prevent content overlap.
- Workflow columns use the shared README palette:
  - Blue: `#A6C2D2`
  - Pink: `#D9BFB1`
  - Green: `#B8D2C7`
  - Yellow: `#F5E0AE`
  - Background: `#F4F4F2`
- Corrected the `brand-black` theme token to the README value `#615F5F`.

## Testing and verification

- No automated dashboard tests were retained, matching the current login module, which also has no tests.
- The current dashboard changes pass `npm run lint`.
- The current dashboard changes pass `npm run build`.

## Remaining work

- Connect successful login to `/dashboard`.
- Implement Supabase authentication and route protection.
- Implement the Add application interaction.
- Load real application data and update column counters.
- Add automated component and interaction tests when the project adopts a React testing framework.
