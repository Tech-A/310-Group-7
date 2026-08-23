import { useEffect, useState } from 'react'
import beaver from '../assets/beaver.png'
import DocumentCard from '../components/DocumentCard'
import Dropzone from '../components/DocumentDropzone'
import FormMessage from '../components/FormMessage'
import Sidebar from '../components/Sidebar'
import useAuth from '../context/useAuth'
import { supabase } from '../lib/supabaseClient'

const BEAVER_POSITION = 'pointer-events-none absolute left-[35%] top-14 hidden w-31 xl:block'

// How long a download link stays valid. The bucket is private, so every URL is
// signed. Known limitation: links are minted when the page loads, so a tab left
// open longer than this has dead links until it's refreshed.
const SIGNED_URL_TTL_SECONDS = 60 * 60

// Files are stored as "<user id>/<uuid>-<original name>". The uuid keeps two
// uploads of the same filename apart; this strips it back off for display.
// Anchored to the uuid shape so a real filename like "2024-cv.pdf" survives.
const STORED_NAME_PREFIX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i

function toDisplayName(storedName) {
  return storedName.replace(STORED_NAME_PREFIX, '')
}

function DocumentsPage() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!user) return

    // StrictMode double-invokes this in development and there are two awaits
    // below, so a torn-down run could otherwise write state after unmounting.
    let active = true

    async function loadDocuments() {
      // Only this user's folder. The storage policy checks the first path
      // segment against auth.uid(), so anything else is unreadable anyway.
      const { data, error } = await supabase.storage
        .from('documents')
        .list(user.id, { sortBy: { column: 'name', order: 'asc' } })

      if (!active) return

      if (error) {
        console.error('Could not load documents:', error.message)
        setErrorMessage('Could not load your documents. Try refreshing.')
        setIsLoading(false)
        return
      }

      // Supabase drops this marker into a folder that would otherwise be empty.
      const files = data.filter((file) => file.name !== '.emptyFolderPlaceholder')

      if (files.length === 0) {
        setDocuments([])
        setIsLoading(false)
        return
      }

      const paths = files.map((file) => `${user.id}/${file.name}`)

      // One request for the whole page rather than one per file. `download`
      // makes Supabase send Content-Disposition: attachment, which is what
      // actually makes DocumentCard's <a download> work — browsers ignore that
      // attribute on cross-origin links.
      const { data: signed, error: signedError } = await supabase.storage
        .from('documents')
        .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS, { download: true })

      if (!active) return

      if (signedError) {
        console.error('Could not sign documents:', signedError.message)
        setErrorMessage('Could not load your documents. Try refreshing.')
        setIsLoading(false)
        return
      }

      // Keyed by path, not zipped by index — the response order isn't
      // guaranteed to match the request, and zipping would pair names with the
      // wrong URLs without ever erroring.
      const urlByPath = new Map(signed.map((item) => [item.path, item.signedUrl]))

      // id is the full storage path, which is what remove() needs and what
      // keeps it unique across users.
      setDocuments(
        files.map((file) => ({
          id: `${user.id}/${file.name}`,
          name: toDisplayName(file.name),
          url: urlByPath.get(`${user.id}/${file.name}`) ?? '',
        })),
      )
      setIsLoading(false)
    }

    loadDocuments()

    return () => {
      active = false
    }
  }, [user])

  async function handleFilesDropped(files) {
    setErrorMessage('')

    const uploadedDocs = []
    const failedNames = []

    for (const file of files) {
      // The "<user id>/" prefix is mandatory — it is the only thing the storage
      // policy checks. Uploading to the bucket root is rejected outright.
      const filePath = `${user.id}/${crypto.randomUUID()}-${file.name}`

      const { error } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (error) {
        console.error('Upload failed:', error.message)
        failedNames.push(file.name)
        continue
      }

      const { data, error: signedError } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, SIGNED_URL_TTL_SECONDS, { download: true })

      if (signedError) {
        console.error('Could not sign upload:', signedError.message)
        failedNames.push(file.name)
        continue
      }

      uploadedDocs.push({
        id: filePath,
        name: file.name,
        url: data.signedUrl,
      })
    }

    if (failedNames.length > 0) {
      setErrorMessage(`Could not upload ${failedNames.join(', ')}.`)
    }

    setDocuments((previous) => [...previous, ...uploadedDocs])
  }

  async function handleDeleteDocument(id) {
    setErrorMessage('')

    // `id` is the full "<user id>/<stored name>" path. The storage policy
    // rejects anything outside the signed-in user's folder, so this cannot
    // delete someone else's file even if the id were tampered with.
    const { error } = await supabase.storage.from('documents').remove([id])

    if (error) {
      console.error('Delete failed:', error.message)
      setErrorMessage('Could not delete that document.')
      return
    }

    setDocuments((previous) => previous.filter((doc) => doc.id !== id))
  }

  return (
    <main className="min-h-screen bg-brand-bg p-3 text-brand-black sm:p-4">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[100rem] flex-col gap-4 sm:min-h-[calc(100vh-2rem)] md:flex-row md:gap-5">
        <Sidebar />

        <section className="relative isolate flex min-w-0 flex-1 flex-col md:pl-2">
          <header className="mb-6 flex flex-col gap-4 px-1 pt-2 sm:flex-row sm:items-start sm:justify-between sm:px-2 md:pt-7 lg:pt-9">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Hello, Stranger<span aria-hidden="true">✦</span>
              </h1>
              <p className="mt-1 text-base">Welcome to your documents archive</p>
            </div>
            <label
              htmlFor="document-upload-input"
              className="cursor-pointer rounded-full bg-brand-black px-7 py-3.5 text-base text-white sm:w-auto sm:px-9 sm:py-4"
            >
              + Add document
            </label>
          </header>

          <img src={beaver} alt="" aria-hidden="true" className={BEAVER_POSITION} />

          <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-4">
            <div className="rounded-[1.75rem] bg-brand-blue p-4 sm:rounded-[2.5rem] sm:p-6">
              <h2 className="mb-4 text-lg font-semibold">Documents</h2>

              {errorMessage && <FormMessage>{errorMessage}</FormMessage>}

              {isLoading && <p className="text-sm">Loading your documents…</p>}

              {!isLoading && documents.length === 0 && (
                <p className="text-sm">
                  No documents yet — drop a file below to get started.
                </p>
              )}

              {documents.length > 0 && (
                <div className="flex flex-col gap-3">
                  {documents.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      {...doc}
                      onDelete={handleDeleteDocument}
                    />
                  ))}
                </div>
              )}
            </div>

            <Dropzone onFilesDropped={handleFilesDropped} />
          </div>
        </section>
      </div>
    </main>
  )
}

export default DocumentsPage
