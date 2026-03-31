import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Briefcase, Users, UserCheck } from 'lucide-react';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCandidates: 0,
    activeHR: 0
  });
  const [loading, setLoading] = useState(true);
  const portalUser = JSON.parse(localStorage.getItem('portalUser') || '{}');
  const isAdmin = portalUser.role === 'admin';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const headers = { 'x-user-email': portalUser.email };
        
        const [jobsRes, candidatesRes] = await Promise.all([
          fetch('/api/jobs', { headers }),
          fetch('/api/candidates', { headers })
        ]);

        const jobs = await jobsRes.json();
        const candidates = await candidatesRes.json();
        
        let users = [];
        if (isAdmin) {
          const usersRes = await fetch('/api/users', { headers });
          users = await usersRes.json();
        }

        setStats({
          totalJobs: Array.isArray(jobs) ? jobs.length : 0,
          totalCandidates: Array.isArray(candidates) ? candidates.length : 0,
          activeHR: Array.isArray(users) ? users.filter(u => u.role === 'hr' && u.active).length : 0
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin, portalUser.email]);

  const statCards = [
    { title: 'Total Jobs', value: stats.totalJobs, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'Total Candidates', value: stats.totalCandidates, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  if (isAdmin) {
    statCards.push({ title: 'Active HR Users', value: stats.activeHR, icon: UserCheck, color: 'text-green-400', bg: 'bg-green-500/10' });
  }

  if (loading) {
    return <div className="text-gray-400">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back, {portalUser.name}</h1>
        <p className="text-gray-400">Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={24} className={stat.color} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.title}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
