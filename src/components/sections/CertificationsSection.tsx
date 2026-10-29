import { Plus, Trash2, Award, ExternalLink, Calendar } from 'lucide-react';
import { CVCertification } from '../../types/cv';
import { generateId } from '../../utils/storage';
import GlassCard from '../ui/GlassCard';
import SectionHeader from '../ui/SectionHeader';

interface Props {
  items: CVCertification[];
  onChange: (items: CVCertification[]) => void;
  isEditing: boolean;
  visible: boolean;
  onToggleVisibility: () => void;
  title: string;
  onTitleChange: (t: string) => void;
}

function emptycert(): CVCertification {
  return { id: generateId(), name: '', issuer: '', date: '', description: '', verifyUrl: '' };
}

function formatDate(d: string) {
  if (!d) return '';
  const [y, m] = d.split('-');
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${months[parseInt(m) - 1] || ''} ${y}`;
}

export default function CertificationsSection({ items, onChange, isEditing, visible, onToggleVisibility, title, onTitleChange }: Props) {
  if (!isEditing && (!visible || items.length === 0)) return null;

  const update = (id: string, field: keyof CVCertification, val: string) => {
    onChange(items.map(c => c.id === id ? { ...c, [field]: val } : c));
  };

  const remove = (id: string) => onChange(items.filter(c => c.id !== id));

  return (
    <section id="certifications" className={`cv-section ${!visible && isEditing ? 'section-hidden' : ''}`}>
      <SectionHeader title={title} onTitleChange={onTitleChange} visible={visible} onToggleVisibility={onToggleVisibility} isEditing={isEditing} />

      <div className="space-y-3">
        {items.map(cert => (
          <GlassCard key={cert.id} className="relative group">
            {isEditing && (
              <div className="item-controls">
                <button onClick={() => remove(cert.id)} className="icon-btn text-red-400/60 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
            )}
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="form-field">
                  <label className="field-label"><Award size={12} /> Nombre del certificado</label>
                  <input value={cert.name} onChange={e => update(cert.id, 'name', e.target.value)} placeholder="Nombre del curso o certificación" className="editable-input" />
                </div>
                <div className="form-field">
                  <label className="field-label">Entidad emisora</label>
                  <input value={cert.issuer} onChange={e => update(cert.id, 'issuer', e.target.value)} placeholder="Organización emisora" className="editable-input" />
                </div>
                <div className="form-field">
                  <label className="field-label"><Calendar size={12} /> Fecha</label>
                  <input type="month" value={cert.date} onChange={e => update(cert.id, 'date', e.target.value)} className="editable-input" />
                </div>
                <div className="form-field">
                  <label className="field-label">Enlace de verificación</label>
                  <input type="url" value={cert.verifyUrl} onChange={e => update(cert.id, 'verifyUrl', e.target.value)} placeholder="https://..." className="editable-input" />
                </div>
                <div className="form-field md:col-span-2">
                  <label className="field-label">Descripción (opcional)</label>
                  <textarea value={cert.description} onChange={e => update(cert.id, 'description', e.target.value)} placeholder="Descripción del contenido..." className="editable-textarea" rows={2} />
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Award size={14} className="text-accent-primary flex-shrink-0" />
                    <h3 className="cert-name">{cert.name}</h3>
                  </div>
                  {cert.issuer && <p className="cert-issuer">{cert.issuer}</p>}
                  {cert.description && <p className="cert-description">{cert.description}</p>}
                  {cert.verifyUrl && (
                    <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer" className="project-link mt-1">
                      <ExternalLink size={11} /> Verificar
                    </a>
                  )}
                </div>
                {cert.date && <span className="exp-date">{formatDate(cert.date)}</span>}
              </div>
            )}
          </GlassCard>
        ))}
        {isEditing && (
          <button onClick={() => onChange([...items, emptycert()])} className="add-btn">
            <Plus size={16} /> Añadir certificación
          </button>
        )}
        {isEditing && items.length === 0 && <p className="empty-hint">Añade tus certificaciones y cursos</p>}
      </div>
    </section>
  );
}
