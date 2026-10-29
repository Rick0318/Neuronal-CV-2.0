import { useState, useEffect, Suspense, lazy } from 'react';
import { useCV } from './hooks/useCV';
import { CVData } from './types/cv';
import { saveCV, unreadVisitsCount } from './utils/storage';

import LandingScreen from './components/ui/LandingScreen';
import CompanyModal from './components/ui/CompanyModal';
import Toolbar from './components/ui/Toolbar';
import Navbar from './components/ui/Navbar';
import ProfileSection from './components/sections/ProfileSection';
import AboutSection from './components/sections/AboutSection';
import ExperienceSection from './components/sections/ExperienceSection';
import EducationSection from './components/sections/EducationSection';
import SkillsSection from './components/sections/SkillsSection';
import ProjectsSection from './components/sections/ProjectsSection';
import CertificationsSection from './components/sections/CertificationsSection';
import LanguagesSection from './components/sections/LanguagesSection';
import AdditionalSection from './components/sections/AdditionalSection';

const NeuralSpiral = lazy(() => import('./components/neural/NeuralSpiral'));

// ── tipos de vista ────────────────────────────────────────────
type AppView = 'landing' | 'owner' | 'company-modal' | 'company';

function ScrollIndicator() {
  return (
    <div className="scroll-indicator" aria-hidden="true">
      <div className="scroll-dot" />
      <span>Desplaza para explorar</span>
    </div>
  );
}

export default function App() {
  const { data, setData, updateData, updateProfile, isEditing, startEditing, stopEditing, saveStatus, persistData, resetAll } = useCV();

  const [view, setView] = useState<AppView>('landing');
  const [companyName, setCompanyName] = useState('');
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadVisits, setUnreadVisits] = useState(0);

  // Contar notificaciones no leídas
  useEffect(() => {
    setUnreadVisits(unreadVisitsCount());
  }, [view]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Apply accent color CSS vars
  useEffect(() => {
    const root = document.documentElement;
    const colors = {
      blue: { primary: '#3b82f6', secondary: '#06b6d4', glow: 'rgba(59,130,246,0.3)' },
      violet: { primary: '#8b5cf6', secondary: '#3b82f6', glow: 'rgba(139,92,246,0.3)' },
      cyan: { primary: '#06b6d4', secondary: '#8b5cf6', glow: 'rgba(6,182,212,0.3)' },
    };
    const c = colors[data.accentColor];
    root.style.setProperty('--accent-primary', c.primary);
    root.style.setProperty('--accent-secondary', c.secondary);
    root.style.setProperty('--accent-glow', c.glow);
  }, [data.accentColor]);

  const handleColorChange = (color: 'blue' | 'violet' | 'cyan') => {
    const next = { ...data, accentColor: color };
    setData(next);
    saveCV(next);
  };

  const handleDataChange = (newData: CVData) => {
    setData(newData);
    saveCV(newData);
  };

  const toggleSection = (section: keyof typeof data.visibleSections) => {
    const next = {
      ...data,
      visibleSections: { ...data.visibleSections, [section]: !data.visibleSections[section] }
    };
    setData(next);
    persistData(next);
  };

  const updateSectionTitle = (section: keyof typeof data.sectionTitles, val: string) => {
    const next = { ...data, sectionTitles: { ...data.sectionTitles, [section]: val } };
    setData(next);
    persistData(next);
  };

  const handleEnterOwner = () => {
    setView('owner');
    setUnreadVisits(unreadVisitsCount());
  };

  const handleEnterCompanyModal = () => {
    setView('company-modal');
  };

  const handleCompanyConfirm = (name: string) => {
    setCompanyName(name);
    setView('company');
    window.scrollTo({ top: 0 });
  };

  const handleExitToLanding = () => {
    if (isEditing) stopEditing();
    setView('landing');
    setScrolled(false);
    window.scrollTo({ top: 0 });
  };

  // ── Pantalla de inicio ──────────────────────────────────────
  if (view === 'landing') {
    return (
      <div className={`app accent-${data.accentColor}`}>
        <LandingScreen
          accentColor={data.accentColor}
          ownerName={data.profile.name}
          onEnterOwner={handleEnterOwner}
          onEnterCompany={handleEnterCompanyModal}
        />
        {view === 'landing' && false /* never, just type-safety */}
      </div>
    );
  }

  // ── Modal de empresa (sobre la landing) ────────────────────
  if (view === 'company-modal') {
    return (
      <div className={`app accent-${data.accentColor}`}>
        <LandingScreen
          accentColor={data.accentColor}
          ownerName={data.profile.name}
          onEnterOwner={handleEnterOwner}
          onEnterCompany={handleEnterCompanyModal}
        />
        <CompanyModal
          onEnter={handleCompanyConfirm}
          onCancel={() => setView('landing')}
        />
      </div>
    );
  }

  // ── Vista de empresa (solo lectura) ────────────────────────
  const isCompanyView = view === 'company';
  const editingActive = !isCompanyView && isEditing;

  // Navbar y secciones compartidos entre propietario y empresa
  const CVContent = (
    <>
      <Navbar data={data} isEditing={editingActive} />

      {/* Banda informativa para empresa */}
      {isCompanyView && (
        <div className="company-banner">
          <span>
            Viendo como: <strong>{companyName}</strong>
          </span>
          <button className="company-banner-btn" onClick={handleExitToLanding}>
            ← Volver al inicio
          </button>
        </div>
      )}

      {/* Hero Section */}
      <header className="hero-section" id="hero">
        <div className="hero-canvas-wrapper">
          <Suspense fallback={<div className="neural-fallback" />}>
            {!reducedMotion ? (
              <NeuralSpiral accentColor={data.accentColor} paused={paused} reduced={false} />
            ) : (
              <div className="neural-static" />
            )}
          </Suspense>
        </div>

        <div className="hero-content">
          {editingActive ? (
            <div className="hero-edit-fields">
              <input
                value={data.profile.name}
                onChange={e => updateProfile('name', e.target.value)}
                placeholder="Tu nombre completo"
                className="hero-name-input-lg"
                aria-label="Nombre completo"
              />
              <input
                value={data.profile.title}
                onChange={e => updateProfile('title', e.target.value)}
                placeholder="Tu profesión"
                className="hero-title-input-lg"
                aria-label="Profesión"
              />
              <input
                value={data.profile.specialty}
                onChange={e => updateProfile('specialty', e.target.value)}
                placeholder="Especialidad o cargo deseado"
                className="hero-specialty-input-lg"
                aria-label="Especialidad"
              />
            </div>
          ) : (
            <div className="hero-text">
              {data.profile.name ? (
                <h1 className="hero-name-display">{data.profile.name}</h1>
              ) : (
                <h1 className="hero-name-empty">Tu nombre aquí</h1>
              )}
              {data.profile.title ? (
                <p className="hero-title-display">{data.profile.title}</p>
              ) : (
                <p className="hero-title-empty">
                  {isCompanyView ? '' : 'Pulsa "Editar CV" para comenzar'}
                </p>
              )}
              {data.profile.specialty && (
                <p className="hero-specialty-display">{data.profile.specialty}</p>
              )}
            </div>
          )}

          <div className="hero-actions">
            <button
              onClick={() =>
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) ||
                document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="btn-explore"
            >
              Explorar CV
            </button>
            {!editingActive && !isCompanyView && (
              <button onClick={startEditing} className="btn-edit-hero">
                Editar CV
              </button>
            )}
          </div>
        </div>

        {!scrolled && <ScrollIndicator />}
      </header>

      {/* CV Content */}
      <main className="cv-main" id="cv-content">
        <div className="cv-container">

          {(editingActive || data.visibleSections.profile) && (
            <section id="profile" className="cv-section">
              <ProfileSection
                profile={data.profile}
                onChange={(field, value) => {
                  const next = { ...data, profile: { ...data.profile, [field]: value } };
                  setData(next);
                  persistData(next);
                }}
                isEditing={editingActive}
              />
            </section>
          )}

          <AboutSection
            data={data.about}
            onChange={v => updateData('about', v)}
            isEditing={editingActive}
            visible={data.visibleSections.about}
            onToggleVisibility={() => toggleSection('about')}
            title={data.sectionTitles.about}
            onTitleChange={v => updateSectionTitle('about', v)}
          />

          <ExperienceSection
            items={data.experience}
            onChange={v => updateData('experience', v)}
            isEditing={editingActive}
            visible={data.visibleSections.experience}
            onToggleVisibility={() => toggleSection('experience')}
            title={data.sectionTitles.experience}
            onTitleChange={v => updateSectionTitle('experience', v)}
          />

          <EducationSection
            items={data.education}
            onChange={v => updateData('education', v)}
            isEditing={editingActive}
            visible={data.visibleSections.education}
            onToggleVisibility={() => toggleSection('education')}
            title={data.sectionTitles.education}
            onTitleChange={v => updateSectionTitle('education', v)}
          />

          <SkillsSection
            items={data.skills}
            onChange={v => updateData('skills', v)}
            isEditing={editingActive}
            visible={data.visibleSections.skills}
            onToggleVisibility={() => toggleSection('skills')}
            title={data.sectionTitles.skills}
            onTitleChange={v => updateSectionTitle('skills', v)}
          />

          <ProjectsSection
            items={data.projects}
            onChange={v => updateData('projects', v)}
            isEditing={editingActive}
            visible={data.visibleSections.projects}
            onToggleVisibility={() => toggleSection('projects')}
            title={data.sectionTitles.projects}
            onTitleChange={v => updateSectionTitle('projects', v)}
          />

          <CertificationsSection
            items={data.certifications}
            onChange={v => updateData('certifications', v)}
            isEditing={editingActive}
            visible={data.visibleSections.certifications}
            onToggleVisibility={() => toggleSection('certifications')}
            title={data.sectionTitles.certifications}
            onTitleChange={v => updateSectionTitle('certifications', v)}
          />

          <LanguagesSection
            items={data.languages}
            onChange={v => updateData('languages', v)}
            isEditing={editingActive}
            visible={data.visibleSections.languages}
            onToggleVisibility={() => toggleSection('languages')}
            title={data.sectionTitles.languages}
            onTitleChange={v => updateSectionTitle('languages', v)}
          />

          <AdditionalSection
            items={data.additional}
            onChange={v => updateData('additional', v)}
            isEditing={editingActive}
            visible={data.visibleSections.additional}
            onToggleVisibility={() => toggleSection('additional')}
            title={data.sectionTitles.additional}
            onTitleChange={v => updateSectionTitle('additional', v)}
          />
        </div>
      </main>

      <footer className="cv-footer">
        <p>Neural CV · {new Date().getFullYear()}</p>
      </footer>
    </>
  );

  return (
    <div className={`app accent-${data.accentColor}`}>
      {/* Toolbar solo para el propietario */}
      {!isCompanyView && (
        <Toolbar
          data={data}
          isEditing={isEditing}
          onStartEdit={startEditing}
          onStopEdit={stopEditing}
          onDataChange={handleDataChange}
          onColorChange={handleColorChange}
          onReset={resetAll}
          saveStatus={saveStatus}
          paused={paused}
          onTogglePause={() => setPaused(p => !p)}
          onExitToLanding={handleExitToLanding}
          unreadVisits={unreadVisits}
          onVisitsRead={() => setUnreadVisits(0)}
        />
      )}

      {CVContent}
    </div>
  );
}
