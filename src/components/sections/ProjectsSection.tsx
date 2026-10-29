import { useRef } from 'react';
import { Plus, Trash2, ExternalLink, Github, Image as ImageIcon } from 'lucide-react';
import { CVProject } from '../../types/cv';
import { generateId } from '../../utils/storage';
import GlassCard from '../ui/GlassCard';
import SectionHeader from '../ui/SectionHeader';

interface Props {
  items: CVProject[];
  onChange: (items: CVProject[]) => void;
  isEditing: boolean;
  visible: boolean;
  onToggleVisibility: () => void;
  title: string;
  onTitleChange: (t: string) => void;
}

function emptyProject(): CVProject {
  return { id: generateId(), name: '', description: '', technologies: '', image: null, projectUrl: '', codeUrl: '' };
}

export default function ProjectsSection({ items, onChange, isEditing, visible, onToggleVisibility, title, onTitleChange }: Props) {
  if (!isEditing && (!visible || items.length === 0)) return null;

  const update = (id: string, field: keyof CVProject, val: string | null) => {
    onChange(items.map(p => p.id === id ? { ...p, [field]: val } : p));
  };

  const remove = (id: string) => onChange(items.filter(p => p.id !== id));

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
    <section id="projects" className={`cv-section ${!visible && isEditing ? 'section-hidden' : ''}`}>
      <SectionHeader title={title} onTitleChange={onTitleChange} visible={visible} onToggleVisibility={onToggleVisibility} isEditing={isEditing} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((proj, idx) => (
          <ProjectCard key={proj.id} project={proj} idx={idx} total={items.length} isEditing={isEditing} onUpdate={update} onRemove={remove} onMoveUp={moveUp} onMoveDown={moveDown} />
        ))}
      </div>

      {isEditing && (
        <button onClick={() => onChange([...items, emptyProject()])} className="add-btn mt-4">
          <Plus size={16} /> Añadir proyecto
        </button>
      )}
      {isEditing && items.length === 0 && <p className="empty-hint">Muestra tus proyectos más relevantes</p>}
    </section>
  );
}

function ProjectCard({ project, idx, total, isEditing, onUpdate, onRemove, onMoveUp, onMoveDown }: {
  project: CVProject;
  idx: number;
  total: number;
  isEditing: boolean;
  onUpdate: (id: string, field: keyof CVProject, val: string | null) => void;
  onRemove: (id: string) => void;
  onMoveUp: (idx: number) => void;
  onMoveDown: (idx: number) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onUpdate(project.id, 'image', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <GlassCard className="relative group">
      {isEditing && (
        <div className="item-controls">
          <button onClick={() => onMoveUp(idx)} className="icon-btn text-white/30 hover:text-white/70">↑</button>
          <button onClick={() => onMoveDown(idx)} className="icon-btn text-white/30 hover:text-white/70">↓</button>
          <button onClick={() => onRemove(project.id)} className="icon-btn text-red-400/60 hover:text-red-400"><Trash2 size={14} /></button>
        </div>
      )}

      {project.image && (
        <div className="project-image-wrapper">
          <img src={project.image} alt={project.name} className="project-image" />
        </div>
      )}

      {isEditing ? (
        <div className="space-y-2">
          <div className="form-field">
            <label className="field-label">Nombre del proyecto</label>
            <input value={project.name} onChange={e => onUpdate(project.id, 'name', e.target.value)} placeholder="Mi Proyecto" className="editable-input" />
          </div>
          <div className="form-field">
            <label className="field-label">Descripción</label>
            <textarea value={project.description} onChange={e => onUpdate(project.id, 'description', e.target.value)} placeholder="¿Qué hace este proyecto?" className="editable-textarea" rows={3} />
          </div>
          <div className="form-field">
            <label className="field-label">Tecnologías utilizadas</label>
            <input value={project.technologies} onChange={e => onUpdate(project.id, 'technologies', e.target.value)} placeholder="React, Node.js, MongoDB..." className="editable-input" />
          </div>
          <div className="form-field">
            <label className="field-label">URL del proyecto</label>
            <input type="url" value={project.projectUrl} onChange={e => onUpdate(project.id, 'projectUrl', e.target.value)} placeholder="https://..." className="editable-input" />
          </div>
          <div className="form-field">
            <label className="field-label">URL del código fuente</label>
            <input type="url" value={project.codeUrl} onChange={e => onUpdate(project.id, 'codeUrl', e.target.value)} placeholder="https://github.com/..." className="editable-input" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => fileRef.current?.click()} className="add-btn-sm">
              <ImageIcon size={12} /> {project.image ? 'Cambiar imagen' : 'Añadir imagen'}
            </button>
            {project.image && (
              <button onClick={() => onUpdate(project.id, 'image', null)} className="add-btn-sm text-red-400">
                <Trash2 size={12} /> Quitar imagen
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>
        </div>
      ) : (
        <div>
          <h3 className="project-name">{project.name}</h3>
          {project.description && <p className="project-description">{project.description}</p>}
          {project.technologies && (
            <div className="tech-tags">
              {project.technologies.split(',').map((t, i) => (
                <span key={i} className="tech-tag">{t.trim()}</span>
              ))}
            </div>
          )}
          <div className="project-links">
            {project.projectUrl && (
              <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                <ExternalLink size={12} /> Ver proyecto
              </a>
            )}
            {project.codeUrl && (
              <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                <Github size={12} /> Código
              </a>
            )}
          </div>
        </div>
      )}
    </GlassCard>
  );
}
