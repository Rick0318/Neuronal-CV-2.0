import { CVAbout } from '../../types/cv';
import GlassCard from '../ui/GlassCard';
import SectionHeader from '../ui/SectionHeader';

interface Props {
  data: CVAbout;
  onChange: (data: CVAbout) => void;
  isEditing: boolean;
  visible: boolean;
  onToggleVisibility: () => void;
  title: string;
  onTitleChange: (t: string) => void;
}

export default function AboutSection({ data, onChange, isEditing, visible, onToggleVisibility, title, onTitleChange }: Props) {
  if (!isEditing && (!visible || !data.content)) return null;

  return (
    <section id="about" className={`cv-section ${!visible && isEditing ? 'section-hidden' : ''}`}>
      <SectionHeader
        title={title}
        onTitleChange={onTitleChange}
        visible={visible}
        onToggleVisibility={onToggleVisibility}
        isEditing={isEditing}
      />
      <GlassCard>
        {isEditing ? (
          <textarea
            value={data.content}
            onChange={e => onChange({ content: e.target.value })}
            placeholder="Escribe tu presentación personal, objetivos profesionales y propuesta de valor..."
            className="editable-textarea w-full min-h-[120px]"
            rows={5}
          />
        ) : (
          <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{data.content}</p>
        )}
      </GlassCard>
    </section>
  );
}
