import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot, getDocs, getDocFromServer } from 'firebase/firestore';
import { 
  Briefcase, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Clock,
  ExternalLink,
  Mail,
  User
} from 'lucide-react';
import { motion } from 'motion/react';
import { handleFirestoreError, OperationType } from '../lib/firebase-errors';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    messages: 0,
    unreadMessages: 0,
    totalViews: 1240, // Mock for now
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const projectsSnap = await getDocs(collection(db, 'projects'));
        const messagesSnap = await getDocs(collection(db, 'messages'));
        const unread = messagesSnap.docs.filter(doc => !doc.data().read).length;
        
        setStats(prev => ({
          ...prev,
          projects: projectsSnap.size,
          messages: messagesSnap.size,
          unreadMessages: unread,
        }));
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'stats');
      }
    };

    const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(5));
    const messagesQuery = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(5));

    const unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => {
      setRecentProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'projects');
    });

    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      setRecentMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'messages');
    });

    fetchStats();
    setLoading(false);

    return () => {
      unsubscribeProjects();
      unsubscribeMessages();
    };
  }, []);

  const statCards = [
    { label: 'Total Projects', value: stats.projects, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10', trend: '+12%', trendUp: true },
    { label: 'Total Messages', value: stats.messages, icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-500/10', trend: '+8%', trendUp: true },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: Mail, color: 'text-red-400', bg: 'bg-red-500/10', trend: '-2%', trendUp: false },
    { label: 'Total Views', value: stats.totalViews, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10', trend: '+24%', trendUp: true },
  ];

  if (loading) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-gray-400">
          <Calendar size={16} />
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass-card p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                {stat.trend}
                {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card flex flex-col"
        >
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Recent Projects</h3>
            <button className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">View All</button>
          </div>
          <div className="p-4 flex-1 space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 shrink-0">
                  <img 
                    src={project.imageUrl || `https://picsum.photos/seed/${project.id}/100/100`} 
                    alt={project.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">{project.title}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">{project.category}</div>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} />
                  {project.createdAt?.toDate().toLocaleDateString()}
                </div>
                <button className="p-2 text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                  <ExternalLink size={16} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card flex flex-col"
        >
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Recent Messages</h3>
            <button className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">View All</button>
          </div>
          <div className="p-4 flex-1 space-y-4">
            {recentMessages.map((message) => (
              <div key={message.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center text-blue-400 shrink-0">
                  <User size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold text-white truncate">{message.name}</div>
                    {!message.read && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{message.subject}</div>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} />
                  {message.createdAt?.toDate().toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
