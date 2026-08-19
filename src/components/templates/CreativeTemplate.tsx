import { formatRange } from '../../lib/format'
import { useLocale } from '../../i18n/LocaleContext'
import type { TemplateProps } from './shared'

export function CreativeTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, languages } = data
  const { t } = useLocale()
  return (
    <div className="cv-page bg-white text-neutral-900" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <header className="px-14 py-10 text-white" style={{ backgroundColor: '#e11d48' }}>
        <h1 className="text-4xl font-black leading-none">{personal.fullName || 'Your Name'}</h1>
        {personal.title && <p className="mt-2 text-lg font-medium text-rose-100">{personal.title}</p>}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-rose-100">
          {[personal.email, personal.phone, personal.location, personal.website].filter(Boolean).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8 px-14 py-10">
        <div className="col-span-2">
          {personal.summary && <p className="mb-8 text-sm leading-relaxed text-neutral-700">{personal.summary}</p>}

          {experience.length > 0 && (
            <Section title={t.experienceSection}>
              {experience.map((exp) => (
                <div key={exp.id} className="mb-6">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-sm font-bold">{exp.role}</h3>
                    <span className="text-xs font-medium text-rose-500">{formatRange(exp.start, exp.end, exp.current, t.present)}</span>
                  </div>
                  <p className="text-xs text-neutral-500">{exp.company}</p>
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

          {projects.length > 0 && (
            <Section title={t.projectsSection}>
              {projects.map((p) => (
                <div key={p.id} className="mb-3">
                  <h3 className="text-sm font-bold">{p.name}</h3>
                  <p className="text-sm text-neutral-700">{p.description}</p>
                </div>
              ))}
            </Section>
          )}
        </div>

        <div className="col-span-1">
          {skills.length > 0 && (
            <Section title={t.skillsSection}>
              <div className="flex flex-col gap-3">
                {skills.map((g) => (
                  <div key={g.id}>
                    <p className="mb-1 text-xs font-bold text-neutral-900">{g.label}</p>
                    <div className="flex flex-wrap gap-1">
                      {g.items.map((item) => (
                        <span key={item} className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: '#e11d48' }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {education.length > 0 && (
            <Section title={t.educationSection}>
              {education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <h3 className="text-sm font-bold">{edu.school}</h3>
                  <p className="text-xs text-neutral-500">{edu.degree}</p>
                  <p className="text-xs text-neutral-400">{formatRange(edu.start, edu.end, false, t.present)}</p>
                </div>
              ))}
            </Section>
          )}

          {languages.length > 0 && (
            <Section title={t.languagesSection}>
              {languages.map((l) => (
                <p key={l.id} className="text-sm text-neutral-700">
                  {l.name} <span className="text-neutral-400">· {l.level}</span>
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
    <section className="mb-7">
      <h2 className="mb-3 inline-block border-b-2 pb-1 text-xs font-bold uppercase tracking-wider" style={{ borderColor: '#e11d48', color: '#e11d48' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}
