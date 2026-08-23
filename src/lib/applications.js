import { supabase } from './supabaseClient'

// DB `status` is constrained to this fixed set (see the `applications_status_check`
// constraint) — it doesn't match the board's column titles, so map between them.
const STATUS_BY_COLUMN = {
  'To apply': 'to_apply',
  'Applied / Waiting': 'applied',
  Interview: 'interview',
  Offer: 'offer',
}

const COLUMN_BY_STATUS = Object.fromEntries(
  Object.entries(STATUS_BY_COLUMN).map(([column, status]) => [status, column]),
)

function toApplication(row) {
  return {
    id: row.id,
    company: row.company_name,
    location: row.location,
    role: row.role,
    dueDate: row.due_date,
  }
}

export async function fetchApplicationsByColumn(columns) {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('position', { ascending: true })

  if (error) throw error

  return columns.reduce((grouped, column) => {
    grouped[column.title] = data
      .filter((row) => COLUMN_BY_STATUS[row.status] === column.title)
      .map(toApplication)
    return grouped
  }, {})
}

export async function insertApplication({ company, location, role, dueDate, status, position, userId }) {
  const { data, error } = await supabase
    .from('applications')
    .insert({
      company_name: company,
      location,
      role,
      due_date: dueDate,
      status: STATUS_BY_COLUMN[status],
      position,
      user_id: userId,
    })
    .select()
    .single()

  if (error) throw error
  return toApplication(data)
}

export async function deleteApplication(id) {
  const { error } = await supabase.from('applications').delete().eq('id', id)
  if (error) throw error
}

export async function updateApplicationPositions(status, applications) {
  const dbStatus = STATUS_BY_COLUMN[status]
  const results = await Promise.all(
    applications.map((application, index) =>
      supabase.from('applications').update({ status: dbStatus, position: index }).eq('id', application.id),
    ),
  )

  const failed = results.find((result) => result.error)
  if (failed) throw failed.error
}
