import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { CVAdditionalItem } from '../../types/cv';
import { generateId } from '../../utils/storage';
import GlassCard from '../ui/GlassCard';
import SectionHeader from '../ui/SectionHeader';

interface Props {
  items: CVAdditionalItem[];
  onChange: (items: CVAdditionalItem[]) => void;
  isEditing: boolean;
  visible: boolean;
  onToggleVisibility: () => void;
  title: string;
  onTitleChange: (t: string) => void;
}

const CATEGORIES = ['Voluntariado', 'Publicación', 'Premio', 'Interés', 'Otro'];

function emptyItem(): CVAdditionalItem {
  return { id: generateId(), category: 'Otro', title: '', description: '', date: '', url: '' };
}

function formatDate(d: string) {
  if (!d) return '';
  const [y, m] = d.split('-');
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${months[parseInt(m) - 1] || ''} ${y}`;
}

export default function AdditionalSection({ items, onChange, isEditing, visible, onToggleVisibility, title, onTitleChange }: Props) {
  if (!isEditing && (!visible || items.length === 0)) return null;

  const update = (id: string, field: keyof CVAdditionalItem, val: string) => {
    onChange(items.map(i => i.id === id ? { ...i, [field]: val } : i));
  };

  const remove = (id: string) => onChange(items.filter(i => i.id !== id));

  return (
    <section id="additional" className={`cv-section ${!visible && isEditing ? 'section-hidden' : ''}`}>
      <SectionHeader title={title} onTitleChange={onTitleChange} visible={visible} onToggleVisibility={onToggleVisibility} isEditing={isEditing} />

      <div className="space-y-3">
        {items.map(item => (
          <GlassCard key={item.id} className="relative group">
            {isEditing && (
              <div className="item-controls">
                <button onClick={() => remove(item.id)} className="icon-btn text-red-400/60 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            )}
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="form-field">
                  <label className="field-label">Categoría</label>
                  <select
                    value={item.category}
                    onChange={e => update(item.id, 'category', e.target.value)}
                    className="editable-input"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    <option value={item.category}>{item.category}</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="field-label">Título</label>
                  <input value={item.title} onChange={e => update(item.id, 'title', e.target.value)} placeholder="Título o nombre" className="editable-input" />
                </div>
                <div className="form-field">
                  <label className="field-label">Fecha (opcional)</label>
                  <input type="month" value={item.date} onChange={e => update(item.id, 'date', e.target.value)} className="editable-input" />
                </div>
                <div className="form-field">
                  <label className="field-label">Enlace (opcional)</label>
                  <input type="url" value={item.url} onChange={e => update(item.id, 'url', e.target.value)} placeholder="https://..." className="editable-input" />
                </div>
                <div className="form-field md:col-span-2">
                  <label className="field-label">Descripción</label>
                  <textarea value={item.description} onChange={e => update(item.id, 'description', e.target.value)} placeholder="Descripción..." className="editable-textarea" rows={2} />
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="cert-issuer text-xs uppercase tracking-wider">{item.category}</span>
                    <h3 className="cert-name">{item.title}</h3>
                  </div>
                  {item.date && <span className="exp-date">{formatDate(item.date)}</span>}
                </div>
                {item.description && <p className="cert-description">{item.description}</p>}
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="project-link mt-1">
                    <ExternalLink size={11} /> Ver enlace
                  </a>
                )}
              </div>
            )}
          </GlassCard>
        ))}
        {isEditing && (
          <button onClick={() => onChange([...items, emptyItem()])} className="add-btn">
            <Plus size={16} /> Añadir elemento
          </button>
        )}
        {isEditing && items.length === 0 && <p className="empty-hint">Voluntariado, premios, publicaciones u otros logros</p>}
      </div>
    </section>
  );
}
