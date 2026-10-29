import { Plus, Trash2, X } from 'lucide-react';
import { CVSkill } from '../../types/cv';
import { generateId } from '../../utils/storage';
import GlassCard from '../ui/GlassCard';
import SectionHeader from '../ui/SectionHeader';

interface Props {
  items: CVSkill[];
  onChange: (items: CVSkill[]) => void;
  isEditing: boolean;
  visible: boolean;
  onToggleVisibility: () => void;
  title: string;
  onTitleChange: (t: string) => void;
}

function emptySkill(category: 'technical' | 'soft'): CVSkill {
  return { id: generateId(), name: '', category, level: '' };
}

export default function SkillsSection({ items, onChange, isEditing, visible, onToggleVisibility, title, onTitleChange }: Props) {
  if (!isEditing && (!visible || items.length === 0)) return null;

  const update = (id: string, field: keyof CVSkill, val: string) => {
    onChange(items.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  const remove = (id: string) => onChange(items.filter(s => s.id !== id));

  const techSkills = items.filter(s => s.category === 'technical');
  const softSkills = items.filter(s => s.category === 'soft');

  const SkillTag = ({ skill }: { skill: CVSkill }) => (
    <div className="skill-tag">
      <span className="skill-name">{skill.name}</span>
      {skill.level && <span className="skill-level">{skill.level}</span>}
    </div>
  );

  const EditableSkill = ({ skill }: { skill: CVSkill }) => (
    <div className="skill-edit-row">
      <input
        value={skill.name}
        onChange={e => update(skill.id, 'name', e.target.value)}
        placeholder="Habilidad"
        className="editable-input-sm flex-1"
      />
      <input
        value={skill.level}
        onChange={e => update(skill.id, 'level', e.target.value)}
        placeholder="Nivel (opcional)"
        className="editable-input-sm w-28"
      />
      <button onClick={() => remove(skill.id)} className="icon-btn text-red-400/60 hover:text-red-400">
        <X size={14} />
      </button>
    </div>
  );

  return (
    <section id="skills" className={`cv-section ${!visible && isEditing ? 'section-hidden' : ''}`}>
      <SectionHeader title={title} onTitleChange={onTitleChange} visible={visible} onToggleVisibility={onToggleVisibility} isEditing={isEditing} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Technical */}
        <GlassCard>
          <h3 className="skill-category-title">Técnicas</h3>
          {isEditing ? (
            <div className="space-y-2">
              {techSkills.map(s => <EditableSkill key={s.id} skill={s} />)}
              <button onClick={() => onChange([...items, emptySkill('technical')])} className="add-btn-sm mt-2">
                <Plus size={12} /> Añadir
              </button>
            </div>
          ) : (
            <div className="skill-tags">
              {techSkills.map(s => <SkillTag key={s.id} skill={s} />)}
              {techSkills.length === 0 && <p className="empty-hint text-xs">Sin habilidades técnicas</p>}
            </div>
          )}
        </GlassCard>

        {/* Soft */}
        <GlassCard>
          <h3 className="skill-category-title">Personales</h3>
          {isEditing ? (
            <div className="space-y-2">
              {softSkills.map(s => <EditableSkill key={s.id} skill={s} />)}
              <button onClick={() => onChange([...items, emptySkill('soft')])} className="add-btn-sm mt-2">
                <Plus size={12} /> Añadir
              </button>
            </div>
          ) : (
            <div className="skill-tags">
              {softSkills.map(s => <SkillTag key={s.id} skill={s} />)}
              {softSkills.length === 0 && <p className="empty-hint text-xs">Sin habilidades personales</p>}
            </div>
          )}
        </GlassCard>
      </div>
    </section>
  );
}
