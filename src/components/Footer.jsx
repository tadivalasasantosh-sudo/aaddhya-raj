import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { CompanyLogo } from './CompanyLogo';
import { Github, Twitter, Linkedin, Mail, MapPin, Phone, MessageCircle, Facebook, Instagram } from 'lucide-react';

export const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <CompanyLogo size="sm" />
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering businesses with scalable, secure, and high-performance digital solutions. From full-stack development to AI-driven systems, we build the future of technology.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.linkedin.com/company/aditya-technology/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-500 shrink-0" />
                <a href="https://maps.google.com/?q=Hyderabad,Telangana,India" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Hyderabad, Telangana, India</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-500 shrink-0" />
                <a href={`tel:${settings.whatsappNumber}`} className="hover:text-white transition-colors">{settings.whatsappNumber}</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={18} className="text-green-500 shrink-0" />
                <a href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp Us</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-500 shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition-colors">{settings.contactEmail}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Aditya Technology. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
