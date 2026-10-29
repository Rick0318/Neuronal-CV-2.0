import { CVData, defaultCVData } from '../types/cv';

const STORAGE_KEY = 'neural-cv-data';
const VISITS_KEY = 'neural-cv-visits';
const OWNER_PIN_KEY = 'neural-cv-owner-pin';

export interface CompanyVisit {
  id: string;
  companyName: string;
  contactName: string;
  timestamp: number;
  read: boolean;
}

// ── PIN de propietario ────────────────────────────────────────
export function saveOwnerPin(pin: string): void {
  try { localStorage.setItem(OWNER_PIN_KEY, pin); } catch { /* silent */ }
}

export function loadOwnerPin(): string | null {
  return localStorage.getItem(OWNER_PIN_KEY);
}

export function hasOwnerPin(): boolean {
  const p = loadOwnerPin();
  return !!p && p.length > 0;
}

// ── Visitas de empresas ───────────────────────────────────────
export function loadVisits(): CompanyVisit[] {
  try {
    const raw = localStorage.getItem(VISITS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CompanyVisit[];
  } catch { return []; }
}

export function saveVisit(visit: Omit<CompanyVisit, 'id' | 'timestamp' | 'read'>): CompanyVisit {
  const newVisit: CompanyVisit = {
    id: generateId(),
    timestamp: Date.now(),
    read: false,
    ...visit,
  };
  const visits = loadVisits();
  visits.unshift(newVisit);
  try { localStorage.setItem(VISITS_KEY, JSON.stringify(visits)); } catch { /* silent */ }
  return newVisit;
}

export function markVisitsAsRead(): void {
  const visits = loadVisits().map(v => ({ ...v, read: true }));
  try { localStorage.setItem(VISITS_KEY, JSON.stringify(visits)); } catch { /* silent */ }
}

export function clearVisits(): void {
  localStorage.removeItem(VISITS_KEY);
}

export function unreadVisitsCount(): number {
  return loadVisits().filter(v => !v.read).length;
}

export function saveCV(data: CVData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving CV data:', e);
  }
}

export function loadCV(): CVData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultCVData };
    const parsed = JSON.parse(raw) as Partial<CVData>;
    // Merge with defaults to handle new fields added after initial save
    return {
      ...defaultCVData,
      ...parsed,
      profile: { ...defaultCVData.profile, ...(parsed.profile || {}) },
      about: { ...defaultCVData.about, ...(parsed.about || {}) },
      visibleSections: { ...defaultCVData.visibleSections, ...(parsed.visibleSections || {}) },
      sectionTitles: { ...defaultCVData.sectionTitles, ...(parsed.sectionTitles || {}) },
      experience: parsed.experience || [],
      education: parsed.education || [],
      skills: parsed.skills || [],
      projects: parsed.projects || [],
      certifications: parsed.certifications || [],
      languages: parsed.languages || [],
      additional: parsed.additional || [],
    };
  } catch (e) {
    console.error('Error loading CV data:', e);
    return { ...defaultCVData };
  }
}

export function clearCV(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportBackup(data: CVData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `neural-cv-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importBackup(file: File): Promise<CVData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as CVData;
        resolve(data);
      } catch {
        reject(new Error('Archivo JSON inválido'));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
  });
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
