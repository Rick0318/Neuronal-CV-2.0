import { Plus, Trash2 } from 'lucide-react';
import { CVLanguage } from '../../types/cv';
import { generateId } from '../../utils/storage';
import GlassCard from '../ui/GlassCard';
import SectionHeader from '../ui/SectionHeader';

interface Props {
  items: CVLanguage[];
  onChange: (items: CVLanguage[]) => void;
  isEditing: boolean;
  visible: boolean;
  onToggleVisibility: () => void;
  title: string;
  onTitleChange: (t: string) => void;
}

function emptyLang(): CVLanguage {
  return { id: generateId(), language: '', level: '' };
}

export default function LanguagesSection({ items, onChange, isEditing, visible, onToggleVisibility, title, onTitleChange }: Props) {
  if (!isEditing && (!visible || items.length === 0)) return null;

  const update = (id: string, field: keyof CVLanguage, val: string) => {
    onChange(items.map(l => l.id === id ? { ...l, [field]: val } : l));
  };

  const remove = (id: string) => onChange(items.filter(l => l.id !== id));

  return (
    <section id="languages" className={`cv-section ${!visible && isEditing ? 'section-hidden' : ''}`}>
      <SectionHeader title={title} onTitleChange={onTitleChange} visible={visible} onToggleVisibility={onToggleVisibility} isEditing={isEditing} />

      <GlassCard>
        {isEditing ? (
          <div className="space-y-2">
            {items.map(lang => (
              <div key={lang.id} className="skill-edit-row">
                <input
                  value={lang.language}
                  onChange={e => update(lang.id, 'language', e.target.value)}
                  placeholder="Idioma (ej. Español)"
                  className="editable-input-sm flex-1"
                />
                <input
                  value={lang.level}
                  onChange={e => update(lang.id, 'level', e.target.value)}
                  placeholder="Nivel (ej. Nativo, C1, Intermedio)"
                  className="editable-input-sm flex-1"
                />
                <button onClick={() => remove(lang.id)} className="icon-btn text-red-400/60 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button onClick={() => onChange([...items, emptyLang()])} className="add-btn-sm mt-2">
              <Plus size={12} /> Añadir idioma
            </button>
            {items.length === 0 && <p className="empty-hint">Añade los idiomas que dominas</p>}
          </div>
        ) : (
          <div className="language-grid">
            {items.map(lang => (
              <div key={lang.id} className="language-item">
                <span className="language-name">{lang.language}</span>
                {lang.level && <span className="language-level">{lang.level}</span>}
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </section>
  );
}
