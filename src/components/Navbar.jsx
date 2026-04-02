import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, LayoutDashboard, LogOut } from 'lucide-react';
import { CompanyLogo } from './CompanyLogo';
import { cn } from '../lib/utils';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Link, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        if (u.email === 'tadivalasasantosh@gmail.com') {
          setUserRole('admin');
        } else {
          try {
            const userDoc = await getDoc(doc(db, 'users', u.uid));
            if (userDoc.exists()) {
              setUserRole(userDoc.data().role);
            }
          } catch (err) {
            handleFirestoreError(err, OperationType.GET, `users/${u.uid}`);
          }
        }
      } else {
        setUserRole(null);
      }
    });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/#services' },
    { name: 'About', path: '/#about' },
    { name: 'Process', path: '/#process' },
    { name: 'Tech Stack', path: '/#tech-stack' },
    { name: 'Careers', path: '/#careers' },
    { name: 'Contact', path: '/#contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
      scrolled ? "bg-slate-950/80 backdrop-blur-md border-slate-800/50 py-3" : "bg-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/">
              <CompanyLogo size="md" />
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                link.path.startsWith('/#') ? (
                  <a
                    key={link.name}
                    href={link.path}
                    className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                )
              ))}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-ai-assistant'))}
                className="text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                AI Assistant
              </button>
              <a
                href="/#contact"
                className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Start a Project
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 text-sm font-medium text-slate-100 hover:bg-slate-800 hover:border-emerald-500/30 transition-all"
                >
                  <LayoutDashboard size={16} />
                  <span className="hidden sm:inline">{userRole === 'hr' ? 'HR Portal' : 'Dashboard'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-all"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-600 text-sm font-semibold text-slate-950 hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
              >
                <LogIn size={16} />
                <span>Portal Login</span>
              </Link>
            )}

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
        "md:hidden absolute top-full left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 transition-all duration-300 overflow-hidden",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            link.path.startsWith('/#') ? (
              <a
                key={link.name}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-medium text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/5 rounded-lg transition-all"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-medium text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/5 rounded-lg transition-all"
              >
                {link.name}
              </Link>
            )
          ))}
          <button
            onClick={() => {
              setIsOpen(false);
              window.dispatchEvent(new CustomEvent('open-ai-assistant'));
            }}
            className="block w-full text-left px-3 py-4 text-base font-medium text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/5 rounded-lg transition-all"
          >
            AI Assistant
          </button>
          <a
            href="/#contact"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-4 text-base font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/5 rounded-lg transition-all"
          >
            Start a Project
          </a>
        </div>
      </div>
    </nav>
  );
};
