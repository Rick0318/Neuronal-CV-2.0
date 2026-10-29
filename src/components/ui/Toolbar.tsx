import { useRef } from 'react';
import {
  Edit3, Eye, Download, FileDown, Upload, Trash2,
  Pause, Play, LogOut
} from 'lucide-react';
import { CVData } from '../../types/cv';
import { exportBackup, importBackup, clearCV, unreadVisitsCount } from '../../utils/storage';
import { exportToPDF } from '../../utils/pdfExport';
import VisitsPanel from './VisitsPanel';

interface ToolbarProps {
  data: CVData;
  isEditing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
  onDataChange: (data: CVData) => void;
  onColorChange: (color: 'blue' | 'violet' | 'cyan') => void;
  onReset: () => void;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  paused: boolean;
  onTogglePause: () => void;
  onExitToLanding: () => void;
  unreadVisits: number;
  onVisitsRead: () => void;
}

export default function Toolbar({
  data, isEditing, onStartEdit, onStopEdit, onDataChange, onColorChange, onReset,
  saveStatus, paused, onTogglePause, onExitToLanding, unreadVisits, onVisitsRead
}: ToolbarProps) {
  const importRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importBackup(file);
      onDataChange(imported);
    } catch {
      alert('Error al importar: archivo inválido.');
    }
    e.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm('¿Eliminar todos los datos del CV? Esta acción no se puede deshacer.')) {
      clearCV();
      onReset();
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF(data);
    } catch (e) {
      console.error(e);
      alert('Error al exportar PDF. Inténtalo de nuevo.');
    }
  };

  const saveLabel = saveStatus === 'saving' ? 'Guardando...' : saveStatus === 'saved' ? '¡Guardado!' : saveStatus === 'error' ? 'Error al guardar' : '';

  return (
    <div className="toolbar">
      <div className="toolbar-inner">
        {/* Left: Edit toggle */}
        <div className="toolbar-group">
          {isEditing ? (
            <button onClick={onStopEdit} className="toolbar-btn toolbar-btn-primary">
              <Eye size={15} /> Vista previa
            </button>
          ) : (
            <button onClick={onStartEdit} className="toolbar-btn toolbar-btn-accent">
              <Edit3 size={15} /> Editar CV
            </button>
          )}
          {saveLabel && (
            <span className={`save-status ${saveStatus}`}>{saveLabel}</span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="toolbar-group">
          {/* Notifications */}
          <VisitsPanel unreadCount={unreadVisits} onVisitsRead={onVisitsRead} />

          {/* Color picker */}
          <div className="color-picker-group" role="group" aria-label="Color de acento">
            <button
              onClick={() => onColorChange('blue')}
              className={`color-dot blue ${data.accentColor === 'blue' ? 'active' : ''}`}
              title="Azul eléctrico"
              aria-pressed={data.accentColor === 'blue'}
            />
            <button
              onClick={() => onColorChange('violet')}
              className={`color-dot violet ${data.accentColor === 'violet' ? 'active' : ''}`}
              title="Violeta"
              aria-pressed={data.accentColor === 'violet'}
            />
            <button
              onClick={() => onColorChange('cyan')}
              className={`color-dot cyan ${data.accentColor === 'cyan' ? 'active' : ''}`}
              title="Cian"
              aria-pressed={data.accentColor === 'cyan'}
            />
          </div>

          <button onClick={onTogglePause} className="toolbar-btn" title={paused ? 'Reanudar animación' : 'Pausar animación'}>
            {paused ? <Play size={15} /> : <Pause size={15} />}
          </button>

          <button onClick={() => exportBackup(data)} className="toolbar-btn" title="Exportar copia de seguridad">
            <Download size={15} /> <span className="hidden sm:inline">Backup</span>
          </button>

          <button onClick={() => importRef.current?.click()} className="toolbar-btn" title="Importar copia de seguridad">
            <Upload size={15} /> <span className="hidden sm:inline">Importar</span>
          </button>
          <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

          <button onClick={handleExportPDF} className="toolbar-btn toolbar-btn-pdf" title="Exportar a PDF">
            <FileDown size={15} /> <span className="hidden sm:inline">PDF</span>
          </button>

          {isEditing && (
            <button onClick={handleReset} className="toolbar-btn text-red-400 hover:text-red-300" title="Borrar todos los datos">
              <Trash2 size={15} />
            </button>
          )}

          <button onClick={onExitToLanding} className="toolbar-btn toolbar-btn-exit" title="Salir al inicio">
            <LogOut size={15} /> <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </div>
  );
}
