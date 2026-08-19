import { formatRange } from '../../lib/format'
import type { TemplateProps } from './shared'

export function MinimalTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, languages } = data
  return (
    <div className="cv-page bg-white px-16 py-14 text-neutral-900" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <header className="mb-10">
        <h1 className="text-4xl font-light tracking-tight">{personal.fullName || 'Your Name'}</h1>
        {personal.title && <p className="mt-1 text-lg text-neutral-500">{personal.title}</p>}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
          {[personal.email, personal.phone, personal.location, personal.website].filter(Boolean).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </header>

      {personal.summary && <p className="mb-10 max-w-2xl text-sm leading-relaxed text-neutral-700">{personal.summary}</p>}

      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((exp) => (
            <div key={exp.id} className="mb-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-semibold">{exp.role}</h3>
                <span className="text-xs text-neutral-400">{formatRange(exp.start, exp.end, exp.current)}</span>
              </div>
              <p className="text-xs text-neutral-500">
                {exp.company}
                {exp.location ? ` · ${exp.location}` : ''}
              </p>
              <ul className="mt-2 space-y-1">
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
            <div key={edu.id} className="mb-4">
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-semibold">{edu.school}</h3>
                <span className="text-xs text-neutral-400">{formatRange(edu.start, edu.end)}</span>
              </div>
              <p className="text-xs text-neutral-500">{edu.degree}</p>
              {edu.details && <p className="mt-1 text-sm text-neutral-700">{edu.details}</p>}
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <div className="space-y-1">
            {skills.map((g) => (
              <p key={g.id} className="text-sm text-neutral-700">
                <span className="font-medium text-neutral-900">{g.label}: </span>
                {g.items.join(', ')}
              </p>
            ))}
          </div>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p) => (
            <div key={p.id} className="mb-3">
              <h3 className="text-sm font-semibold">
                {p.name}
                {p.link && <span className="ml-2 text-xs font-normal text-neutral-400">{p.link}</span>}
              </h3>
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
    <section className="mb-8">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">{title}</h2>
      {children}
    </section>
  )
}
