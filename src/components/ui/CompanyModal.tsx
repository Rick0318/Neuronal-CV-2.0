import { useState } from 'react';
import { Building2, X, Eye } from 'lucide-react';
import { saveVisit } from '../../utils/storage';

interface CompanyModalProps {
  onEnter: (companyName: string) => void;
  onCancel: () => void;
}

export default function CompanyModal({ onEnter, onCancel }: CompanyModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const company = companyName.trim();
    const contact = contactName.trim();
    if (!company) {
      setError('Por favor ingresa el nombre de la empresa.');
      return;
    }
    saveVisit({ companyName: company, contactName: contact });
    onEnter(company);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Acceso empresa">
      <div className="modal-box">
        <button className="modal-close" onClick={onCancel} aria-label="Cerrar">
          <X size={18} />
        </button>

        <div className="modal-icon">
          <Building2 size={30} />
        </div>

        <h2 className="modal-title">Acceso de empresa</h2>
        <p className="modal-desc">
          Para ver este portafolio, por favor ingresa los datos de tu empresa.
          El propietario será notificado de tu visita.
        </p>

        <div className="modal-fields">
          <label className="modal-label" htmlFor="company-name">
            Nombre de la empresa <span className="required">*</span>
          </label>
          <input
            id="company-name"
            type="text"
            value={companyName}
            onChange={e => { setCompanyName(e.target.value); setError(''); }}
            onKeyDown={handleKeyDown}
            placeholder="Ej: Tech Corp S.A."
            className="modal-input"
            autoFocus
            maxLength={80}
          />

          <label className="modal-label" htmlFor="contact-name">
            Tu nombre (opcional)
          </label>
          <input
            id="contact-name"
            type="text"
            value={contactName}
            onChange={e => setContactName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ej: Ana García"
            className="modal-input"
            maxLength={80}
          />
        </div>

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <button className="btn-landing-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button className="btn-landing-primary" onClick={handleSubmit}>
            <Eye size={15} /> Ver portafolio
          </button>
        </div>
      </div>
    </div>
  );
}
