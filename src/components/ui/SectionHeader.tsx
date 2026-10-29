import { useState } from 'react';
import { Eye, EyeOff, Edit3, Check } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  onTitleChange?: (v: string) => void;
  visible: boolean;
  onToggleVisibility: () => void;
  isEditing: boolean;
}

export default function SectionHeader({
  title,
  onTitleChange,
  visible,
  onToggleVisibility,
  isEditing,
}: SectionHeaderProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [draft, setDraft] = useState(title);

  const confirmTitle = () => {
    onTitleChange?.(draft);
    setEditingTitle(false);
  };

  return (
    <div className="section-header">
      <div className="section-header-line" />
      <div className="section-header-content">
        {isEditing && editingTitle ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onBlur={confirmTitle}
              onKeyDown={e => e.key === 'Enter' && confirmTitle()}
              className="section-title-input"
            />
            <button onClick={confirmTitle} className="icon-btn text-accent-primary">
              <Check size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="section-title">{title}</h2>
            {isEditing && (
              <button
                onClick={() => { setDraft(title); setEditingTitle(true); }}
                className="icon-btn text-white/40 hover:text-white/70"
              >
                <Edit3 size={12} />
              </button>
            )}
          </div>
        )}
        {isEditing && (
          <button
            onClick={onToggleVisibility}
            className={`icon-btn ml-auto ${visible ? 'text-white/40 hover:text-white/70' : 'text-red-400'}`}
            title={visible ? 'Ocultar sección' : 'Mostrar sección'}
          >
            {visible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}
