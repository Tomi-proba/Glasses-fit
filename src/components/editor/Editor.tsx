import type { CVData, Education, Experience, Language, Project, SkillGroup } from '../../types'
import { newId } from '../../data/sampleData'
import { FormField, FormTextArea, IconButton, SectionCard } from './FormField'

interface Props {
  data: CVData
  onChange: (data: CVData) => void
}

export function Editor({ data, onChange }: Props) {
  function updatePersonal(patch: Partial<CVData['personal']>) {
    onChange({ ...data, personal: { ...data.personal, ...patch } })
  }

  function handlePhoto(file: File | null) {
    if (!file) {
      updatePersonal({ photo: null })
      return
    }
    const reader = new FileReader()
    reader.onload = () => updatePersonal({ photo: reader.result as string })
    reader.readAsDataURL(file)
  }

  // ---- Experience ----
  function addExperience() {
    const exp: Experience = {
      id: newId('exp'),
      role: '',
      company: '',
      location: '',
      start: '',
      end: '',
      current: false,
      bullets: [''],
    }
    onChange({ ...data, experience: [...data.experience, exp] })
  }
  function updateExperience(id: string, patch: Partial<Experience>) {
    onChange({ ...data, experience: data.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)) })
  }
  function removeExperience(id: string) {
    onChange({ ...data, experience: data.experience.filter((e) => e.id !== id) })
  }

  // ---- Education ----
  function addEducation() {
    const edu: Education = { id: newId('edu'), school: '', degree: '', location: '', start: '', end: '', details: '' }
    onChange({ ...data, education: [...data.education, edu] })
  }
  function updateEducation(id: string, patch: Partial<Education>) {
    onChange({ ...data, education: data.education.map((e) => (e.id === id ? { ...e, ...patch } : e)) })
  }
  function removeEducation(id: string) {
    onChange({ ...data, education: data.education.filter((e) => e.id !== id) })
  }

  // ---- Skills ----
  function addSkillGroup() {
    const group: SkillGroup = { id: newId('sk'), label: '', items: [] }
    onChange({ ...data, skills: [...data.skills, group] })
  }
  function updateSkillGroup(id: string, patch: Partial<SkillGroup>) {
    onChange({ ...data, skills: data.skills.map((s) => (s.id === id ? { ...s, ...patch } : s)) })
  }
  function removeSkillGroup(id: string) {
    onChange({ ...data, skills: data.skills.filter((s) => s.id !== id) })
  }

  // ---- Projects ----
  function addProject() {
    const p: Project = { id: newId('proj'), name: '', link: '', description: '' }
    onChange({ ...data, projects: [...data.projects, p] })
  }
  function updateProject(id: string, patch: Partial<Project>) {
    onChange({ ...data, projects: data.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) })
  }
  function removeProject(id: string) {
    onChange({ ...data, projects: data.projects.filter((p) => p.id !== id) })
  }

  // ---- Languages ----
  function addLanguage() {
    const l: Language = { id: newId('lang'), name: '', level: '' }
    onChange({ ...data, languages: [...data.languages, l] })
  }
  function updateLanguage(id: string, patch: Partial<Language>) {
    onChange({ ...data, languages: data.languages.map((l) => (l.id === id ? { ...l, ...patch } : l)) })
  }
  function removeLanguage(id: string) {
    onChange({ ...data, languages: data.languages.filter((l) => l.id !== id) })
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Personal">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
            {data.personal.photo ? (
              <img src={data.personal.photo} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl">🙂</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="cursor-pointer text-xs font-medium text-violet-600 hover:underline dark:text-violet-400">
              Upload photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handlePhoto(e.target.files?.[0] ?? null)}
              />
            </label>
            {data.personal.photo && (
              <IconButton label="Remove photo" onClick={() => updatePersonal({ photo: null })} variant="danger" />
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Full name" value={data.personal.fullName} onChange={(v) => updatePersonal({ fullName: v })} />
          <FormField label="Title" value={data.personal.title} onChange={(v) => updatePersonal({ title: v })} placeholder="Product Designer" />
          <FormField label="Email" value={data.personal.email} onChange={(v) => updatePersonal({ email: v })} />
          <FormField label="Phone" value={data.personal.phone} onChange={(v) => updatePersonal({ phone: v })} />
          <FormField label="Location" value={data.personal.location} onChange={(v) => updatePersonal({ location: v })} />
          <FormField label="Website" value={data.personal.website} onChange={(v) => updatePersonal({ website: v })} />
        </div>
        <FormTextArea label="Summary" value={data.personal.summary} onChange={(v) => updatePersonal({ summary: v })} rows={3} />
      </SectionCard>

      <SectionCard title="Experience" action={<IconButton label="+ Add" onClick={addExperience} />}>
        {data.experience.length === 0 && <EmptyHint text="No experience added yet." />}
        {data.experience.map((exp) => (
          <div key={exp.id} className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800">
            <div className="mb-2 flex justify-end">
              <IconButton label="Remove" variant="danger" onClick={() => removeExperience(exp.id)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Role" value={exp.role} onChange={(v) => updateExperience(exp.id, { role: v })} />
              <FormField label="Company" value={exp.company} onChange={(v) => updateExperience(exp.id, { company: v })} />
              <FormField label="Location" value={exp.location} onChange={(v) => updateExperience(exp.id, { location: v })} />
              <div className="grid grid-cols-2 gap-2">
                <FormField label="Start" value={exp.start} onChange={(v) => updateExperience(exp.id, { start: v })} placeholder="2022" />
                <FormField
                  label="End"
                  value={exp.end}
                  onChange={(v) => updateExperience(exp.id, { end: v })}
                  placeholder={exp.current ? 'Present' : '2024'}
                  disabled={exp.current}
                />
              </div>
            </div>
            <label className="mt-2 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
              />
              I currently work here
            </label>
            <FormTextArea
              className="mt-2"
              label="Highlights (one per line)"
              value={exp.bullets.join('\n')}
              onChange={(v) => updateExperience(exp.id, { bullets: v.split('\n') })}
              rows={4}
            />
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Education" action={<IconButton label="+ Add" onClick={addEducation} />}>
        {data.education.length === 0 && <EmptyHint text="No education added yet." />}
        {data.education.map((edu) => (
          <div key={edu.id} className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800">
            <div className="mb-2 flex justify-end">
              <IconButton label="Remove" variant="danger" onClick={() => removeEducation(edu.id)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="School" value={edu.school} onChange={(v) => updateEducation(edu.id, { school: v })} />
              <FormField label="Degree" value={edu.degree} onChange={(v) => updateEducation(edu.id, { degree: v })} />
              <FormField label="Location" value={edu.location} onChange={(v) => updateEducation(edu.id, { location: v })} />
              <div className="grid grid-cols-2 gap-2">
                <FormField label="Start" value={edu.start} onChange={(v) => updateEducation(edu.id, { start: v })} />
                <FormField label="End" value={edu.end} onChange={(v) => updateEducation(edu.id, { end: v })} />
              </div>
            </div>
            <FormTextArea
              className="mt-2"
              label="Details"
              value={edu.details}
              onChange={(v) => updateEducation(edu.id, { details: v })}
              rows={2}
            />
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Skills" action={<IconButton label="+ Add group" onClick={addSkillGroup} />}>
        {data.skills.length === 0 && <EmptyHint text="No skill groups added yet." />}
        {data.skills.map((group) => (
          <div key={group.id} className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800">
            <div className="mb-2 flex justify-end">
              <IconButton label="Remove" variant="danger" onClick={() => removeSkillGroup(group.id)} />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <FormField label="Group label" value={group.label} onChange={(v) => updateSkillGroup(group.id, { label: v })} placeholder="Design" />
              <FormField
                label="Skills (comma-separated)"
                value={group.items.join(', ')}
                onChange={(v) => updateSkillGroup(group.id, { items: v.split(',').map((s) => s.trim()).filter(Boolean) })}
                placeholder="Figma, Prototyping, User Research"
              />
            </div>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Projects" action={<IconButton label="+ Add" onClick={addProject} />}>
        {data.projects.length === 0 && <EmptyHint text="No projects added yet." />}
        {data.projects.map((p) => (
          <div key={p.id} className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800">
            <div className="mb-2 flex justify-end">
              <IconButton label="Remove" variant="danger" onClick={() => removeProject(p.id)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Name" value={p.name} onChange={(v) => updateProject(p.id, { name: v })} />
              <FormField label="Link" value={p.link} onChange={(v) => updateProject(p.id, { link: v })} />
            </div>
            <FormTextArea className="mt-2" label="Description" value={p.description} onChange={(v) => updateProject(p.id, { description: v })} rows={2} />
          </div>
        ))}
      </SectionCard>

      <SectionCard title="Languages" action={<IconButton label="+ Add" onClick={addLanguage} />}>
        {data.languages.length === 0 && <EmptyHint text="No languages added yet." />}
        {data.languages.map((l) => (
          <div key={l.id} className="flex items-end gap-2">
            <FormField className="flex-1" label="Language" value={l.name} onChange={(v) => updateLanguage(l.id, { name: v })} />
            <FormField className="flex-1" label="Level" value={l.level} onChange={(v) => updateLanguage(l.id, { level: v })} placeholder="Fluent" />
            <IconButton label="Remove" variant="danger" onClick={() => removeLanguage(l.id)} />
          </div>
        ))}
      </SectionCard>
    </div>
  )
}

function EmptyHint({ text }: { text: string }) {
  return <p className="text-sm text-neutral-400">{text}</p>
}
