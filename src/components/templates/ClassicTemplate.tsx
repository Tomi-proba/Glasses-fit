import { formatRange } from '../../lib/format'
import { useLocale } from '../../i18n/LocaleContext'
import type { TemplateProps } from './shared'

export function ClassicTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, languages } = data
  const { t } = useLocale()
  return (
    <div className="cv-page bg-white px-16 py-14 text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <header className="mb-6 border-b-2 border-neutral-800 pb-4 text-center">
        <h1 className="text-3xl font-bold tracking-wide">{(personal.fullName || 'Your Name').toUpperCase()}</h1>
        {personal.title && <p className="mt-1 italic text-neutral-600">{personal.title}</p>}
        <div className="mt-2 flex flex-wrap justify-center gap-x-3 text-xs text-neutral-600">
          {[personal.email, personal.phone, personal.location, personal.website].filter(Boolean).join(' | ')}
        </div>
      </header>

      {personal.summary && <p className="mb-6 text-sm leading-relaxed text-neutral-800">{personal.summary}</p>}

      {experience.length > 0 && (
        <Section title={t.professionalExperienceSection}>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-5">
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-bold">
                  {exp.role}, {exp.company}
                </h3>
                <span className="text-xs italic text-neutral-600">{formatRange(exp.start, exp.end, exp.current, t.present)}</span>
              </div>
              {exp.location && <p className="text-xs text-neutral-500">{exp.location}</p>}
              <ul className="mt-1.5 list-disc space-y-1 pl-5">
                {exp.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} className="text-sm leading-relaxed text-neutral-800">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title={t.educationSection}>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-bold">{edu.school}</h3>
                <span className="text-xs italic text-neutral-600">{formatRange(edu.start, edu.end, false, t.present)}</span>
              </div>
              <p className="text-sm text-neutral-700">{edu.degree}</p>
              {edu.details && <p className="mt-0.5 text-sm text-neutral-700">{edu.details}</p>}
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title={t.skillsSection}>
          {skills.map((g) => (
            <p key={g.id} className="mb-1 text-sm text-neutral-800">
              <span className="font-bold">{g.label}: </span>
              {g.items.join(', ')}
            </p>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title={t.projectsSection}>
          {projects.map((p) => (
            <div key={p.id} className="mb-2">
              <h3 className="text-sm font-bold">{p.name}</h3>
              <p className="text-sm text-neutral-800">{p.description}</p>
            </div>
          ))}
        </Section>
      )}

      {languages.length > 0 && (
        <Section title={t.languagesSection}>
          <p className="text-sm text-neutral-800">{languages.map((l) => `${l.name} (${l.level})`).join(', ')}</p>
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h2 className="mb-2 border-b border-neutral-300 pb-1 text-sm font-bold uppercase tracking-wide">{title}</h2>
      {children}
    </section>
  )
}
