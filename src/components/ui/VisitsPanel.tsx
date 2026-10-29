import { useState } from 'react';
import { Bell, Building2, X, Trash2, CheckCheck } from 'lucide-react';
import { CompanyVisit, loadVisits, markVisitsAsRead, clearVisits } from '../../utils/storage';

interface VisitsPanelProps {
  unreadCount: number;
  onVisitsRead: () => void;
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString('es', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function VisitsPanel({ unreadCount, onVisitsRead }: VisitsPanelProps) {
  const [open, setOpen] = useState(false);
  const [visits, setVisits] = useState<CompanyVisit[]>([]);

  const handleOpen = () => {
    const v = loadVisits();
    setVisits(v);
    setOpen(true);
    if (unreadCount > 0) {
      markVisitsAsRead();
      onVisitsRead();
    }
  };

  const handleClear = () => {
    if (window.confirm('¿Eliminar todo el historial de visitas?')) {
      clearVisits();
      setVisits([]);
      onVisitsRead();
    }
  };

  return (
    <>
      {/* Bell button */}
      <button
        className="visits-bell"
        onClick={handleOpen}
        title="Visitas de empresas"
        aria-label={`Notificaciones de visitas${unreadCount > 0 ? `, ${unreadCount} no leídas` : ''}`}
      >
        <Bell size={15} />
        {unreadCount > 0 && (
          <span className="visits-badge" aria-live="polite">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {/* Panel drawer */}
      {open && (
        <div className="visits-overlay" onClick={() => setOpen(false)}>
          <div className="visits-panel" onClick={e => e.stopPropagation()} role="dialog" aria-label="Historial de visitas">
            <div className="visits-panel-header">
              <div className="visits-panel-title">
                <Bell size={16} />
                <span>Visitas de empresas</span>
                {visits.length > 0 && <span className="visits-count">{visits.length}</span>}
              </div>
              <div className="visits-panel-actions">
                {visits.length > 0 && (
                  <button className="visits-action-btn" onClick={handleClear} title="Limpiar historial">
                    <Trash2 size={14} />
                  </button>
                )}
                <button className="visits-action-btn" onClick={() => setOpen(false)} aria-label="Cerrar">
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="visits-list">
              {visits.length === 0 ? (
                <div className="visits-empty">
                  <CheckCheck size={32} className="visits-empty-icon" />
                  <p>Sin visitas registradas aún</p>
                  <span>Las empresas que vean tu portafolio aparecerán aquí</span>
                </div>
              ) : (
                visits.map(v => (
                  <div key={v.id} className={`visit-item ${!v.read ? 'unread' : ''}`}>
                    <div className="visit-item-icon">
                      <Building2 size={18} />
                    </div>
                    <div className="visit-item-body">
                      <p className="visit-company">{v.companyName}</p>
                      {v.contactName && (
                        <p className="visit-contact">Contacto: {v.contactName}</p>
                      )}
                      <p className="visit-date">{formatDate(v.timestamp)}</p>
                    </div>
                    {!v.read && <span className="visit-unread-dot" aria-label="No leída" />}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
