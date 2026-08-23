import documentIcon from '../assets/fileAttachment.png'
import downloadIcon from '../assets/downloadDocument.png'
import deleteIcon from '../assets/deleteDocument.png'

function DocumentCard({ id, name, url, onDelete }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 sm:px-5 sm:py-4">
      <div className="flex min-w-0 items-center gap-3">
        <img src={documentIcon} alt="" className="size-7 shrink-0 sm:size-8" />
        <span className="truncate text-sm font-semibold text-brand-black sm:text-base">{name}</span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <a
          href={url}
          download
          className="text-brand-black/60 hover:text-brand-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black"
          aria-label={`Download ${name}`}
        >
          <img src={downloadIcon} alt="" className="size-7 sm:size-8" />
        </a>

        <button
          type="button"
          onClick={() => onDelete(id)}
          className="cursor-pointer text-brand-black/60 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black"
          aria-label={`Delete ${name}`}
        >
          <img src={deleteIcon} alt="" className="size-7 sm:size-6" />
        </button>
      </div>
    </div>
  )
}

export default DocumentCard
