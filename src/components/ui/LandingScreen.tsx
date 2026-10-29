import { useState, Suspense, lazy } from 'react';
import { User, Building2, Eye, Lock } from 'lucide-react';
import { hasOwnerPin, loadOwnerPin, saveOwnerPin } from '../../utils/storage';

const NeuralSpiral = lazy(() => import('../neural/NeuralSpiral'));

interface LandingScreenProps {
  accentColor: 'blue' | 'violet' | 'cyan';
  ownerName: string;
  onEnterOwner: () => void;
  onEnterCompany: () => void;
}

type Mode = 'landing' | 'owner-pin' | 'owner-set-pin';

export default function LandingScreen({ accentColor, ownerName, onEnterOwner, onEnterCompany }: LandingScreenProps) {
  const [mode, setMode] = useState<Mode>('landing');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const handleOwnerClick = () => {
    if (hasOwnerPin()) {
      setMode('owner-pin');
    } else {
      setMode('owner-set-pin');
    }
    setPin('');
    setConfirmPin('');
    setError('');
  };

  const handleVerifyPin = () => {
    const stored = loadOwnerPin();
    if (pin === stored) {
      onEnterOwner();
    } else {
      setError('PIN incorrecto. Inténtalo de nuevo.');
      setPin('');
    }
  };

  const handleSetPin = () => {
    if (pin.length < 4) {
      setError('El PIN debe tener al menos 4 caracteres.');
      return;
    }
    if (pin !== confirmPin) {
      setError('Los PINs no coinciden.');
      return;
    }
    saveOwnerPin(pin);
    onEnterOwner();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (mode === 'owner-pin') handleVerifyPin();
      if (mode === 'owner-set-pin') handleSetPin();
    }
  };

  return (
    <div className="landing-screen">
      {/* Background animation */}
      <div className="landing-bg">
        <Suspense fallback={<div className="neural-fallback" />}>
          <NeuralSpiral accentColor={accentColor} paused={false} reduced={false} />
        </Suspense>
      </div>

      <div className="landing-content">
        {mode === 'landing' && (
          <>
            <div className="landing-header">
              <h1 className="landing-title">
                {ownerName ? ownerName : 'Neural CV'}
              </h1>
              <p className="landing-subtitle">
                {ownerName ? 'Portafolio profesional interactivo' : 'Tu portafolio profesional interactivo'}
              </p>
            </div>

            <div className="landing-cards">
              {/* Propietario */}
              <button className="landing-card landing-card-owner" onClick={handleOwnerClick}>
                <div className="landing-card-icon">
                  <User size={32} />
                </div>
                <div className="landing-card-body">
                  <h2>Soy el propietario</h2>
                  <p>Accede para editar y gestionar tu portafolio</p>
                </div>
                <div className="landing-card-arrow">
                  <Lock size={16} />
                </div>
              </button>

              {/* Empresa */}
              <button className="landing-card landing-card-company" onClick={onEnterCompany}>
                <div className="landing-card-icon">
                  <Building2 size={32} />
                </div>
                <div className="landing-card-body">
                  <h2>Soy una empresa</h2>
                  <p>Visualiza el portafolio profesional</p>
                </div>
                <div className="landing-card-arrow">
                  <Eye size={16} />
                </div>
              </button>
            </div>
          </>
        )}

        {mode === 'owner-pin' && (
          <div className="landing-pin-box">
            <div className="landing-pin-icon">
              <Lock size={28} />
            </div>
            <h2>Acceso de propietario</h2>
            <p className="landing-pin-hint">Ingresa tu PIN para continuar</p>
            <input
              type="password"
              value={pin}
              onChange={e => { setPin(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              placeholder="••••••"
              className="landing-pin-input"
              autoFocus
              maxLength={20}
            />
            {error && <p className="landing-error">{error}</p>}
            <div className="landing-pin-actions">
              <button className="btn-landing-secondary" onClick={() => setMode('landing')}>
                Volver
              </button>
              <button className="btn-landing-primary" onClick={handleVerifyPin}>
                Ingresar
              </button>
            </div>
          </div>
        )}

        {mode === 'owner-set-pin' && (
          <div className="landing-pin-box">
            <div className="landing-pin-icon">
              <Lock size={28} />
            </div>
            <h2>Crear PIN de acceso</h2>
            <p className="landing-pin-hint">Define un PIN para proteger tu portafolio</p>
            <input
              type="password"
              value={pin}
              onChange={e => { setPin(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              placeholder="Nuevo PIN (mínimo 4 caracteres)"
              className="landing-pin-input"
              autoFocus
              maxLength={20}
            />
            <input
              type="password"
              value={confirmPin}
              onChange={e => { setConfirmPin(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              placeholder="Confirmar PIN"
              className="landing-pin-input"
              maxLength={20}
            />
            {error && <p className="landing-error">{error}</p>}
            <div className="landing-pin-actions">
              <button className="btn-landing-secondary" onClick={() => setMode('landing')}>
                Volver
              </button>
              <button className="btn-landing-primary" onClick={handleSetPin}>
                Crear PIN y entrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
