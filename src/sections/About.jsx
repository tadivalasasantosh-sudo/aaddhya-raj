import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { SectionHeader } from '../components/SectionHeader';
import { Target, Users, Award, Rocket, Eye } from 'lucide-react';
import { motion } from 'motion/react';

export const About = () => {
  const [aboutData, setAboutData] = useState({
    title: 'About AadhyaRaj Technologies',
    description: 'AadhyaRaj Technologies is a modern technology company focused on building scalable, secure, and high-performance digital solutions. We specialize in full-stack development, enterprise application development, and AI-driven systems that help businesses grow and transform digitally.',
    mission: 'To empower businesses through innovative technology solutions that drive growth and efficiency.',
    vision: 'To be the global leader in providing cutting-edge technology solutions that transform industries.'
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'about', 'content'), (snapshot) => {
      if (snapshot.exists()) {
        setAboutData(snapshot.data());
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'about/content'));
    return () => unsubscribe();
  }, []);

  const values = [
    {
      title: 'Our Mission',
      description: aboutData.mission || 'To empower businesses through innovative technology solutions that drive growth and efficiency.',
      icon: Target,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Our Vision',
      description: aboutData.vision || 'To be the global leader in providing cutting-edge technology solutions that transform industries.',
      icon: Eye,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Quality First',
      description: 'We maintain the highest standards of code quality and design excellence in every project.',
      icon: Award,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Innovation',
      description: 'Constantly exploring emerging technologies to keep our clients ahead of the curve.',
      icon: Rocket,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ];

  return (
    <section id="about" className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8 text-center mb-24"
          >
            <SectionHeader
              title={aboutData.title}
              subtitle="We are more than just an IT company. We are your strategic partner in digital transformation."
              centered={true}
              className="mb-0"
            />
            <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-light">
              {aboutData.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="px-6 py-3 rounded-2xl bg-slate-900/50 border border-slate-800 min-w-[140px]">
                <div className="text-2xl font-bold text-slate-50">10+</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">Years Experience</div>
              </div>
              <div className="px-6 py-3 rounded-2xl bg-slate-900/50 border border-slate-800 min-w-[140px]">
                <div className="text-2xl font-bold text-slate-50">200+</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest">Global Clients</div>
              </div>
            </div>
          </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-8 group"
            >
              <div className={`w-14 h-14 rounded-2xl ${value.bg} ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300`}>
                <value.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-50 mb-4">{value.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
