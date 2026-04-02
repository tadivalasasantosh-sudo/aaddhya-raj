import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { CompanyLogo } from './CompanyLogo';
import { Github, Twitter, Linkedin, Mail, MapPin, Phone, MessageCircle, Facebook, Instagram, Clock } from 'lucide-react';

export const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <CompanyLogo size="sm" />
            <p className="text-slate-400 text-sm leading-relaxed font-light max-w-md">
              Empowering businesses with scalable, secure, and high-performance digital solutions. From full-stack development to AI-driven systems, we build the future of technology.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.linkedin.com/company/aadhyaraj-technologies/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h4 className="text-slate-50 font-semibold mb-6">Contact Us</h4>
              <ul className="space-y-4 text-sm text-slate-400 font-light">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-emerald-500 shrink-0" />
                  <a href="https://maps.google.com/?q=Hyderabad,Telangana,India" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Hyderabad, Telangana, India</a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-emerald-500 shrink-0" />
                  <a href={`tel:${settings.whatsappNumber}`} className="hover:text-emerald-400 transition-colors">{settings.whatsappNumber}</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-emerald-500 shrink-0" />
                  <a href={`mailto:${settings.contactEmail}`} className="hover:text-emerald-400 transition-colors">{settings.contactEmail}</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-50 font-semibold mb-6">Company Hours</h4>
              <ul className="space-y-4 text-sm text-slate-400 font-light">
                <li className="flex items-start gap-3">
                  <Clock size={18} className="text-emerald-500 shrink-0" />
                  <span>{settings.companyHours || 'Monday to Friday: 9:00 AM - 6:00 PM, Saturday & Sunday: Closed'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-slate-500">
          <p>© {new Date().getFullYear()} AadhyaRaj Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
