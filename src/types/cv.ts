export interface CVProfile {
  name: string;
  title: string;
  specialty: string;
  description: string;
  photo: string | null;
  city: string;
  country: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  otherLinks: { label: string; url: string }[];
}

export interface CVAbout {
  content: string;
}

export interface CVExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  achievements: string;
}

export interface CVEducation {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CVSkill {
  id: string;
  name: string;
  category: 'technical' | 'soft';
  level: string;
}

export interface CVProject {
  id: string;
  name: string;
  description: string;
  technologies: string;
  image: string | null;
  projectUrl: string;
  codeUrl: string;
}

export interface CVCertification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  description: string;
  verifyUrl: string;
}

export interface CVLanguage {
  id: string;
  language: string;
  level: string;
}

export interface CVAdditionalItem {
  id: string;
  category: string;
  title: string;
  description: string;
  date: string;
  url: string;
}

export interface CVSections {
  profile: boolean;
  about: boolean;
  experience: boolean;
  education: boolean;
  skills: boolean;
  projects: boolean;
  certifications: boolean;
  languages: boolean;
  additional: boolean;
}

export interface CVSectionTitles {
  about: string;
  experience: string;
  education: string;
  skills: string;
  projects: string;
  certifications: string;
  languages: string;
  additional: string;
}

export interface CVData {
  profile: CVProfile;
  about: CVAbout;
  experience: CVExperience[];
  education: CVEducation[];
  skills: CVSkill[];
  projects: CVProject[];
  certifications: CVCertification[];
  languages: CVLanguage[];
  additional: CVAdditionalItem[];
  visibleSections: CVSections;
  sectionTitles: CVSectionTitles;
  accentColor: 'blue' | 'violet' | 'cyan';
}

export const defaultCVData: CVData = {
  profile: {
    name: '',
    title: '',
    specialty: '',
    description: '',
    photo: null,
    city: '',
    country: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    otherLinks: [],
  },
  about: { content: '' },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  additional: [],
  visibleSections: {
    profile: true,
    about: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: true,
    languages: true,
    additional: true,
  },
  sectionTitles: {
    about: 'Sobre Mí',
    experience: 'Experiencia Laboral',
    education: 'Educación',
    skills: 'Habilidades',
    projects: 'Proyectos',
    certifications: 'Certificaciones y Cursos',
    languages: 'Idiomas',
    additional: 'Información Adicional',
  },
  accentColor: 'blue',
};
