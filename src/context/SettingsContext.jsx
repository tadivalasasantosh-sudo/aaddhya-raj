import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    aboutText: '',
    contactEmail: 'Info@aadhyarajtech.com',
    whatsappNumber: '+91 9127912345',
    careerDetails: 'We are looking for passionate individuals to join our team and build the future of AadhyaRaj Technologies together.'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'global'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data());
      }
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error('Settings Error:', err);
      setLoading(false);
      // Don't throw here to avoid crashing the whole app
      setError(err.message);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, error }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
