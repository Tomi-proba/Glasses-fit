import { formatRange } from '../../lib/format'
import { useLocale } from '../../i18n/LocaleContext'
import type { TemplateProps } from './shared'

export function AcademicTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, languages } = data
  const { t } = useLocale()
  return (
    <div className="cv-page bg-white px-16 py-14 text-neutral-900" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold">{personal.fullName || 'Your Name'}</h1>
        {personal.title && <p className="mt-1 text-sm text-neutral-600">{personal.title}</p>}
        <p className="mt-2 text-xs text-neutral-500">
          {[personal.email, personal.phone, personal.location, personal.website].filter(Boolean).join(' · ')}
        </p>
      </header>

      {personal.summary && (
        <Section title={t.researchInterestsSection}>
          <p className="text-sm leading-relaxed text-neutral-800">{personal.summary}</p>
        </Section>
      )}

      {education.length > 0 && (
        <Section title={t.educationSection}>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-bold">{edu.degree}</h3>
                <span className="text-xs text-neutral-500">{formatRange(edu.start, edu.end, false, t.present)}</span>
              </div>
              <p className="text-sm text-neutral-700">
                {edu.school}
                {edu.location ? `, ${edu.location}` : ''}
              </p>
              {edu.details && <p className="mt-0.5 text-sm text-neutral-700">{edu.details}</p>}
            </div>
          ))}
        </Section>
      )}

      {experience.length > 0 && (
        <Section title={t.academicExperienceSection}>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-bold">
                  {exp.role}, {exp.company}
                </h3>
                <span className="text-xs text-neutral-500">{formatRange(exp.start, exp.end, exp.current, t.present)}</span>
              </div>
              <ul className="mt-1 list-disc space-y-0.5 pl-5">
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
        <Section title={t.publicationsProjectsSection}>
          <ol className="list-decimal space-y-2 pl-5">
            {projects.map((p) => (
              <li key={p.id} className="text-sm leading-relaxed text-neutral-800">
                <span className="font-semibold">{p.name}.</span> {p.description}
                {p.link && <span className="text-neutral-500"> ({p.link})</span>}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {skills.length > 0 && (
        <Section title={t.skillsCompetenciesSection}>
          {skills.map((g) => (
            <p key={g.id} className="mb-1 text-sm text-neutral-800">
              <span className="font-semibold">{g.label}: </span>
              {g.items.join(', ')}
            </p>
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
    <section className="mb-6">
      <h2 className="mb-2 border-b border-neutral-400 pb-0.5 text-sm font-bold uppercase tracking-wide">{title}</h2>
      {children}
    </section>
  )
}
