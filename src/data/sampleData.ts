import type { CVData } from '../types'

export const SAMPLE_CV: CVData = {
  personal: {
    fullName: 'Alex Rivera',
    title: 'Product Designer',
    email: 'alex.rivera@email.com',
    phone: '+1 (555) 012-3456',
    location: 'Austin, TX',
    website: 'alexrivera.design',
    summary:
      'Product designer with 6 years of experience shipping consumer and B2B software. I lead end-to-end design from research to high-fidelity UI, and work closely with engineering to ship fast without cutting corners on craft.',
    photo: null,
  },
  experience: [
    {
      id: 'exp-1',
      role: 'Senior Product Designer',
      company: 'Northwind Labs',
      location: 'Austin, TX',
      start: '2022',
      end: '',
      current: true,
      bullets: [
        'Led redesign of the core onboarding flow, cutting time-to-first-value by 38%',
        'Built and maintained the company design system used across 4 product teams',
        'Ran weekly user research sessions that shaped the 2023 product roadmap',
      ],
    },
    {
      id: 'exp-2',
      role: 'Product Designer',
      company: 'Fieldstone',
      location: 'Remote',
      start: '2019',
      end: '2022',
      current: false,
      bullets: [
        'Designed the mobile checkout experience, improving conversion by 12%',
        'Partnered with PM and engineering on quarterly planning and scoping',
        'Mentored two junior designers through their first shipped features',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      school: 'University of Texas at Austin',
      degree: 'B.F.A. in Design',
      location: 'Austin, TX',
      start: '2015',
      end: '2019',
      details: 'Minor in Computer Science. Dean\'s list, 2017-2019.',
    },
  ],
  skills: [
    { id: 'sk-1', label: 'Design', items: ['Figma', 'Prototyping', 'Design Systems', 'User Research'] },
    { id: 'sk-2', label: 'Tools', items: ['React basics', 'HTML/CSS', 'Notion', 'Linear'] },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Compass',
      link: 'compass.alexrivera.design',
      description: 'A side project reimagining habit tracking with a map-based interface. 4k+ downloads.',
    },
  ],
  languages: [
    { id: 'lang-1', name: 'English', level: 'Native' },
    { id: 'lang-2', name: 'Spanish', level: 'Fluent' },
  ],
}

export const EMPTY_CV: CVData = {
  personal: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    summary: '',
    photo: null,
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  languages: [],
}

let counter = 0
export function newId(prefix: string): string {
  counter += 1
  return `${prefix}-${Date.now()}-${counter}`
}
