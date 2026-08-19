import { formatRange } from '../../lib/format'
import { useLocale } from '../../i18n/LocaleContext'
import type { TemplateProps } from './shared'

const ACCENT = '#0d9488'

export function TimelineTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, languages } = data
  const { t } = useLocale()
  return (
    <div className="cv-page bg-white px-14 py-12 text-neutral-900" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <header className="mb-8 flex items-center gap-5">
        {personal.photo && <img src={personal.photo} alt="" className="h-20 w-20 rounded-2xl object-cover" />}
        <div>
          <h1 className="text-3xl font-bold">{personal.fullName || 'Your Name'}</h1>
          {personal.title && (
            <p className="mt-0.5 text-sm font-medium" style={{ color: ACCENT }}>
              {personal.title}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-x-3 text-xs text-neutral-500">
            {[personal.email, personal.phone, personal.location, personal.website].filter(Boolean).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </header>

      {personal.summary && <p className="mb-8 text-sm leading-relaxed text-neutral-700">{personal.summary}</p>}

      {experience.length > 0 && (
        <Section title={t.experienceSection}>
          <div className="relative border-l-2 pl-6" style={{ borderColor: ACCENT + '40' }}>
            {experience.map((exp) => (
              <div key={exp.id} className="relative mb-6">
                <span
                  className="absolute -left-[29px] top-1 h-3 w-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: ACCENT }}
                />
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-bold">{exp.role}</h3>
                  <span className="text-xs text-neutral-400">{formatRange(exp.start, exp.end, exp.current, t.present)}</span>
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
          </div>
        </Section>
      )}

      {education.length > 0 && (
        <Section title={t.educationSection}>
          <div className="relative border-l-2 pl-6" style={{ borderColor: ACCENT + '40' }}>
            {education.map((edu) => (
              <div key={edu.id} className="relative mb-4">
                <span
                  className="absolute -left-[29px] top-1 h-3 w-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: ACCENT }}
                />
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-bold">{edu.school}</h3>
                  <span className="text-xs text-neutral-400">{formatRange(edu.start, edu.end, false, t.present)}</span>
                </div>
                <p className="text-xs text-neutral-500">{edu.degree}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {skills.length > 0 && (
          <Section title={t.skillsSection}>
            {skills.map((g) => (
              <p key={g.id} className="mb-1 text-sm text-neutral-700">
                <span className="font-semibold">{g.label}: </span>
                {g.items.join(', ')}
              </p>
            ))}
          </Section>
        )}

        {languages.length > 0 && (
          <Section title={t.languagesSection}>
            {languages.map((l) => (
              <p key={l.id} className="text-sm text-neutral-700">
                {l.name} — {l.level}
              </p>
            ))}
          </Section>
        )}
      </div>

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
