const application = (id, company, location, role, dueDate) => ({
  id,
  company,
  location,
  role,
  dueDate,
})

export const COLUMNS = [
  { title: 'To apply', tone: 'bg-brand-blue' },
  { title: 'Applied / Waiting', tone: 'bg-brand-pink' },
  { title: 'Interview', tone: 'bg-brand-green' },
  { title: 'Offer', tone: 'bg-brand-yellow' },
]

export const INITIAL_ITEMS = {
  'To apply': [
    application(
      'atlassian-software-engineering',
      'Atlassian',
      'Sydney, AU',
      'Software Engineering Intern',
      '25 Jul',
    ),
  ],
  'Applied / Waiting': [
    application('xero-product-design', 'Xero', 'Wellington, NZ', 'Product Design Intern', '18 Aug'),
    application(
      'datacom-software-development',
      'Datacom',
      'Auckland, NZ',
      'Software Development Intern',
      '22 Aug',
    ),
  ],
  Interview: [
    application(
      'canva-frontend-engineering',
      'Canva',
      'Sydney, AU',
      'Frontend Engineering Intern',
      '19 Aug',
    ),
    application(
      'air-new-zealand-data',
      'Air New Zealand',
      'Auckland, NZ',
      'Data Analyst Intern',
      '21 Aug',
    ),
    application('serko-qa-engineering', 'Serko', 'Auckland, NZ', 'QA Engineering Intern', '26 Aug'),
  ],
  Offer: [
    application(
      'sharesies-software-engineering',
      'Sharesies',
      'Wellington, NZ',
      'Software Engineering Intern',
      '20 Aug',
    ),
    application('trademe-web-development', 'Trade Me', 'Wellington, NZ', 'Web Development Intern', '23 Aug'),
  ],
}
