import React from 'react';
import { ArrowRight, ChevronRight, Sparkles, CheckCircle, Globe, MousePointer2 } from 'lucide-react';
import { motion } from 'motion/react';

export const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden bg-[#0f172a] text-white text-center">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 flex flex-col items-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium tracking-wide">
            <Globe size={16} className="text-emerald-500" />
            Global IT Solutions Partner
          </div>
          
          {/* Main Title */}
          <h1 className="text-4xl md:text-7xl font-display font-bold leading-[1.15] text-white tracking-tight max-w-3xl">
            Innovative IT Solutions & <br />
            <span className="text-[#00d1ff]">Recruitment Excellence</span>
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl font-light">
            Empowering businesses with end-to-end IT staffing, software development, and digital transformation services across 6 global offices.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
            <button 
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-4 rounded-xl bg-[#00d1ff] text-[#020617] font-bold text-lg hover:bg-[#00b8e6] transition-all shadow-lg shadow-[#00d1ff]/20 active:scale-95"
            >
              View Our Services
            </button>
            <button 
              onClick={() => document.getElementById('careers')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-4 rounded-xl border-2 border-[#00d1ff]/30 text-[#00d1ff] font-bold text-lg hover:bg-[#00d1ff]/5 transition-all active:scale-95"
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
            className="w-1 h-2 bg-emerald-500 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};
