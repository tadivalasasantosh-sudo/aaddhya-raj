import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { CompanyLogo } from './CompanyLogo';
import { Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export const Footer = () => {
  const { settings } = useSettings();
  const contactEmail = settings.contactEmail || 'Info@aadhyarajtech.com';
  const whatsappNumber = settings.whatsappNumber || '+91 9127912345';

  return (
    <footer className="bg-white pt-24 pb-12 relative overflow-hidden border-t border-gray-100">
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-sky-600 via-sky-400 to-sky-600" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-2 space-y-8">
            <CompanyLogo size="sm" />
            <p className="text-gray-600 text-lg leading-relaxed font-light max-w-md">
              AadhyaRaj Technologies is a premier technology partner, delivering high-impact digital transformation through advanced software engineering and AI-driven business intelligence.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.linkedin.com/company/aadhyaraj-technologies/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-sky-600 hover:bg-sky-50 hover:border-sky-500/30 transition-all duration-300">
                <Linkedin size={22} />
              </a>
              <a href={`mailto:${contactEmail}`} className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-sky-600 hover:bg-sky-50 hover:border-sky-500/30 transition-all duration-300">
                <Mail size={22} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold text-lg mb-8 uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-4 text-gray-600 font-light">
              <li><button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-sky-600 transition-colors">Our Services</button></li>
              <li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-sky-600 transition-colors">About Us</button></li>
              <li><button onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-sky-600 transition-colors">Testimonials</button></li>
              <li><button onClick={() => document.getElementById('careers')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-sky-600 transition-colors">Careers</button></li>
              <li><button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-sky-600 transition-colors">Contact</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold text-lg mb-8 uppercase tracking-widest">Connect</h4>
            <ul className="space-y-6 text-gray-600 font-light">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 shrink-0">
                  <MapPin size={20} />
                </div>
                <a href="https://maps.google.com/?q=Hyderabad,Telangana,India" target="_blank" rel="noopener noreferrer" className="hover:text-sky-600 transition-colors leading-tight">Hyderabad, Telangana, India</a>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 shrink-0">
                  <Phone size={20} />
                </div>
                <a href={`tel:${whatsappNumber}`} className="hover:text-sky-600 transition-colors">{whatsappNumber}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-xs uppercase tracking-widest text-gray-400 font-medium">
          <p>© {new Date().getFullYear()} AadhyaRaj Technologies. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="hover:text-sky-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
