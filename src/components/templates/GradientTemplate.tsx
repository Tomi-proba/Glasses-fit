import { formatRange } from '../../lib/format'
import type { TemplateProps } from './shared'

export function GradientTemplate({ data }: TemplateProps) {
  const { personal, experience, education, skills, projects, languages } = data
  return (
    <div className="cv-page text-neutral-900" style={{ backgroundColor: '#f5f3ff', fontFamily: 'system-ui, sans-serif' }}>
      <header
        className="px-14 py-12 text-white"
        style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 55%, #2563eb 100%)' }}
      >
        <div className="flex items-center gap-5">
          {personal.photo && (
            <img src={personal.photo} alt="" className="h-20 w-20 rounded-full object-cover ring-4 ring-white/40" />
          )}
          <div>
            <h1 className="text-3xl font-bold">{personal.fullName || 'Your Name'}</h1>
            {personal.title && <p className="mt-1 text-sm text-violet-100">{personal.title}</p>}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-violet-100">
          {[personal.email, personal.phone, personal.location, personal.website].filter(Boolean).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </header>

      <div className="flex flex-col gap-4 px-10 py-8">
        {personal.summary && (
          <Card>
            <p className="text-sm leading-relaxed text-neutral-700">{personal.summary}</p>
          </Card>
        )}

        {experience.length > 0 && (
          <Card title="Experience">
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4 last:mb-0">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-bold">{exp.role}</h3>
                  <span className="text-xs font-medium text-violet-600">{formatRange(exp.start, exp.end, exp.current)}</span>
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
          </Card>
        )}

        <div className="grid grid-cols-2 gap-4">
          {education.length > 0 && (
            <Card title="Education">
              {education.map((edu) => (
                <div key={edu.id} className="mb-2 last:mb-0">
                  <h3 className="text-sm font-bold">{edu.school}</h3>
                  <p className="text-xs text-neutral-500">{edu.degree}</p>
                  <p className="text-xs text-neutral-400">{formatRange(edu.start, edu.end)}</p>
                </div>
              ))}
            </Card>
          )}

          {skills.length > 0 && (
            <Card title="Skills">
              {skills.map((g) => (
                <div key={g.id} className="mb-2 last:mb-0">
                  <p className="mb-1 text-xs font-bold text-neutral-800">{g.label}</p>
                  <div className="flex flex-wrap gap-1">
                    {g.items.map((item) => (
                      <span key={item} className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>

        {projects.length > 0 && (
          <Card title="Projects">
            {projects.map((p) => (
              <div key={p.id} className="mb-2 last:mb-0">
                <h3 className="text-sm font-bold">{p.name}</h3>
                <p className="text-sm text-neutral-700">{p.description}</p>
              </div>
            ))}
          </Card>
        )}

        {languages.length > 0 && (
          <Card title="Languages">
            <p className="text-sm text-neutral-700">{languages.map((l) => `${l.name} (${l.level})`).join('  ·  ')}</p>
          </Card>
        )}
      </div>
    </div>
  )
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      {title && <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-violet-600">{title}</h2>}
      {children}
    </div>
  )
}
