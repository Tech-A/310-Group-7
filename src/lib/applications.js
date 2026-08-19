import { supabase } from './supabaseClient'

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
    grouped[column.title] = data.filter((row) => row.status === column.title).map(toApplication)
    return grouped
  }, {})
}

export async function insertApplication({ company, location, role, dueDate, status, position }) {
  const { data, error } = await supabase
    .from('applications')
    .insert({ company_name: company, location, role, due_date: dueDate, status, position })
    .select()
    .single()

  if (error) throw error
  return toApplication(data)
}

export async function updateApplicationPositions(status, applications) {
  const results = await Promise.all(
    applications.map((application, index) =>
      supabase.from('applications').update({ status, position: index }).eq('id', application.id),
    ),
  )

  const failed = results.find((result) => result.error)
  if (failed) throw failed.error
}
