import { CVData } from '../../types/cv';

interface NavbarProps {
  data: CVData;
  isEditing: boolean;
}

const SECTIONS = [
  { id: 'about', key: 'about' as const },
  { id: 'experience', key: 'experience' as const },
  { id: 'education', key: 'education' as const },
  { id: 'skills', key: 'skills' as const },
  { id: 'projects', key: 'projects' as const },
  { id: 'certifications', key: 'certifications' as const },
  { id: 'languages', key: 'languages' as const },
  { id: 'additional', key: 'additional' as const },
];

export default function Navbar({ data, isEditing }: NavbarProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const visibleSections = SECTIONS.filter(s =>
    isEditing || data.visibleSections[s.key]
  );

  return (
    <nav className="navbar" aria-label="Navegación del CV">
      <div className="navbar-inner">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="nav-logo"
        >
          {data.profile.name ? data.profile.name.split(' ')[0] : 'Neural CV'}
        </button>

        <div className="nav-links">
          {visibleSections.map(s => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="nav-link"
            >
              {data.sectionTitles[s.key]}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
