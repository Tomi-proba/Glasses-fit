import { formatRange } from '../../lib/format'
import type { TemplateProps } from './shared'

const ACCENT = '#0f766e'

export function GridTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, languages } = data
  return (
    <div className="cv-page bg-white px-14 py-12 text-neutral-900" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <header className="mb-8 border-b-4 pb-4" style={{ borderColor: ACCENT }}>
        <h1 className="text-3xl font-bold">{personal.fullName || 'Your Name'}</h1>
        {personal.title && (
          <p className="mt-1 text-sm font-medium" style={{ color: ACCENT }}>
            {personal.title}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-x-4 text-xs text-neutral-500">
          {[personal.email, personal.phone, personal.location, personal.website].filter(Boolean).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </header>

      {personal.summary && <p className="mb-8 text-sm leading-relaxed text-neutral-700">{personal.summary}</p>}

      <div className="grid grid-cols-2 gap-x-10">
        <div className="flex flex-col gap-7 border-r border-neutral-200 pr-10">
          {experience.length > 0 && (
            <Section title="Experience">
              {experience.map((exp) => (
                <div key={exp.id} className="mb-5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-sm font-bold">{exp.role}</h3>
                    <span className="text-xs text-neutral-400">{formatRange(exp.start, exp.end, exp.current)}</span>
                  </div>
                  <p className="text-xs text-neutral-500">{exp.company}</p>
                  <ul className="mt-1.5 space-y-1">
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <li key={i} className="text-sm leading-relaxed text-neutral-700">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </Section>
          )}

          {projects.length > 0 && (
            <Section title="Projects">
              {projects.map((p) => (
                <div key={p.id} className="mb-3">
                  <h3 className="text-sm font-bold">{p.name}</h3>
                  <p className="text-sm text-neutral-700">{p.description}</p>
                </div>
              ))}
            </Section>
          )}
        </div>

        <div className="flex flex-col gap-7">
          {education.length > 0 && (
            <Section title="Education">
              {education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-sm font-bold">{edu.school}</h3>
                    <span className="text-xs text-neutral-400">{formatRange(edu.start, edu.end)}</span>
                  </div>
                  <p className="text-xs text-neutral-500">{edu.degree}</p>
                </div>
              ))}
            </Section>
          )}

          {skills.length > 0 && (
            <Section title="Skills">
              {skills.map((g) => (
                <p key={g.id} className="mb-1 text-sm text-neutral-700">
                  <span className="font-semibold">{g.label}: </span>
                  {g.items.join(', ')}
                </p>
              ))}
            </Section>
          )}

          {languages.length > 0 && (
            <Section title="Languages">
              {languages.map((l) => (
                <p key={l.id} className="text-sm text-neutral-700">
                  {l.name} — {l.level}
                </p>
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
        {title}
      </h2>
      {children}
    </section>
  )
}
