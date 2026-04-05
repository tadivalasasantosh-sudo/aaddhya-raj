import React from 'react';
import { ArrowRight, ChevronRight, Sparkles, CheckCircle, Globe, MousePointer2 } from 'lucide-react';
import { motion } from 'motion/react';

export const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden bg-[#0f172a] text-white text-center">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 flex flex-col items-center"
        >
          {/* Main Title */}
          <h1 className="text-4xl md:text-7xl font-display font-bold leading-[1.15] text-white tracking-tight max-w-3xl">
            Empowering Your <br />
            <span className="text-sky-500">Digital Future</span>
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl font-light">
            AadhyaRaj Technologies delivers high-impact digital transformation through advanced software engineering, cloud architecture, and AI-driven business intelligence.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
            <button 
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-4 rounded-xl bg-sky-500 text-white font-bold text-lg hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-95"
            >
              View Our Services
            </button>
            <button 
              onClick={() => document.getElementById('careers')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-4 rounded-xl border-2 border-sky-500/30 text-sky-500 font-bold text-lg hover:bg-sky-500/5 transition-all active:scale-95"
            >
              Start Your Journey
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-gray-500 flex justify-center p-1.5">
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-2 bg-sky-500 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};
