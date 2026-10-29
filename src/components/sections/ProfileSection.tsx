import { useRef } from 'react';
import { Camera, Mail, Phone, MapPin, Linkedin, Github, Globe, Plus, Trash2 } from 'lucide-react';
import { CVProfile } from '../../types/cv';

interface ProfileSectionProps {
  profile: CVProfile;
  onChange: (field: string, value: string | { label: string; url: string }[]) => void;
  isEditing: boolean;
}

export default function ProfileSection({ profile, onChange, isEditing }: ProfileSectionProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onChange('photo', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const addLink = () => {
    onChange('otherLinks', [...profile.otherLinks, { label: '', url: '' }]);
  };

  const updateLink = (idx: number, field: 'label' | 'url', val: string) => {
    const links = profile.otherLinks.map((l, i) =>
      i === idx ? { ...l, [field]: val } : l
    );
    onChange('otherLinks', links);
  };

  const removeLink = (idx: number) => {
    onChange('otherLinks', profile.otherLinks.filter((_, i) => i !== idx));
  };

  const Field = ({
    field,
    placeholder,
    className = '',
    type = 'text',
  }: { field: keyof CVProfile; placeholder: string; className?: string; type?: string }) => {
    const val = profile[field] as string;
    if (!isEditing && !val) return null;
    return isEditing ? (
      <input
        type={type}
        value={val}
        onChange={e => onChange(field, e.target.value)}
        placeholder={placeholder}
        className={`editable-input ${className}`}
      />
    ) : (
      <span className={className}>{val}</span>
    );
  };

  return (
    <div className="profile-section">
      {/* Photo */}
      <div className="profile-photo-wrapper">
        {profile.photo ? (
          <img src={profile.photo} alt="Foto de perfil" className="profile-photo" />
        ) : (
          <div className="profile-photo-placeholder">
            {isEditing ? <Camera size={32} className="text-white/30" /> : null}
          </div>
        )}
        {isEditing && (
          <>
            <button
              className="photo-upload-btn"
              onClick={() => fileRef.current?.click()}
              title="Subir foto"
            >
              <Camera size={16} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhoto}
            />
          </>
        )}
      </div>

      {/* Info */}
      <div className="profile-info">
        {isEditing ? (
          <input
            value={profile.name}
            onChange={e => onChange('name', e.target.value)}
            placeholder="Tu nombre completo"
            className="hero-name-input"
          />
        ) : profile.name ? (
          <h1 className="hero-name">{profile.name}</h1>
        ) : null}

        {isEditing ? (
          <input
            value={profile.title}
            onChange={e => onChange('title', e.target.value)}
            placeholder="Tu profesión o título"
            className="hero-title-input"
          />
        ) : profile.title ? (
          <p className="hero-title">{profile.title}</p>
        ) : null}

        {isEditing ? (
          <input
            value={profile.specialty}
            onChange={e => onChange('specialty', e.target.value)}
            placeholder="Especialidad o cargo deseado"
            className="hero-specialty-input"
          />
        ) : profile.specialty ? (
          <p className="hero-specialty">{profile.specialty}</p>
        ) : null}

        {isEditing ? (
          <textarea
            value={profile.description}
            onChange={e => onChange('description', e.target.value)}
            placeholder="Breve descripción de ti mismo..."
            className="editable-textarea"
            rows={2}
          />
        ) : profile.description ? (
          <p className="profile-description">{profile.description}</p>
        ) : null}

        {/* Contact */}
        <div className="contact-grid">
          {isEditing || profile.email ? (
            <div className="contact-item">
              <Mail size={14} className="text-accent-primary" />
              {isEditing ? (
                <input type="email" value={profile.email} onChange={e => onChange('email', e.target.value)} placeholder="correo@email.com" className="editable-input-sm" />
              ) : <a href={`mailto:${profile.email}`}>{profile.email}</a>}
            </div>
          ) : null}
          {isEditing || profile.phone ? (
            <div className="contact-item">
              <Phone size={14} className="text-accent-primary" />
              {isEditing ? (
                <input value={profile.phone} onChange={e => onChange('phone', e.target.value)} placeholder="+00 000 000 000" className="editable-input-sm" />
              ) : <span>{profile.phone}</span>}
            </div>
          ) : null}
          {isEditing || profile.city || profile.country ? (
            <div className="contact-item">
              <MapPin size={14} className="text-accent-primary" />
              {isEditing ? (
                <div className="flex gap-2">
                  <input value={profile.city} onChange={e => onChange('city', e.target.value)} placeholder="Ciudad" className="editable-input-sm" />
                  <input value={profile.country} onChange={e => onChange('country', e.target.value)} placeholder="País" className="editable-input-sm" />
                </div>
              ) : <span>{[profile.city, profile.country].filter(Boolean).join(', ')}</span>}
            </div>
          ) : null}
        </div>

        {/* Social links */}
        <div className="social-links">
          {isEditing || profile.linkedin ? (
            <div className="contact-item">
              <Linkedin size={14} className="text-accent-primary" />
              {isEditing ? (
                <input value={profile.linkedin} onChange={e => onChange('linkedin', e.target.value)} placeholder="URL de LinkedIn" className="editable-input-sm" />
              ) : <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="link">{profile.linkedin}</a>}
            </div>
          ) : null}
          {isEditing || profile.github ? (
            <div className="contact-item">
              <Github size={14} className="text-accent-primary" />
              {isEditing ? (
                <input value={profile.github} onChange={e => onChange('github', e.target.value)} placeholder="URL de GitHub" className="editable-input-sm" />
              ) : <a href={profile.github} target="_blank" rel="noopener noreferrer" className="link">{profile.github}</a>}
            </div>
          ) : null}
          {isEditing || profile.portfolio ? (
            <div className="contact-item">
              <Globe size={14} className="text-accent-primary" />
              {isEditing ? (
                <input value={profile.portfolio} onChange={e => onChange('portfolio', e.target.value)} placeholder="URL de portfolio" className="editable-input-sm" />
              ) : <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="link">{profile.portfolio}</a>}
            </div>
          ) : null}

          {/* Other links */}
          {profile.otherLinks.map((link, idx) => (
            <div key={idx} className="contact-item">
              <Globe size={14} className="text-accent-secondary" />
              {isEditing ? (
                <div className="flex gap-2 items-center flex-1">
                  <input value={link.label} onChange={e => updateLink(idx, 'label', e.target.value)} placeholder="Etiqueta" className="editable-input-sm w-24" />
                  <input value={link.url} onChange={e => updateLink(idx, 'url', e.target.value)} placeholder="URL" className="editable-input-sm flex-1" />
                  <button onClick={() => removeLink(idx)} className="icon-btn text-red-400"><Trash2 size={12} /></button>
                </div>
              ) : link.url ? (
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="link">{link.label || link.url}</a>
              ) : null}
            </div>
          ))}

          {isEditing && (
            <button onClick={addLink} className="add-btn-sm">
              <Plus size={12} /> Añadir enlace
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
