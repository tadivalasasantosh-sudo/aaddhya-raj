import React, { useState, useEffect } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import ApplyForm from '../components/ApplyForm';
import { motion } from 'motion/react';
import { MapPin, Clock, Code, ChevronRight } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const Careers = () => {
  const [activeJobId, setActiveJobId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching jobs:", err);
      setError("Failed to load career opportunities. Please try again later.");
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleApplyClick = (jobId) => {
    setActiveJobId(activeJobId === jobId ? null : jobId);
  };

  return (
    <section id="careers" className="py-24 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          title="Career Opportunities"
          subtitle="Join Aadhyaraj Technologies and help us build the future. Explore our open positions below."
        />

        {loading ? (
          <div className="text-center text-gray-400 py-10">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            Loading opportunities...
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-10 bg-red-400/5 rounded-2xl border border-red-400/20 max-w-md mx-auto">
            {error}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-400 py-10 bg-white/5 rounded-2xl border border-white/10 max-w-md mx-auto">
            No open positions at the moment. Please check back later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-blue-500/30 transition-all flex flex-col h-full"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-4">{job.title}</h3>
                  
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-blue-400" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={16} className="text-purple-400" />
                      <span>{job.experience}</span>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-6 leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>

                  {job.skills && job.skills.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-1.5 mb-3 text-sm font-medium text-gray-300">
                        <Code size={16} className="text-cyan-400" />
                        <span>Key Skills</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => handleApplyClick(job.id || index)}
                  className="mt-auto w-full py-3 rounded-xl bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-transparent text-white font-medium transition-all flex items-center justify-center gap-2 group"
                >
                  {activeJobId === (job.id || index) ? "Close Application" : "Apply for this role"}
                  <ChevronRight size={16} className={`transition-transform ${activeJobId === (job.id || index) ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                </button>

                {activeJobId === (job.id || index) && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <ApplyForm preSelectedRole={job.title} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
