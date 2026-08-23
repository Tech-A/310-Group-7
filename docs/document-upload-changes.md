# Document Upload Changes

## Branch

`feature/implement-document-upload`

## Summary

This branch adds document upload support to the Documents page and connects uploads to Supabase Storage so files remain available after a page refresh.

## Code Changes

### `src/components/DocumentDropzone.jsx`

- Added a hidden file input that supports selecting multiple files.
- Added a label so users can browse for files from the Documents page.
- Kept drag-and-drop support.
- Added a check so empty drops are ignored.
- Reset the file input after selection so the same file can be selected again.

### `src/pages/DocumentsPage.jsx`

- Connected the page to the shared Supabase client.
- Uploads selected or dropped files to the `documents` Storage bucket.
- Generates a unique Storage path for each uploaded file.
- Adds successfully uploaded files to the visible document list.
- Uses signed URLs for document downloads (superseded — see the note below).
- Loads existing files from the `documents` bucket when the page opens.
- Removes the generated numeric prefix from filenames displayed in the interface.
- Changed the `+ Add document` control to open the file picker.

## Supabase Setup

The project requires these local environment variables in `.env`:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Supabase must contain a Storage bucket named `documents`.

> **Superseded by authentication.** This section described a *public* bucket with
> *anonymous* policies, which was only ever a temporary testing setup. Since
> authentication landed the bucket is **private** and files are scoped per user.
> See [authentication.md](authentication.md) for the current arrangement; the
> policies below are the ones now in `schema.sql`:

```sql
create policy "Users manage own files"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
```

Files uploaded under the old anonymous scheme sat at the bucket root with no
user folder. The new policy checks the first path segment, so those objects are
unreachable from the app and were deleted from the Supabase dashboard.

## Verification

- `npm run lint` passes.
- Uploaded files appear in Supabase Storage under the `documents` bucket.
- Existing uploaded files are loaded back into the Documents page after refreshing.

## Current Limitations

Most of the original limitations here were resolved by the authentication work:
the bucket is private, files are namespaced per user, the local seed data is
gone, and failed uploads now surface a message instead of only a console line.

What remains:

- No upload progress indicator.
- Signed download URLs are minted when the page loads and expire after an hour,
  so a tab left open longer has dead links until it is refreshed.
- No way to delete or rename a document from the interface.
