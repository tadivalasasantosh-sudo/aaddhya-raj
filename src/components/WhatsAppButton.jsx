import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const WhatsAppButton = () => {
  const { settings } = useSettings();
  const whatsappNumber = settings.whatsappNumber ? settings.whatsappNumber.replace(/\D/g, '') : "919127912345";
  
  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 p-4 rounded-full bg-sky-500 text-white shadow-lg hover:bg-sky-600 hover:shadow-sky-500/25 transition-all z-40 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={24} />
      <span className="absolute left-14 bg-white text-gray-900 border border-gray-200 shadow-lg text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Chat on WhatsApp
      </span>
    </a>
  );
};
