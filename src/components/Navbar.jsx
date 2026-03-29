import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, LayoutDashboard } from 'lucide-react';
import { CompanyLogo } from './CompanyLogo';
import { cn } from '../lib/utils';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/#services' },
    { name: 'Portfolio', path: '/#portfolio' },
    { name: 'About', path: '/#about' },
    { name: 'Contact', path: '/#contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
      scrolled ? "bg-black/80 backdrop-blur-md border-white/10 py-3" : "bg-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 transition-all"
              >
                <LayoutDashboard size={16} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-medium text-white hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all"
              >
                <LogIn size={16} />
                <span>Admin</span>
              </Link>
            )}
            
            <CompanyLogo size="sm" />

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className={cn(
        "md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 overflow-hidden",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-4 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};
