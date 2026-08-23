import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableApplicationCard from './SortableApplicationCard'

function StatusColumn({ id, title, tone, applications, onDeleteApplication }) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <section className={`${tone} flex min-h-56 flex-col rounded-[1.35rem] p-4`}>
      <header className="mb-7 flex items-center justify-between px-1">
        <h2
          className={`flex items-center gap-2 font-medium ${
            title === 'Applied / Waiting' ? 'text-sm' : 'text-base'
          }`}
        >
          <span className="size-2 rounded-full bg-white" />
          {title}
        </h2>
        <span className="min-w-8 rounded-full bg-white/70 px-2 py-1 text-center text-xs">
          {applications.length}
        </span>
      </header>

      <SortableContext items={applications.map((application) => application.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="min-h-full flex-1 space-y-3 overflow-y-auto">
          {applications.map((application) => (
            <SortableApplicationCard
              key={application.id}
              application={application}
              onDelete={onDeleteApplication}
            />
          ))}
        </div>
      </SortableContext>
    </section>
  )
}

export default StatusColumn
