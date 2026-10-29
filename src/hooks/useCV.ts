import { useState, useCallback, useEffect } from 'react';
import { CVData, defaultCVData } from '../types/cv';
import { saveCV, loadCV } from '../utils/storage';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function useCV() {
  const [data, setData] = useState<CVData>(() => loadCV());
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveTimer, setSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const persistData = useCallback((newData: CVData) => {
    if (saveTimer) clearTimeout(saveTimer);
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        saveCV(newData);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch {
        setSaveStatus('error');
      }
    }, 600);
    setSaveTimer(timer);
  }, [saveTimer]);

  const updateData = useCallback(<K extends keyof CVData>(section: K, value: CVData[K]) => {
    setData(prev => {
      const next = { ...prev, [section]: value };
      persistData(next);
      return next;
    });
  }, [persistData]);

  const updateProfile = useCallback((field: string, value: string) => {
    setData(prev => {
      const next = { ...prev, profile: { ...prev.profile, [field]: value } };
      persistData(next);
      return next;
    });
  }, [persistData]);

  const startEditing = useCallback(() => setIsEditing(true), []);
  const stopEditing = useCallback(() => setIsEditing(false), []);

  const resetAll = useCallback(() => {
    const fresh = { ...defaultCVData };
    setData(fresh);
    saveCV(fresh);
  }, []);

  useEffect(() => {
    return () => { if (saveTimer) clearTimeout(saveTimer); };
  }, [saveTimer]);

  return {
    data,
    setData,
    updateData,
    updateProfile,
    isEditing,
    startEditing,
    stopEditing,
    saveStatus,
    persistData,
    resetAll,
  };
}
