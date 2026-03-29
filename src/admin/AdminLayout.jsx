import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate, Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight, 
  Settings, 
  Bell, 
  Search,
  User
} from 'lucide-react';
import { CompanyLogo } from '../components/CompanyLogo';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const AdminLayout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        navigate('/login');
      } else {
        setUser(u);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Projects', icon: Briefcase, path: '/admin/projects' },
    { name: 'Messages', icon: MessageSquare, path: '/admin/messages' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex text-gray-300">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 bg-black border-r border-white/5 transition-all duration-300 flex flex-col",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className={cn("transition-all duration-300", isSidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden")}>
            <CompanyLogo size="sm" />
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                location.pathname === item.path 
                  ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-white/10" 
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-colors",
                location.pathname === item.path ? "text-blue-400" : "group-hover:text-white"
              )} />
              <span className={cn(
                "font-medium transition-all duration-300",
                isSidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              )}>
                {item.name}
              </span>
              {location.pathname === item.path && isSidebarOpen && (
                <ChevronRight size={16} className="ml-auto text-blue-400" />
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <button className={cn(
            "flex items-center gap-4 px-4 py-3 w-full rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all",
            !isSidebarOpen && "justify-center"
          )}>
            <Settings size={20} />
            <span className={cn(
              "font-medium transition-all duration-300",
              isSidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            )}>Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-4 px-4 py-3 w-full rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all",
              !isSidebarOpen && "justify-center"
            )}
          >
            <LogOut size={20} />
            <span className={cn(
              "font-medium transition-all duration-300",
              isSidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            )}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300 min-h-screen flex flex-col",
        isSidebarOpen ? "ml-64" : "ml-20"
      )}>
        {/* Header */}
        <header className="h-20 bg-black/50 backdrop-blur-md border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-black" />
            </button>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-white">{user?.displayName || 'Admin'}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Super Admin</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 p-0.5">
                <div className="w-full h-full rounded-[9px] bg-black flex items-center justify-center overflow-hidden">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
