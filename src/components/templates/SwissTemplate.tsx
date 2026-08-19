import { formatRange } from '../../lib/format'
import { useLocale } from '../../i18n/LocaleContext'
import type { TemplateProps } from './shared'

const RED = '#d90429'

export function SwissTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, languages } = data
  const { t } = useLocale()
  const visibleSections = [
    experience.length > 0 && 'experience',
    education.length > 0 && 'education',
    skills.length > 0 && 'skills',
    projects.length > 0 && 'projects',
    languages.length > 0 && 'languages',
  ].filter(Boolean) as string[]
  const numberOf = (key: string) => String(visibleSections.indexOf(key) + 1).padStart(2, '0')

  return (
    <div className="cv-page bg-white px-14 py-14 text-neutral-900" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <header className="mb-10">
        <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-tight">{personal.fullName || 'Your Name'}</h1>
        {personal.title && <p className="mt-3 text-base font-medium uppercase tracking-wide text-neutral-500">{personal.title}</p>}
        <div className="mt-5 h-2 w-full" style={{ backgroundColor: RED }} />
        <div className="mt-3 flex flex-wrap gap-x-6 text-xs uppercase tracking-wide text-neutral-500">
          {[personal.email, personal.phone, personal.location, personal.website].filter(Boolean).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </header>

      {personal.summary && <p className="mb-10 max-w-xl text-sm leading-relaxed text-neutral-700">{personal.summary}</p>}

      {experience.length > 0 && (
        <Section n={numberOf("experience")} title={t.experienceSection}>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-6 grid grid-cols-4 gap-4">
              <span className="col-span-1 text-xs font-bold uppercase text-neutral-400">{formatRange(exp.start, exp.end, exp.current, t.present)}</span>
              <div className="col-span-3">
                <h3 className="text-sm font-bold uppercase">{exp.role}</h3>
                <p className="text-xs" style={{ color: RED }}>
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
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section n={numberOf("education")} title={t.educationSection}>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3 grid grid-cols-4 gap-4">
              <span className="col-span-1 text-xs font-bold uppercase text-neutral-400">{formatRange(edu.start, edu.end, false, t.present)}</span>
              <div className="col-span-3">
                <h3 className="text-sm font-bold uppercase">{edu.school}</h3>
                <p className="text-xs text-neutral-500">{edu.degree}</p>
              </div>
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section n={numberOf("skills")} title={t.skillsSection}>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1" />
            <div className="col-span-3">
              {skills.map((g) => (
                <p key={g.id} className="mb-1 text-sm text-neutral-700">
                  <span className="font-bold uppercase">{g.label}: </span>
                  {g.items.join(', ')}
                </p>
              ))}
            </div>
          </div>
        </Section>
      )}

      {projects.length > 0 && (
        <Section n={numberOf("projects")} title={t.projectsSection}>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1" />
            <div className="col-span-3">
              {projects.map((p) => (
                <div key={p.id} className="mb-2">
                  <h3 className="text-sm font-bold uppercase">{p.name}</h3>
                  <p className="text-sm text-neutral-700">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {languages.length > 0 && (
        <Section n={numberOf("languages")} title={t.languagesSection}>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1" />
            <p className="col-span-3 text-sm text-neutral-700">{languages.map((l) => `${l.name} — ${l.level}`).join('   ')}</p>
          </div>
        </Section>
      )}
    </div>
  )
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 flex items-baseline gap-2 text-xs font-bold uppercase tracking-[0.15em]">
        <span style={{ color: RED }}>{n}</span>
        {title}
      </h2>
      {children}
    </section>
  )
}
