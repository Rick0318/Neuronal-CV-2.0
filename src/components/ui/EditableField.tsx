import { useState, useRef, useEffect } from 'react';

interface EditableFieldProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  isEditing: boolean;
  multiline?: boolean;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  type?: string;
}

export default function EditableField({
  value,
  onChange,
  placeholder = 'Haz clic para escribir...',
  isEditing,
  multiline = false,
  className = '',
  tag: Tag = 'span',
  type = 'text',
}: EditableFieldProps) {
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    if (focused && ref.current) ref.current.focus();
  }, [focused]);

  if (!isEditing) {
    if (!value) return null;
    return <Tag className={className}>{value}</Tag>;
  }

  const base =
    'bg-transparent border-b border-white/20 focus:border-accent-primary focus:outline-none transition-colors text-inherit font-inherit w-full resize-none';

  if (multiline) {
    return (
      <textarea
        ref={ref as React.RefObject<HTMLTextAreaElement>}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${base} ${className} min-h-[80px]`}
        rows={4}
      />
    );
  }

  return (
    <input
      ref={ref as React.RefObject<HTMLInputElement>}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${base} ${className}`}
    />
  );
}
