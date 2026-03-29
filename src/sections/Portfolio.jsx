import React, { useState, useEffect } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, getDocFromServer } from 'firebase/firestore';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { handleFirestoreError, OperationType } from '../lib/firebase-errors';

export const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'projects');
    });
    return () => unsubscribe();
  }, []);

  const categories = ['All', ...new Set(projects.map(p => p.category))];
  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section id="portfolio" className="py-24 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          title="Our Portfolio"
          subtitle="Explore our recent projects and success stories across various industries."
        />

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                filter === cat 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-600/20' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode='popLayout'>
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="glass-card group overflow-hidden"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={project.imageUrl || `https://picsum.photos/seed/${project.id}/800/600`}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                      {project.category}
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex gap-4">
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                            <ExternalLink size={20} />
                          </a>
                        )}
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                            <Github size={20} />
                          </a>
                        )}
                      </div>
                      <button className="flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                        Case Study
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};
