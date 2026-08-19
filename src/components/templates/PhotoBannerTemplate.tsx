import { formatRange } from '../../lib/format'
import type { TemplateProps } from './shared'

const ACCENT = '#7c3aed'

export function PhotoBannerTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, languages } = data
  return (
    <div className="cv-page bg-white text-neutral-900" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <header className="relative flex items-end gap-6 px-14 pb-8 pt-14 text-white" style={{ backgroundColor: ACCENT, minHeight: 220 }}>
        {personal.photo ? (
          <img src={personal.photo} alt="" className="h-32 w-32 shrink-0 rounded-2xl object-cover ring-4 ring-white/30" />
        ) : (
          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-4xl ring-4 ring-white/30">
            🙂
          </div>
        )}
        <div className="pb-1">
          <h1 className="text-4xl font-bold leading-none">{personal.fullName || 'Your Name'}</h1>
          {personal.title && <p className="mt-2 text-lg text-violet-100">{personal.title}</p>}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-violet-100">
            {[personal.email, personal.phone, personal.location, personal.website].filter(Boolean).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </header>

      <div className="px-14 py-10">
        {personal.summary && <p className="mb-8 text-sm leading-relaxed text-neutral-700">{personal.summary}</p>}

        {experience.length > 0 && (
          <Section title="Experience">
            {experience.map((exp) => (
              <div key={exp.id} className="mb-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-bold">{exp.role}</h3>
                  <span className="text-xs font-medium" style={{ color: ACCENT }}>
                    {formatRange(exp.start, exp.end, exp.current)}
                  </span>
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

        <div className="grid grid-cols-2 gap-8">
          {education.length > 0 && (
            <Section title="Education">
              {education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <h3 className="text-sm font-bold">{edu.school}</h3>
                  <p className="text-xs text-neutral-500">{edu.degree}</p>
                  <p className="text-xs text-neutral-400">{formatRange(edu.start, edu.end)}</p>
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
        </div>

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

        {languages.length > 0 && (
          <Section title="Languages">
            <p className="text-sm text-neutral-700">{languages.map((l) => `${l.name} (${l.level})`).join('  ·  ')}</p>
          </Section>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: ACCENT }}>
        {title}
      </h2>
      {children}
    </section>
  )
}
