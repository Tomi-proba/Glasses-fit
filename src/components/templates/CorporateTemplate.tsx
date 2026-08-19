import { formatRange } from '../../lib/format'
import type { TemplateProps } from './shared'

const ACCENT = '#1e40af'

export function CorporateTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, languages } = data
  return (
    <div className="cv-page bg-white text-neutral-900" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div className="h-2 w-full" style={{ backgroundColor: ACCENT }} />
      <div className="px-14 py-10">
        <header className="mb-8 border-b border-neutral-200 pb-6">
          <h1 className="text-3xl font-bold" style={{ color: ACCENT }}>
            {personal.fullName || 'Your Name'}
          </h1>
          {personal.title && <p className="mt-1 text-sm font-medium text-neutral-600">{personal.title}</p>}
          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-neutral-500">
            {[personal.email, personal.phone, personal.location, personal.website].filter(Boolean).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </header>

        {personal.summary && (
          <section className="mb-8">
            <SectionTitle>Profile</SectionTitle>
            <p className="text-sm leading-relaxed text-neutral-700">{personal.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-8">
            <SectionTitle>Experience</SectionTitle>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-5 grid grid-cols-4 gap-4">
                <div className="col-span-1 text-xs font-medium text-neutral-400">{formatRange(exp.start, exp.end, exp.current)}</div>
                <div className="col-span-3">
                  <h3 className="text-sm font-bold">{exp.role}</h3>
                  <p className="text-xs text-neutral-500">
                    {exp.company}
                    {exp.location ? `, ${exp.location}` : ''}
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="text-sm leading-relaxed text-neutral-700">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="mb-8">
            <SectionTitle>Education</SectionTitle>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3 grid grid-cols-4 gap-4">
                <div className="col-span-1 text-xs font-medium text-neutral-400">{formatRange(edu.start, edu.end)}</div>
                <div className="col-span-3">
                  <h3 className="text-sm font-bold">{edu.school}</h3>
                  <p className="text-xs text-neutral-500">{edu.degree}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        <div className="grid grid-cols-2 gap-8">
          {skills.length > 0 && (
            <section>
              <SectionTitle>Skills</SectionTitle>
              {skills.map((g) => (
                <p key={g.id} className="mb-1 text-sm text-neutral-700">
                  <span className="font-semibold">{g.label}: </span>
                  {g.items.join(', ')}
                </p>
              ))}
            </section>
          )}
          {languages.length > 0 && (
            <section>
              <SectionTitle>Languages</SectionTitle>
              {languages.map((l) => (
                <p key={l.id} className="text-sm text-neutral-700">
                  {l.name} — {l.level}
                </p>
              ))}
            </section>
          )}
        </div>

        {projects.length > 0 && (
          <section className="mt-8">
            <SectionTitle>Projects</SectionTitle>
            {projects.map((p) => (
              <div key={p.id} className="mb-3">
                <h3 className="text-sm font-bold">{p.name}</h3>
                <p className="text-sm text-neutral-700">{p.description}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: ACCENT }}>
      {children}
    </h2>
  )
}
