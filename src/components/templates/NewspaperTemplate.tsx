import { formatRange } from '../../lib/format'
import type { TemplateProps } from './shared'

export function NewspaperTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, languages } = data
  return (
    <div className="cv-page bg-white px-14 py-10 text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <header className="border-b-4 border-double border-neutral-900 pb-3 text-center">
        <h1 className="text-5xl font-black tracking-tight">{(personal.fullName || 'Your Name').toUpperCase()}</h1>
        {personal.title && <p className="mt-1 text-sm italic text-neutral-600">{personal.title}</p>}
      </header>
      <div className="mt-2 flex justify-center gap-x-4 border-b border-neutral-400 pb-2 text-[11px] uppercase tracking-wide text-neutral-500">
        {[personal.email, personal.phone, personal.location, personal.website].filter(Boolean).join(' • ')}
      </div>

      {personal.summary && (
        <p className="mt-4 border-b border-neutral-300 pb-4 text-sm italic leading-relaxed text-neutral-700">{personal.summary}</p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-6 border-r border-neutral-300 pr-8">
          {experience.length > 0 && (
            <Section title="Experience">
              {experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-sm font-bold">{exp.role}</h3>
                    <span className="text-xs text-neutral-500">{formatRange(exp.start, exp.end, exp.current)}</span>
                  </div>
                  <p className="text-xs italic text-neutral-500">{exp.company}</p>
                  <ul className="mt-1 space-y-1">
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
                <div key={p.id} className="mb-2">
                  <h3 className="text-sm font-bold">{p.name}</h3>
                  <p className="text-sm text-neutral-700">{p.description}</p>
                </div>
              ))}
            </Section>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {education.length > 0 && (
            <Section title="Education">
              {education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <h3 className="text-sm font-bold">{edu.school}</h3>
                  <p className="text-xs italic text-neutral-500">{edu.degree}</p>
                  <p className="text-xs text-neutral-400">{formatRange(edu.start, edu.end)}</p>
                </div>
              ))}
            </Section>
          )}

          {skills.length > 0 && (
            <Section title="Skills">
              {skills.map((g) => (
                <p key={g.id} className="mb-1 text-sm text-neutral-700">
                  <span className="font-bold">{g.label}: </span>
                  {g.items.join(', ')}
                </p>
              ))}
            </Section>
          )}

          {languages.length > 0 && (
            <Section title="Languages">
              <p className="text-sm text-neutral-700">{languages.map((l) => `${l.name} (${l.level})`).join(', ')}</p>
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
      <h2 className="mb-2 border-b-2 border-neutral-900 pb-0.5 text-xs font-bold uppercase tracking-[0.15em]">{title}</h2>
      {children}
    </section>
  )
}
