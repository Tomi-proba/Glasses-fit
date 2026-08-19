import { formatRange } from '../../lib/format'
import type { TemplateProps } from './shared'

const ACCENT = '#a16207'

export function ElegantTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, languages } = data
  return (
    <div
      className="cv-page px-16 py-14 text-neutral-800"
      style={{ backgroundColor: '#faf6ef', fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      <header className="mb-8 text-center">
        <h1 className="text-4xl tracking-wide" style={{ color: '#292524' }}>
          {personal.fullName || 'Your Name'}
        </h1>
        {personal.title && (
          <p className="mt-2 text-sm uppercase tracking-[0.25em]" style={{ color: ACCENT }}>
            {personal.title}
          </p>
        )}
        <div className="mx-auto mt-4 h-px w-24" style={{ backgroundColor: ACCENT }} />
        <div className="mt-4 flex flex-wrap justify-center gap-x-4 text-xs text-neutral-500">
          {[personal.email, personal.phone, personal.location, personal.website].filter(Boolean).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </header>

      {personal.summary && <p className="mb-8 text-center text-sm leading-relaxed text-neutral-700">{personal.summary}</p>}

      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((exp) => (
            <div key={exp.id} className="mb-5">
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-semibold italic">{exp.role}</h3>
                <span className="text-xs text-neutral-500">{formatRange(exp.start, exp.end, exp.current)}</span>
              </div>
              <p className="text-xs" style={{ color: ACCENT }}>
                {exp.company}
              </p>
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

      {education.length > 0 && (
        <Section title="Education">
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-semibold italic">{edu.school}</h3>
                <span className="text-xs text-neutral-500">{formatRange(edu.start, edu.end)}</span>
              </div>
              <p className="text-xs" style={{ color: ACCENT }}>
                {edu.degree}
              </p>
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

      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p) => (
            <div key={p.id} className="mb-2">
              <h3 className="text-sm font-semibold italic">{p.name}</h3>
              <p className="text-sm text-neutral-700">{p.description}</p>
            </div>
          ))}
        </Section>
      )}

      {languages.length > 0 && (
        <Section title="Languages">
          <p className="text-sm text-neutral-700">{languages.map((l) => `${l.name} (${l.level})`).join('  ·  ')}</p>
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <h2 className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: ACCENT }}>
        {title}
      </h2>
      {children}
    </section>
  )
}
