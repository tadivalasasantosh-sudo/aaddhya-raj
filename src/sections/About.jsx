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
    }, (error) => {
      console.error('About Content Error:', error);
      // Don't throw here to avoid crashing the whole app
    });
    return () => unsubscribe();
  }, []);

  const values = [
    {
      title: 'Our Mission',
      description: aboutData.mission || 'To empower businesses through innovative technology solutions that drive growth and efficiency.',
      icon: Target,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
    },
    {
      title: 'Our Vision',
      description: aboutData.vision || 'To be the global leader in providing cutting-edge technology solutions that transform industries.',
      icon: Eye,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
    },
    {
      title: 'Quality First',
      description: 'We maintain the highest standards of code quality and design excellence in every project we undertake.',
      icon: Award,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
    },
    {
      title: 'Innovation',
      description: 'Constantly exploring emerging technologies to keep our clients ahead of the curve in a rapidly evolving market.',
      icon: Rocket,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
    },
  ];

  return (
    <section id="about" className="py-32 bg-white relative overflow-hidden border-t border-gray-100">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-sky-50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-100 text-sky-600 text-sm font-semibold tracking-wide uppercase">
              About Our Company
            </div>
            
            <h2 className="text-4xl md:text-6xl font-display font-bold text-gray-900 leading-tight tracking-tight">
              {aboutData.title}
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed font-light">
              {aboutData.description}
            </p>

            <div className="flex justify-center gap-12 pt-4">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-sky-600">10+</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Years of Excellence</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-sky-600">250+</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Global Projects</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-gray-50 border border-gray-100 shadow-sm hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`w-14 h-14 rounded-2xl ${value.bg.replace('emerald', 'sky')} ${value.color.replace('emerald', 'sky')} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300`}>
                <value.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-sky-600 transition-colors">{value.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed font-light">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
