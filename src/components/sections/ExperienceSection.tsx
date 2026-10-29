import { Plus, Trash2, GripVertical, Building2, Briefcase, MapPin, Calendar } from 'lucide-react';
import { CVExperience } from '../../types/cv';
import { generateId } from '../../utils/storage';
import GlassCard from '../ui/GlassCard';
import SectionHeader from '../ui/SectionHeader';

interface Props {
  items: CVExperience[];
  onChange: (items: CVExperience[]) => void;
  isEditing: boolean;
  visible: boolean;
  onToggleVisibility: () => void;
  title: string;
  onTitleChange: (t: string) => void;
}

function emptyExp(): CVExperience {
  return { id: generateId(), company: '', position: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '', achievements: '' };
}

function formatDate(d: string) {
  if (!d) return '';
  const [y, m] = d.split('-');
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${months[parseInt(m) - 1] || ''} ${y}`;
}

export default function ExperienceSection({ items, onChange, isEditing, visible, onToggleVisibility, title, onTitleChange }: Props) {
  if (!isEditing && (!visible || items.length === 0)) return null;

  const update = (id: string, field: keyof CVExperience, val: string | boolean) => {
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
    <section id="experience" className={`cv-section ${!visible && isEditing ? 'section-hidden' : ''}`}>
      <SectionHeader title={title} onTitleChange={onTitleChange} visible={visible} onToggleVisibility={onToggleVisibility} isEditing={isEditing} />

      <div className="space-y-4">
        {items.map((exp, idx) => (
          <GlassCard key={exp.id} className="relative group">
            {isEditing && (
              <div className="item-controls">
                <button onClick={() => moveUp(idx)} className="icon-btn text-white/30 hover:text-white/70" title="Mover arriba">↑</button>
                <button onClick={() => moveDown(idx)} className="icon-btn text-white/30 hover:text-white/70" title="Mover abajo">↓</button>
                <button onClick={() => remove(exp.id)} className="icon-btn text-red-400/60 hover:text-red-400" title="Eliminar"><Trash2 size={14} /></button>
              </div>
            )}

            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="form-field">
                  <label className="field-label"><Briefcase size={12} /> Cargo / Posición</label>
                  <input value={exp.position} onChange={e => update(exp.id, 'position', e.target.value)} placeholder="Título del puesto" className="editable-input" />
                </div>
                <div className="form-field">
                  <label className="field-label"><Building2 size={12} /> Empresa</label>
                  <input value={exp.company} onChange={e => update(exp.id, 'company', e.target.value)} placeholder="Nombre de la empresa" className="editable-input" />
                </div>
                <div className="form-field">
                  <label className="field-label"><MapPin size={12} /> Ubicación</label>
                  <input value={exp.location} onChange={e => update(exp.id, 'location', e.target.value)} placeholder="Ciudad, País" className="editable-input" />
                </div>
                <div className="form-field">
                  <label className="field-label"><Calendar size={12} /> Fecha de inicio</label>
                  <input type="month" value={exp.startDate} onChange={e => update(exp.id, 'startDate', e.target.value)} className="editable-input" />
                </div>
                <div className="form-field">
                  <label className="field-label">Fecha de fin {exp.isCurrent ? '(puesto actual)' : ''}</label>
                  <input type="month" value={exp.endDate} onChange={e => update(exp.id, 'endDate', e.target.value)} disabled={exp.isCurrent} className="editable-input disabled:opacity-40" />
                </div>
                <div className="form-field flex items-center gap-2">
                  <input type="checkbox" id={`current-${exp.id}`} checked={exp.isCurrent} onChange={e => update(exp.id, 'isCurrent', e.target.checked)} className="accent-checkbox" />
                  <label htmlFor={`current-${exp.id}`} className="field-label cursor-pointer">Puesto actual</label>
                </div>
                <div className="form-field md:col-span-2">
                  <label className="field-label">Descripción de responsabilidades</label>
                  <textarea value={exp.description} onChange={e => update(exp.id, 'description', e.target.value)} placeholder="Describe tus responsabilidades principales..." className="editable-textarea" rows={3} />
                </div>
                <div className="form-field md:col-span-2">
                  <label className="field-label">Logros y resultados</label>
                  <textarea value={exp.achievements} onChange={e => update(exp.id, 'achievements', e.target.value)} placeholder="Logros destacados, métricas, resultados..." className="editable-textarea" rows={2} />
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="exp-position">{exp.position}</h3>
                    <p className="exp-company">
                      {exp.company && <span>{exp.company}</span>}
                      {exp.location && <span className="exp-location"> · {exp.location}</span>}
                    </p>
                  </div>
                  <span className="exp-date">
                    {formatDate(exp.startDate)} {exp.startDate && '–'} {exp.isCurrent ? 'Presente' : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && <p className="exp-description">{exp.description}</p>}
                {exp.achievements && <p className="exp-achievements">{exp.achievements}</p>}
              </div>
            )}
          </GlassCard>
        ))}

        {isEditing && (
          <button onClick={() => onChange([...items, emptyExp()])} className="add-btn">
            <Plus size={16} /> Añadir experiencia
          </button>
        )}

        {isEditing && items.length === 0 && (
          <p className="empty-hint">Haz clic en "Añadir experiencia" para comenzar</p>
        )}
      </div>
    </section>
  );
}
