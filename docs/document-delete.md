# Document Delete Changes

## Branch

`feature/delete-documents`

## Summary

This branch adds delete support to the Documents page and connects deletion to Supabase Storage so removed files no longer reappear after a page refresh.

## Code Changes

### `src/components/DocumentCard.jsx`

- Added a delete button alongside the existing download action.
- Added an `onDelete` prop, called with the document's `id` when the delete button is clicked.
- Grouped the download and delete actions together so they sit side by side.
- Added a delete icon matching the existing document/download icon pattern.

### `src/pages/DocumentsPage.jsx`

- Added a `handleDeleteDocument` function that removes the file from the `documents` Storage bucket before updating the visible document list.
- Passed `handleDeleteDocument` down to each `DocumentCard` as `onDelete`.
- Fixed the `id` assigned to files loaded from Supabase so it matches the file's Storage path rather than its internal Storage id, since deletion requires the path.
- Removed the `documentsData.js` local seed data and its `useState(INITIAL_DOCUMENTS)` initial value, since it was only ever a placeholder shown briefly before the real Supabase fetch completed.
- Added an `isLoading` state so the page shows a loading message while fetching, an empty-state message when there are no documents, and the document list once loaded — instead of flashing fake seed data on every page load.

### `src/pages/documentsData.js`

- Removed. No longer imported anywhere now that the page loads its initial state directly from Supabase.

## Supabase Setup

For the current anonymous testing setup, Storage policies must also allow deleting files:

```sql
create policy "Allow public delete"
on storage.objects
for delete
to public
using (bucket_id = 'documents');
```

This is in addition to the existing upload and listing policies. Without a delete policy, delete requests do not return an error but also do not remove the file, so the file reappears after refresh.

The anonymous delete policy is suitable only for temporary testing. Production use should require authenticated users and restrict deletion to each user's own files.

## Verification

- Deleting a document removes it from the `documents` bucket in Supabase Storage, confirmed via the Supabase dashboard.
- Deleted documents do not reappear after refreshing the Documents page.

## Current Limitations

- Authentication is not connected yet, so the current delete policy allows anonymous access.
- Delete is not scoped to individual users — any anonymous client can delete any file in the bucket.
- There is no confirmation step before deleting, and no user-facing error message if a delete request fails.