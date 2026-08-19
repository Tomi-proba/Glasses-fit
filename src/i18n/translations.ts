export type Locale = 'en' | 'hu' | 'fr' | 'zh' | 'es' | 'de'

export interface LocaleMeta {
  code: Locale
  nativeName: string
}

export const LOCALES: LocaleMeta[] = [
  { code: 'en', nativeName: 'English' },
  { code: 'hu', nativeName: 'Magyar' },
  { code: 'fr', nativeName: 'Français' },
  { code: 'zh', nativeName: '中文' },
  { code: 'es', nativeName: 'Español' },
  { code: 'de', nativeName: 'Deutsch' },
]

export interface Dict {
  appName: string
  stayInBrowser: string
  startBlank: string
  startBlankConfirm: string
  savePdf: string
  present: string

  personalSection: string
  experienceSection: string
  educationSection: string
  skillsSection: string
  projectsSection: string
  languagesSection: string
  profileSection: string
  contactSection: string
  professionalExperienceSection: string
  researchInterestsSection: string
  academicExperienceSection: string
  publicationsProjectsSection: string
  skillsCompetenciesSection: string

  uploadPhoto: string
  removePhoto: string
  fullName: string
  jobTitle: string
  email: string
  phone: string
  location: string
  website: string
  summary: string
  role: string
  company: string
  start: string
  end: string
  currentlyWorkHere: string
  highlights: string
  school: string
  degree: string
  details: string
  groupLabel: string
  skillsCommaSeparated: string
  projectName: string
  projectLink: string
  projectDescription: string
  languageName: string
  languageLevel: string
  addBtn: string
  addGroupBtn: string
  removeBtn: string
  noExperience: string
  noEducation: string
  noSkills: string
  noProjects: string
  noLanguages: string
}

const en: Dict = {
  appName: 'CV Builder',
  stayInBrowser: 'Everything stays in your browser',
  startBlank: 'Start blank',
  startBlankConfirm: 'Clear all your CV data and start from a blank template?',
  savePdf: 'Save as PDF',
  present: 'Present',

  personalSection: 'Personal',
  experienceSection: 'Experience',
  educationSection: 'Education',
  skillsSection: 'Skills',
  projectsSection: 'Projects',
  languagesSection: 'Languages',
  profileSection: 'Profile',
  contactSection: 'Contact',
  professionalExperienceSection: 'Professional Experience',
  researchInterestsSection: 'Research Interests',
  academicExperienceSection: 'Academic & Professional Experience',
  publicationsProjectsSection: 'Publications & Projects',
  skillsCompetenciesSection: 'Skills & Competencies',

  uploadPhoto: 'Upload photo',
  removePhoto: 'Remove photo',
  fullName: 'Full name',
  jobTitle: 'Title',
  email: 'Email',
  phone: 'Phone',
  location: 'Location',
  website: 'Website',
  summary: 'Summary',
  role: 'Role',
  company: 'Company',
  start: 'Start',
  end: 'End',
  currentlyWorkHere: 'I currently work here',
  highlights: 'Highlights (one per line)',
  school: 'School',
  degree: 'Degree',
  details: 'Details',
  groupLabel: 'Group label',
  skillsCommaSeparated: 'Skills (comma-separated)',
  projectName: 'Name',
  projectLink: 'Link',
  projectDescription: 'Description',
  languageName: 'Language',
  languageLevel: 'Level',
  addBtn: '+ Add',
  addGroupBtn: '+ Add group',
  removeBtn: 'Remove',
  noExperience: 'No experience added yet.',
  noEducation: 'No education added yet.',
  noSkills: 'No skill groups added yet.',
  noProjects: 'No projects added yet.',
  noLanguages: 'No languages added yet.',
}

const hu: Dict = {
  appName: 'Önéletrajz Készítő',
  stayInBrowser: 'Minden a böngésződben marad',
  startBlank: 'Üres sablon',
  startBlankConfirm: 'Törlöd az összes adatot, és üres sablonnal kezded?',
  savePdf: 'Mentés PDF-ként',
  present: 'Jelenleg is',

  personalSection: 'Személyes adatok',
  experienceSection: 'Szakmai tapasztalat',
  educationSection: 'Tanulmányok',
  skillsSection: 'Készségek',
  projectsSection: 'Projektek',
  languagesSection: 'Nyelvtudás',
  profileSection: 'Bemutatkozás',
  contactSection: 'Elérhetőség',
  professionalExperienceSection: 'Szakmai Tapasztalat',
  researchInterestsSection: 'Kutatási Területek',
  academicExperienceSection: 'Szakmai és Oktatói Tapasztalat',
  publicationsProjectsSection: 'Publikációk és Projektek',
  skillsCompetenciesSection: 'Készségek és Kompetenciák',

  uploadPhoto: 'Fénykép feltöltése',
  removePhoto: 'Fénykép eltávolítása',
  fullName: 'Teljes név',
  jobTitle: 'Beosztás',
  email: 'E-mail',
  phone: 'Telefon',
  location: 'Helyszín',
  website: 'Weboldal',
  summary: 'Összefoglaló',
  role: 'Pozíció',
  company: 'Cég',
  start: 'Kezdés',
  end: 'Befejezés',
  currentlyWorkHere: 'Jelenleg is itt dolgozom',
  highlights: 'Eredmények (soronként egy)',
  school: 'Intézmény',
  degree: 'Végzettség',
  details: 'Részletek',
  groupLabel: 'Csoport neve',
  skillsCommaSeparated: 'Készségek (vesszővel elválasztva)',
  projectName: 'Név',
  projectLink: 'Link',
  projectDescription: 'Leírás',
  languageName: 'Nyelv',
  languageLevel: 'Szint',
  addBtn: '+ Hozzáadás',
  addGroupBtn: '+ Csoport hozzáadása',
  removeBtn: 'Eltávolítás',
  noExperience: 'Még nincs hozzáadott tapasztalat.',
  noEducation: 'Még nincs hozzáadott tanulmány.',
  noSkills: 'Még nincs hozzáadott készségcsoport.',
  noProjects: 'Még nincs hozzáadott projekt.',
  noLanguages: 'Még nincs hozzáadott nyelv.',
}

const fr: Dict = {
  appName: 'Créateur de CV',
  stayInBrowser: 'Tout reste dans votre navigateur',
  startBlank: 'Repartir de zéro',
  startBlankConfirm: "Effacer toutes vos données et repartir d'un modèle vide ?",
  savePdf: 'Enregistrer en PDF',
  present: "Aujourd'hui",

  personalSection: 'Informations personnelles',
  experienceSection: 'Expérience',
  educationSection: 'Formation',
  skillsSection: 'Compétences',
  projectsSection: 'Projets',
  languagesSection: 'Langues',
  profileSection: 'Profil',
  contactSection: 'Contact',
  professionalExperienceSection: 'Expérience Professionnelle',
  researchInterestsSection: 'Intérêts de Recherche',
  academicExperienceSection: 'Expérience Académique et Professionnelle',
  publicationsProjectsSection: 'Publications et Projets',
  skillsCompetenciesSection: 'Compétences et Aptitudes',

  uploadPhoto: 'Ajouter une photo',
  removePhoto: 'Supprimer la photo',
  fullName: 'Nom complet',
  jobTitle: 'Intitulé du poste',
  email: 'E-mail',
  phone: 'Téléphone',
  location: 'Localisation',
  website: 'Site web',
  summary: 'Résumé',
  role: 'Poste',
  company: 'Entreprise',
  start: 'Début',
  end: 'Fin',
  currentlyWorkHere: 'Je travaille encore ici',
  highlights: 'Points clés (un par ligne)',
  school: 'Établissement',
  degree: 'Diplôme',
  details: 'Détails',
  groupLabel: 'Nom du groupe',
  skillsCommaSeparated: 'Compétences (séparées par des virgules)',
  projectName: 'Nom',
  projectLink: 'Lien',
  projectDescription: 'Description',
  languageName: 'Langue',
  languageLevel: 'Niveau',
  addBtn: '+ Ajouter',
  addGroupBtn: '+ Ajouter un groupe',
  removeBtn: 'Supprimer',
  noExperience: 'Aucune expérience ajoutée.',
  noEducation: 'Aucune formation ajoutée.',
  noSkills: 'Aucun groupe de compétences ajouté.',
  noProjects: 'Aucun projet ajouté.',
  noLanguages: 'Aucune langue ajoutée.',
}

const zh: Dict = {
  appName: '简历制作工具',
  stayInBrowser: '所有内容都保存在您的浏览器中',
  startBlank: '从空白开始',
  startBlankConfirm: '清除所有简历数据并从空白模板开始吗？',
  savePdf: '保存为 PDF',
  present: '至今',

  personalSection: '个人信息',
  experienceSection: '工作经历',
  educationSection: '教育背景',
  skillsSection: '技能',
  projectsSection: '项目经历',
  languagesSection: '语言能力',
  profileSection: '个人简介',
  contactSection: '联系方式',
  professionalExperienceSection: '职业经历',
  researchInterestsSection: '研究方向',
  academicExperienceSection: '学术与职业经历',
  publicationsProjectsSection: '论文与项目',
  skillsCompetenciesSection: '技能与能力',

  uploadPhoto: '上传照片',
  removePhoto: '移除照片',
  fullName: '姓名',
  jobTitle: '职位',
  email: '电子邮箱',
  phone: '电话',
  location: '所在地',
  website: '个人网站',
  summary: '简介',
  role: '职位',
  company: '公司',
  start: '开始时间',
  end: '结束时间',
  currentlyWorkHere: '我目前仍在此任职',
  highlights: '工作亮点（每行一条）',
  school: '学校',
  degree: '学位',
  details: '详情',
  groupLabel: '分类名称',
  skillsCommaSeparated: '技能（用逗号分隔）',
  projectName: '名称',
  projectLink: '链接',
  projectDescription: '描述',
  languageName: '语言',
  languageLevel: '水平',
  addBtn: '+ 添加',
  addGroupBtn: '+ 添加分类',
  removeBtn: '删除',
  noExperience: '尚未添加工作经历。',
  noEducation: '尚未添加教育经历。',
  noSkills: '尚未添加技能分类。',
  noProjects: '尚未添加项目。',
  noLanguages: '尚未添加语言。',
}

const es: Dict = {
  appName: 'Creador de CV',
  stayInBrowser: 'Todo permanece en tu navegador',
  startBlank: 'Empezar en blanco',
  startBlankConfirm: '¿Borrar todos tus datos y empezar con una plantilla en blanco?',
  savePdf: 'Guardar como PDF',
  present: 'Actualidad',

  personalSection: 'Datos personales',
  experienceSection: 'Experiencia',
  educationSection: 'Educación',
  skillsSection: 'Habilidades',
  projectsSection: 'Proyectos',
  languagesSection: 'Idiomas',
  profileSection: 'Perfil',
  contactSection: 'Contacto',
  professionalExperienceSection: 'Experiencia Profesional',
  researchInterestsSection: 'Intereses de Investigación',
  academicExperienceSection: 'Experiencia Académica y Profesional',
  publicationsProjectsSection: 'Publicaciones y Proyectos',
  skillsCompetenciesSection: 'Habilidades y Competencias',

  uploadPhoto: 'Subir foto',
  removePhoto: 'Quitar foto',
  fullName: 'Nombre completo',
  jobTitle: 'Puesto',
  email: 'Correo electrónico',
  phone: 'Teléfono',
  location: 'Ubicación',
  website: 'Sitio web',
  summary: 'Resumen',
  role: 'Puesto',
  company: 'Empresa',
  start: 'Inicio',
  end: 'Fin',
  currentlyWorkHere: 'Actualmente trabajo aquí',
  highlights: 'Logros (uno por línea)',
  school: 'Centro de estudios',
  degree: 'Titulación',
  details: 'Detalles',
  groupLabel: 'Nombre del grupo',
  skillsCommaSeparated: 'Habilidades (separadas por comas)',
  projectName: 'Nombre',
  projectLink: 'Enlace',
  projectDescription: 'Descripción',
  languageName: 'Idioma',
  languageLevel: 'Nivel',
  addBtn: '+ Añadir',
  addGroupBtn: '+ Añadir grupo',
  removeBtn: 'Eliminar',
  noExperience: 'Aún no has añadido experiencia.',
  noEducation: 'Aún no has añadido estudios.',
  noSkills: 'Aún no has añadido grupos de habilidades.',
  noProjects: 'Aún no has añadido proyectos.',
  noLanguages: 'Aún no has añadido idiomas.',
}

const de: Dict = {
  appName: 'Lebenslauf-Ersteller',
  stayInBrowser: 'Alles bleibt in deinem Browser',
  startBlank: 'Leer beginnen',
  startBlankConfirm: 'Alle Daten löschen und mit einer leeren Vorlage beginnen?',
  savePdf: 'Als PDF speichern',
  present: 'Heute',

  personalSection: 'Persönliche Daten',
  experienceSection: 'Berufserfahrung',
  educationSection: 'Ausbildung',
  skillsSection: 'Fähigkeiten',
  projectsSection: 'Projekte',
  languagesSection: 'Sprachen',
  profileSection: 'Profil',
  contactSection: 'Kontakt',
  professionalExperienceSection: 'Berufserfahrung',
  researchInterestsSection: 'Forschungsschwerpunkte',
  academicExperienceSection: 'Akademische und Berufliche Erfahrung',
  publicationsProjectsSection: 'Publikationen und Projekte',
  skillsCompetenciesSection: 'Fähigkeiten und Kompetenzen',

  uploadPhoto: 'Foto hochladen',
  removePhoto: 'Foto entfernen',
  fullName: 'Vollständiger Name',
  jobTitle: 'Berufsbezeichnung',
  email: 'E-Mail',
  phone: 'Telefon',
  location: 'Standort',
  website: 'Webseite',
  summary: 'Zusammenfassung',
  role: 'Position',
  company: 'Unternehmen',
  start: 'Beginn',
  end: 'Ende',
  currentlyWorkHere: 'Ich arbeite noch hier',
  highlights: 'Erfolge (eine Zeile pro Punkt)',
  school: 'Schule/Hochschule',
  degree: 'Abschluss',
  details: 'Details',
  groupLabel: 'Gruppenname',
  skillsCommaSeparated: 'Fähigkeiten (durch Komma getrennt)',
  projectName: 'Name',
  projectLink: 'Link',
  projectDescription: 'Beschreibung',
  languageName: 'Sprache',
  languageLevel: 'Niveau',
  addBtn: '+ Hinzufügen',
  addGroupBtn: '+ Gruppe hinzufügen',
  removeBtn: 'Entfernen',
  noExperience: 'Noch keine Berufserfahrung hinzugefügt.',
  noEducation: 'Noch keine Ausbildung hinzugefügt.',
  noSkills: 'Noch keine Fähigkeitengruppe hinzugefügt.',
  noProjects: 'Noch keine Projekte hinzugefügt.',
  noLanguages: 'Noch keine Sprachen hinzugefügt.',
}

export const DICTS: Record<Locale, Dict> = { en, hu, fr, zh, es, de }
