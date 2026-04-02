import React from 'react';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden hero-gradient">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-green-400">
              <Sparkles size={16} />
              <span>Next-Gen IT Solutions</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-50 leading-[1.1]">
              Innovating the <br />
              <span className="glow-text">
                Digital Frontier
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 leading-relaxed max-w-xl font-light">
              AadhyaRaj Technologies delivers scalable, secure, and high-performance digital solutions to help businesses grow and transform digitally.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact" className="btn-primary group">
                Start Your Project
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </a>
              <a href="#about" className="btn-secondary">
                Learn More
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-8 pt-8 border-t border-white/10">
              <div>
                <div className="text-xl md:text-2xl font-bold text-white">500+</div>
                <div className="text-[10px] md:text-sm text-gray-500 uppercase tracking-wider">Projects Delivered</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-white">99%</div>
                <div className="text-[10px] md:text-sm text-gray-500 uppercase tracking-wider">Client Satisfaction</div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-xl md:text-2xl font-bold text-white">24/7</div>
                <div className="text-[10px] md:text-sm text-gray-500 uppercase tracking-wider">Expert Support</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 glass-card p-4 animate-float">
              <img
                src="https://picsum.photos/seed/tech/800/600"
                alt="Technology Visualization"
                className="rounded-xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -left-6 glass-card p-6 border-green-500/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    <ChevronRight size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">AI-Powered Analytics</div>
                    <div className="text-xs text-gray-500">Real-time processing</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-white/5 rounded-full -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
