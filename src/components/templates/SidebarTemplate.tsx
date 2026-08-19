import { formatRange } from '../../lib/format'
import type { TemplateProps } from './shared'

export function SidebarTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, languages } = data
  return (
    <div className="cv-page flex bg-white text-neutral-900" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <aside className="w-[34%] shrink-0 px-8 py-12 text-white" style={{ backgroundColor: '#1e3a5f' }}>
        {personal.photo && (
          <img src={personal.photo} alt="" className="mb-6 h-28 w-28 rounded-full object-cover ring-4 ring-white/20" />
        )}
        <h1 className="text-2xl font-bold leading-tight">{personal.fullName || 'Your Name'}</h1>
        {personal.title && <p className="mt-1 text-sm text-blue-200">{personal.title}</p>}

        <div className="mt-8">
          <SideHeading>Contact</SideHeading>
          <div className="flex flex-col gap-1.5 text-xs text-blue-100">
            {[personal.email, personal.phone, personal.location, personal.website].filter(Boolean).map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="mt-8">
            <SideHeading>Skills</SideHeading>
            <div className="flex flex-col gap-3">
              {skills.map((g) => (
                <div key={g.id}>
                  <p className="text-xs font-semibold text-blue-200">{g.label}</p>
                  <p className="text-xs text-blue-100">{g.items.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {languages.length > 0 && (
          <div className="mt-8">
            <SideHeading>Languages</SideHeading>
            <div className="flex flex-col gap-1">
              {languages.map((l) => (
                <p key={l.id} className="text-xs text-blue-100">
                  {l.name} — {l.level}
                </p>
              ))}
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 px-10 py-12">
        {personal.summary && <p className="mb-8 text-sm leading-relaxed text-neutral-700">{personal.summary}</p>}

        {experience.length > 0 && (
          <Section title="Experience">
            {experience.map((exp) => (
              <div key={exp.id} className="mb-5">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold">{exp.role}</h3>
                  <span className="text-xs text-neutral-400">{formatRange(exp.start, exp.end, exp.current)}</span>
                </div>
                <p className="text-xs text-neutral-500">{exp.company}</p>
                <ul className="mt-1.5 space-y-1">
                  {exp.bullets.filter(Boolean).map((b, i) => (
                    <li key={i} className="text-sm leading-relaxed text-neutral-700">
                      • {b}
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
                  <h3 className="text-sm font-semibold">{edu.school}</h3>
                  <span className="text-xs text-neutral-400">{formatRange(edu.start, edu.end)}</span>
                </div>
                <p className="text-xs text-neutral-500">{edu.degree}</p>
              </div>
            ))}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects">
            {projects.map((p) => (
              <div key={p.id} className="mb-3">
                <h3 className="text-sm font-semibold">{p.name}</h3>
                <p className="text-sm text-neutral-700">{p.description}</p>
              </div>
            ))}
          </Section>
        )}
      </main>
    </div>
  )
}

function SideHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-white">{children}</h2>
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <h2 className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: '#1e3a5f' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}
