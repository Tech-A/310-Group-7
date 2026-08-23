import { useEffect, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import confetti from 'canvas-confetti'
import beaver from '../assets/beaver.png'
import beaverArms from '../assets/beaverArms.png'
import grassDouble from '../assets/grassDouble.svg'
import ApplicationCard from '../components/ApplicationCard'
import ApplicationModal from '../components/ApplicationModal'
import Sidebar from '../components/Sidebar'
import StatusColumn from '../components/StatusColumn'
import {
  deleteApplication,
  fetchApplicationsByColumn,
  insertApplication,
  updateApplicationPositions,
} from '../lib/applications'
import useAuth from '../context/useAuth'
import { COLUMNS } from './dashboardData'

const BEAVER_POSITION = 'pointer-events-none absolute left-[35%] top-14 hidden w-31 xl:block'
const NEW_APPLICATION_COLUMN = COLUMNS[0].title
const OFFER_COLUMN = 'Offer'
const CONFETTI_COLORS = ['#F5E0AE', '#A6C2D2', '#D9BFB1', '#B8D2C7']
const EMPTY_ITEMS = COLUMNS.reduce((acc, column) => ({ ...acc, [column.title]: [] }), {})

function findContainer(items, id) {
  if (id in items) return id
  return Object.keys(items).find((key) => items[key].some((item) => item.id === id))
}

function celebrateOffer() {
  const fire = (options) =>
    confetti({
      origin: { y: 0.65 },
      colors: CONFETTI_COLORS,
      disableForReducedMotion: true,
      ...options,
    })

  fire({ particleCount: 60, spread: 55, angle: 60, origin: { x: 0.75, y: 0.65 } })
  fire({ particleCount: 60, spread: 55, angle: 120, origin: { x: 0.75, y: 0.65 } })
}

function DashboardPage() {
  const { user } = useAuth()
  const [items, setItems] = useState(EMPTY_ITEMS)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [activeApplication, setActiveApplication] = useState(null)
  const [dragStartContainer, setDragStartContainer] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    let cancelled = false

    fetchApplicationsByColumn(COLUMNS)
      .then((grouped) => {
        if (!cancelled) setItems(grouped)
      })
      .catch((error) => {
        if (!cancelled) setLoadError(error)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragStart(event) {
    const container = findContainer(items, event.active.id)
    setDragStartContainer(container)
    setActiveApplication(items[container]?.find((item) => item.id === event.active.id) ?? null)
  }

  function handleDragOver(event) {
    const { active, over } = event
    if (!over) return

    const activeContainer = findContainer(items, active.id)
    const overContainer = findContainer(items, over.id)

    if (!activeContainer || !overContainer || activeContainer === overContainer) return

    setItems((prev) => {
      const activeItems = prev[activeContainer]
      const overItems = prev[overContainer]
      const activeIndex = activeItems.findIndex((item) => item.id === active.id)
      const overIndex = overItems.findIndex((item) => item.id === over.id)
      const newIndex = overIndex >= 0 ? overIndex : overItems.length

      return {
        ...prev,
        [activeContainer]: activeItems.filter((item) => item.id !== active.id),
        [overContainer]: [
          ...overItems.slice(0, newIndex),
          activeItems[activeIndex],
          ...overItems.slice(newIndex),
        ],
      }
    })
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveApplication(null)
    const startContainer = dragStartContainer
    setDragStartContainer(null)
    if (!over) return

    const activeContainer = findContainer(items, active.id)
    const overContainer = findContainer(items, over.id)
    if (!activeContainer || !overContainer) return

    const activeIndex = items[activeContainer].findIndex((item) => item.id === active.id)
    const overIndex = items[overContainer].findIndex((item) => item.id === over.id)

    let nextItems = items
    if (activeContainer === overContainer && activeIndex !== overIndex) {
      nextItems = {
        ...items,
        [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex),
      }
      setItems(nextItems)
    }

    updateApplicationPositions(overContainer, nextItems[overContainer]).catch((error) =>
      console.error('Failed to save card position', error),
    )
    if (startContainer && startContainer !== overContainer) {
      updateApplicationPositions(startContainer, nextItems[startContainer]).catch((error) =>
        console.error('Failed to save card position', error),
      )

      if (overContainer === OFFER_COLUMN) celebrateOffer()
    }
  }

  function handleAddApplication(application) {
    const status = NEW_APPLICATION_COLUMN
    const position = items[status].length

    insertApplication({ ...application, status, position, userId: user.id })
      .then((created) => {
        setItems((prev) => ({
          ...prev,
          [status]: [...prev[status], created],
        }))
      })
      .catch((error) => console.error('Failed to add application', error))

    setIsModalOpen(false)
  }

  function handleDeleteApplication(id) {
    const column = findContainer(items, id)
    if (!column) return

    setItems((prev) => ({
      ...prev,
      [column]: prev[column].filter((application) => application.id !== id),
    }))

    deleteApplication(id).catch((error) => console.error('Failed to delete application', error))
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
              <p className="mt-1 text-base">Welcome to your internship dashboard</p>
              {isLoading && <p className="mt-1 text-xs text-brand-black/60">Loading your applications…</p>}
              {loadError && (
                <p className="mt-1 text-xs text-red-600">Couldn't load applications. Try refreshing.</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full rounded-full bg-brand-black px-7 py-3.5 text-base text-white transition hover:brightness-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black sm:w-auto sm:px-9 sm:py-4"
            >
              + Add application
            </button>
          </header>

          <img
            src={beaver}
            alt=""
            aria-hidden="true"
            className={`${BEAVER_POSITION} z-0`}
          />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="relative z-10 grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {COLUMNS.map((column) => (
                <StatusColumn
                  key={column.title}
                  id={column.title}
                  title={column.title}
                  tone={column.tone}
                  applications={items[column.title]}
                  onDeleteApplication={handleDeleteApplication}
                />
              ))}
            </div>

            <DragOverlay>
              {activeApplication ? (
                <div className="rotate-2">
                  <ApplicationCard {...activeApplication} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          <img
            src={beaverArms}
            alt=""
            aria-hidden="true"
            className={`${BEAVER_POSITION} z-20`}
          />

          <img
            src={grassDouble}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-2 right-[25%] z-20 hidden w-44 translate-x-1/2 opacity-80 xl:block"
          />
        </section>
      </div>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddApplication}
      />
    </main>
  )
}

export default DashboardPage
