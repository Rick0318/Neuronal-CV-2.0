import { Plus, Trash2, GraduationCap, Building, Calendar } from 'lucide-react';
import { CVEducation } from '../../types/cv';
import { generateId } from '../../utils/storage';
import GlassCard from '../ui/GlassCard';
import SectionHeader from '../ui/SectionHeader';

interface Props {
  items: CVEducation[];
  onChange: (items: CVEducation[]) => void;
  isEditing: boolean;
  visible: boolean;
  onToggleVisibility: () => void;
  title: string;
  onTitleChange: (t: string) => void;
}

function emptyEdu(): CVEducation {
  return { id: generateId(), institution: '', degree: '', startDate: '', endDate: '', description: '' };
}

function formatDate(d: string) {
  if (!d) return '';
  const [y, m] = d.split('-');
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${months[parseInt(m) - 1] || ''} ${y}`;
}

export default function EducationSection({ items, onChange, isEditing, visible, onToggleVisibility, title, onTitleChange }: Props) {
  if (!isEditing && (!visible || items.length === 0)) return null;

  const update = (id: string, field: keyof CVEducation, val: string) => {
    onChange(items.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  const remove = (id: string) => onChange(items.filter(e => e.id !== id));

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const arr = [...items];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    onChange(arr);
  };

  const moveDown = (idx: number) => {
    if (idx === items.length - 1) return;
    const arr = [...items];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    onChange(arr);
  };

  return (
    <section id="education" className={`cv-section ${!visible && isEditing ? 'section-hidden' : ''}`}>
      <SectionHeader title={title} onTitleChange={onTitleChange} visible={visible} onToggleVisibility={onToggleVisibility} isEditing={isEditing} />

      <div className="space-y-4">
        {items.map((edu, idx) => (
          <GlassCard key={edu.id} className="relative group">
            {isEditing && (
              <div className="item-controls">
                <button onClick={() => moveUp(idx)} className="icon-btn text-white/30 hover:text-white/70">↑</button>
                <button onClick={() => moveDown(idx)} className="icon-btn text-white/30 hover:text-white/70">↓</button>
                <button onClick={() => remove(edu.id)} className="icon-btn text-red-400/60 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            )}
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="form-field">
                  <label className="field-label"><GraduationCap size={12} /> Título / Programa</label>
                  <input value={edu.degree} onChange={e => update(edu.id, 'degree', e.target.value)} placeholder="Nombre del título" className="editable-input" />
                </div>
                <div className="form-field">
                  <label className="field-label"><Building size={12} /> Institución</label>
                  <input value={edu.institution} onChange={e => update(edu.id, 'institution', e.target.value)} placeholder="Universidad o centro educativo" className="editable-input" />
                </div>
                <div className="form-field">
                  <label className="field-label"><Calendar size={12} /> Inicio</label>
                  <input type="month" value={edu.startDate} onChange={e => update(edu.id, 'startDate', e.target.value)} className="editable-input" />
                </div>
                <div className="form-field">
                  <label className="field-label"><Calendar size={12} /> Fin</label>
                  <input type="month" value={edu.endDate} onChange={e => update(edu.id, 'endDate', e.target.value)} className="editable-input" />
                </div>
                <div className="form-field md:col-span-2">
                  <label className="field-label">Descripción (opcional)</label>
                  <textarea value={edu.description} onChange={e => update(edu.id, 'description', e.target.value)} placeholder="Mención, especialización, logros académicos..." className="editable-textarea" rows={2} />
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="exp-position">{edu.degree}</h3>
                    {edu.institution && <p className="exp-company">{edu.institution}</p>}
                  </div>
                  <span className="exp-date">
                    {formatDate(edu.startDate)}{edu.startDate && edu.endDate ? ' – ' : ''}{formatDate(edu.endDate)}
                  </span>
                </div>
                {edu.description && <p className="exp-description">{edu.description}</p>}
              </div>
            )}
          </GlassCard>
        ))}
        {isEditing && (
          <button onClick={() => onChange([...items, emptyEdu()])} className="add-btn">
            <Plus size={16} /> Añadir estudio
          </button>
        )}
        {isEditing && items.length === 0 && (
          <p className="empty-hint">Añade tu formación académica</p>
        )}
      </div>
    </section>
  );
}
