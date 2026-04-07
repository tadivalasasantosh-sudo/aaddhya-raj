import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
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
  const [isCareersOpen, setIsCareersOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
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
    { name: 'Testimonials', path: '/#testimonials' },
    { name: 'Tech Stack', path: '/#tech-stack' },
    { 
      name: 'Careers', 
      path: '/#careers',
      submenu: [
        { name: 'Careers', path: '/#careers' },
        { 
          name: user ? (userRole === 'hr' ? 'HR Portal' : 'Admin Dashboard') : 'Admin Portal', 
          path: user ? '/admin' : '/login' 
        }
      ]
    },
    { name: 'About', path: '/#about' },
    { 
      name: 'Contact', 
      path: '/#contact',
      submenu: [
        { name: 'Contact Us', path: '/#contact' },
        { name: 'Email: tag@aadhyarajtech.com', path: 'mailto:tag@aadhyarajtech.com' },
        { name: 'Phone: +91 9127912345', path: 'tel:+919127912345' },
        { name: 'AadhyaRaj Technologies', path: '/#contact' }
      ]
    },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white",
      scrolled ? "py-3" : "py-5"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/">
              <CompanyLogo size="md" />
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                link.submenu ? (
                  <div 
                    key={link.name}
                    className="relative group"
                    onMouseEnter={() => link.name === 'Careers' ? setIsCareersOpen(true) : setIsContactOpen(true)}
                    onMouseLeave={() => link.name === 'Careers' ? setIsCareersOpen(false) : setIsContactOpen(false)}
                  >
                    <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-sky-600 transition-colors">
                      {link.name}
                      <ChevronDown size={14} className={cn("transition-transform duration-200", (link.name === 'Careers' ? isCareersOpen : isContactOpen) && "rotate-180")} />
                    </button>
                    <div className={cn(
                      "absolute top-full left-0 mt-2 w-64 py-2 bg-white rounded-xl shadow-xl border border-gray-100 transition-all duration-200 origin-top",
                      (link.name === 'Careers' ? isCareersOpen : isContactOpen) ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    )}>
                      {link.submenu.map((sub) => (
                        sub.path.startsWith('/#') ? (
                          <a
                            key={sub.name}
                            href={sub.path}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                          >
                            {sub.name}
                          </a>
                        ) : sub.path.startsWith('mailto:') || sub.path.startsWith('tel:') ? (
                          <a
                            key={sub.name}
                            href={sub.path}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                          >
                            {sub.name}
                          </a>
                        ) : (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                          >
                            {sub.name}
                          </Link>
                        )
                      ))}
                    </div>
                  </div>
                ) : (
                  link.path.startsWith('/#') ? (
                    <a
                      key={link.name}
                      href={link.path}
                      className="text-sm font-medium text-gray-600 hover:text-sky-600 transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="text-sm font-medium text-gray-600 hover:text-sky-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  )
                )
              ))}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-ai-assistant'))}
                className="text-sm font-medium text-gray-600 hover:text-sky-600 transition-colors"
              >
                AI Assistant
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="#contact"
              className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-sky-600 rounded-full hover:bg-sky-700 transition-all duration-300 active:scale-95"
            >
              Get Started
            </a>
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-sm font-medium text-red-600 hover:bg-red-100 transition-all"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-sky-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className={cn(
        "md:hidden absolute top-full left-0 right-0 bg-white transition-all duration-300 overflow-hidden",
        isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            link.submenu ? (
              <div key={link.name} className="space-y-1">
                <div className="px-3 py-4 text-base font-medium text-gray-400 uppercase tracking-widest text-[10px]">
                  {link.name}
                </div>
                {link.submenu.map((sub) => (
                  sub.path.startsWith('/#') ? (
                    <a
                      key={sub.name}
                      href={sub.path}
                      onClick={() => setIsOpen(false)}
                      className="block px-6 py-3 text-base font-medium text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                    >
                      {sub.name}
                    </a>
                  ) : sub.path.startsWith('mailto:') || sub.path.startsWith('tel:') ? (
                    <a
                      key={sub.name}
                      href={sub.path}
                      onClick={() => setIsOpen(false)}
                      className="block px-6 py-3 text-base font-medium text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                    >
                      {sub.name}
                    </a>
                  ) : (
                    <Link
                      key={sub.name}
                      to={sub.path}
                      onClick={() => setIsOpen(false)}
                      className="block px-6 py-3 text-base font-medium text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                    >
                      {sub.name}
                    </Link>
                  )
                ))}
              </div>
            ) : (
              link.path.startsWith('/#') ? (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                >
                  {link.name}
                </Link>
              )
            )
          ))}
          <button
            onClick={() => {
              setIsOpen(false);
              window.dispatchEvent(new CustomEvent('open-ai-assistant'));
            }}
            className="block w-full text-left px-3 py-4 text-base font-medium text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-all"
          >
            AI Assistant
          </button>
        </div>
      </div>
    </nav>
  );
};
