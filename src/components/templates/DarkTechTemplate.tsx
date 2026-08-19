import { formatRange } from '../../lib/format'
import { useLocale } from '../../i18n/LocaleContext'
import type { TemplateProps } from './shared'

const ACCENT = '#22d3ee'

export function DarkTechTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, languages } = data
  const { t } = useLocale()
  return (
    <div
      className="cv-page px-14 py-12 text-neutral-200"
      style={{ backgroundColor: '#0f172a', fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
    >
      <header className="mb-8">
        <p className="text-xs" style={{ color: ACCENT }}>
          $ whoami
        </p>
        <h1 className="mt-1 text-3xl font-bold text-white">{personal.fullName || 'your_name'}</h1>
        {personal.title && <p className="mt-1 text-sm text-neutral-400">{personal.title}</p>}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400">
          {[personal.email, personal.phone, personal.location, personal.website].filter(Boolean).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </header>

      {personal.summary && (
        <section className="mb-8">
          <Comment text="about.md" />
          <p className="text-sm leading-relaxed text-neutral-300">{personal.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-8">
          <Comment text="experience/" />
          {experience.map((exp) => (
            <div key={exp.id} className="mb-5 border-l-2 pl-4" style={{ borderColor: '#1e293b' }}>
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-bold text-white">{exp.role}</h3>
                <span className="text-xs" style={{ color: ACCENT }}>
                  {formatRange(exp.start, exp.end, exp.current, t.present)}
                </span>
              </div>
              <p className="text-xs text-neutral-500">{exp.company}</p>
              <ul className="mt-1.5 space-y-1">
                {exp.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} className="text-sm leading-relaxed text-neutral-300">
                    <span style={{ color: ACCENT }}>{'> '}</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="mb-8">
          <Comment text="skills.json" />
          <div className="flex flex-col gap-1.5">
            {skills.map((g) => (
              <p key={g.id} className="text-sm text-neutral-300">
                <span style={{ color: ACCENT }}>"{g.label}"</span>: [{g.items.map((s) => `"${s}"`).join(', ')}]
              </p>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-8">
          <Comment text="education/" />
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-bold text-white">{edu.school}</h3>
                <span className="text-xs" style={{ color: ACCENT }}>
                  {formatRange(edu.start, edu.end, false, t.present)}
                </span>
              </div>
              <p className="text-xs text-neutral-500">{edu.degree}</p>
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="mb-8">
          <Comment text="projects/" />
          {projects.map((p) => (
            <div key={p.id} className="mb-2">
              <h3 className="text-sm font-bold text-white">
                {p.name}
                {p.link && <span className="ml-2 text-xs font-normal text-neutral-500">{p.link}</span>}
              </h3>
              <p className="text-sm text-neutral-300">{p.description}</p>
            </div>
          ))}
        </section>
      )}

      {languages.length > 0 && (
        <section>
          <Comment text="languages.txt" />
          <p className="text-sm text-neutral-300">{languages.map((l) => `${l.name}: ${l.level}`).join('  |  ')}</p>
        </section>
      )}
    </div>
  )
}

function Comment({ text }: { text: string }) {
  return (
    <p className="mb-2 text-xs" style={{ color: '#64748b' }}>
      // {text}
    </p>
  )
}
