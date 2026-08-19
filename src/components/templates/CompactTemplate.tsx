import { formatRange } from '../../lib/format'
import { useLocale } from '../../i18n/LocaleContext'
import type { TemplateProps } from './shared'

export function CompactTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, languages } = data
  const { t } = useLocale()
  return (
    <div className="cv-page bg-white px-10 py-8 text-neutral-900" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <header className="mb-3 border-b border-neutral-900 pb-2">
        <div className="flex items-baseline justify-between">
          <h1 className="text-xl font-bold">{personal.fullName || 'Your Name'}</h1>
          {personal.title && <p className="text-xs text-neutral-600">{personal.title}</p>}
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 text-[11px] text-neutral-600">
          {[personal.email, personal.phone, personal.location, personal.website].filter(Boolean).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </header>

      {personal.summary && <p className="mb-3 text-[11px] leading-snug text-neutral-700">{personal.summary}</p>}

      {experience.length > 0 && (
        <Section title={t.experienceSection}>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-2">
              <div className="flex items-baseline justify-between">
                <h3 className="text-[12px] font-bold">
                  {exp.role} — {exp.company}
                </h3>
                <span className="text-[10px] text-neutral-500">{formatRange(exp.start, exp.end, exp.current, t.present)}</span>
              </div>
              <ul className="mt-0.5">
                {exp.bullets.filter(Boolean).map((b, i) => (
                  <li key={i} className="text-[11px] leading-snug text-neutral-700">
                    - {b}
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
            <div key={edu.id} className="mb-1 flex items-baseline justify-between">
              <h3 className="text-[12px] font-bold">
                {edu.school} — {edu.degree}
              </h3>
              <span className="text-[10px] text-neutral-500">{formatRange(edu.start, edu.end, false, t.present)}</span>
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title={t.skillsSection}>
          <p className="text-[11px] leading-snug text-neutral-700">
            {skills.map((g) => `${g.label}: ${g.items.join(', ')}`).join('  |  ')}
          </p>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title={t.projectsSection}>
          {projects.map((p) => (
            <p key={p.id} className="mb-0.5 text-[11px] leading-snug text-neutral-700">
              <span className="font-bold">{p.name}: </span>
              {p.description}
            </p>
          ))}
        </Section>
      )}

      {languages.length > 0 && (
        <Section title={t.languagesSection}>
          <p className="text-[11px] text-neutral-700">{languages.map((l) => `${l.name} (${l.level})`).join(', ')}</p>
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-2.5">
      <h2 className="mb-1 text-[11px] font-bold uppercase tracking-wide text-neutral-500">{title}</h2>
      {children}
    </section>
  )
}
