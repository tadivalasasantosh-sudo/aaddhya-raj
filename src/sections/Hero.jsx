import React from 'react';
import { ArrowRight, ChevronRight, Sparkles, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold tracking-wide uppercase">
              <Sparkles size={16} className="text-emerald-600" />
              Enterprise Technology Partner
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.05] text-gray-900 tracking-tight">
              Empowering Your <span className="text-emerald-600">Digital Future</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl font-light">
              Aditya Raj Technologies delivers high-impact digital transformation through advanced software engineering, cloud architecture, and AI-driven business intelligence.
            </p>
            
            <div className="flex flex-wrap gap-5 pt-2">
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary group px-10 py-4"
              >
                Start Your Journey
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              <button 
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary px-10 py-4"
              >
                Explore Services
              </button>
            </div>

            <div className="flex items-center gap-12 pt-10 border-t border-gray-100">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gray-900">250+</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-medium">Successful Projects</div>
              </div>
              <div className="w-px h-12 bg-gray-100" />
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gray-900">12+</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-medium">Industry Awards</div>
              </div>
            </div>

            <div className="pt-10">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Trusted by Industry Leaders</p>
              <div className="flex flex-wrap gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                {['Microsoft', 'Google', 'Amazon', 'Oracle'].map((brand) => (
                  <span key={brand} className="text-lg font-display font-bold text-gray-900 hover:text-emerald-600 transition-colors">{brand}</span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 animate-float">
              <div className="absolute -inset-4 bg-emerald-600/5 rounded-[40px] blur-2xl" />
              <img 
                src="https://picsum.photos/seed/enterprise-tech/1000/800" 
                alt="Aditya Raj Technologies Enterprise Solutions" 
                className="relative rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 object-cover w-full h-[600px]"
                referrerPolicy="no-referrer"
              />
              
              {/* Floating badges */}
              <div className="absolute -bottom-8 -left-8 p-6 bg-white rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] border border-gray-100 flex items-center gap-5 backdrop-blur-sm bg-white/90">
                <div className="w-14 h-14 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
                  <CheckCircle size={28} />
                </div>
                <div>
                  <div className="text-base font-bold text-gray-900">ISO 27001</div>
                  <div className="text-xs text-gray-500 font-medium">Certified Security Standards</div>
                </div>
              </div>

              <div className="absolute -top-8 -right-8 p-5 bg-white rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] border border-gray-100 flex items-center gap-4 backdrop-blur-sm bg-white/90">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Sparkles size={20} />
                </div>
                <div className="text-sm font-bold text-gray-900">AI-Powered</div>
              </div>
            </div>
            
            {/* Decorative background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-600/5 rounded-full blur-[120px] -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
