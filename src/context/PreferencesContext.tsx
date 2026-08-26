'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface PreferencesContextType {
  isDataSaver: boolean;
  toggleDataSaver: () => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDataSaver, setIsDataSaver] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('fmf_data_saver');
    if (saved !== null) {
      setIsDataSaver(saved === 'true');
    } else {
      // Auto-enable for slow connections if possible
      if ('connection' in navigator) {
        const conn = (navigator as any).connection;
        if (conn && (conn.saveData || conn.effectiveType === '2g' || conn.effectiveType === '3g')) {
          setIsDataSaver(true);
        }
      }
    }
  }, []);

  const toggleDataSaver = () => {
    setIsDataSaver((prev) => {
      const newVal = !prev;
      localStorage.setItem('fmf_data_saver', String(newVal));
      return newVal;
    });
  };

  return (
    <PreferencesContext.Provider value={{ isDataSaver, toggleDataSaver }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
