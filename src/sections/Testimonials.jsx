import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, ShieldCheck, Activity, Building2 } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';

const testimonials = [
  {
    quote: "AadhyaRaj Technologies transformed our legacy systems into a modern, scalable cloud architecture. Their expertise and dedication are unmatched.",
    author: "ISO-certified enterprise",
    location: "USA",
    icon: ShieldCheck,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    quote: "The AI-driven analytics platform they built for us exceeded all expectations. It has completely revolutionized how we understand our data.",
    author: "Healthcare solutions provider",
    location: "North America",
    icon: Activity,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    quote: "Professional, responsive, and incredibly talented. They delivered our enterprise web application on time and perfectly to spec.",
    author: "Globally recognized fintech company",
    location: "UK",
    icon: Building2,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  }
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-[#0f172a] relative overflow-hidden border-t border-white/5">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-4"
          >
            Client Success Stories
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto mb-6"
          >
            Don't just take our word for it. Here's what our partners have to say about working with us.
          </motion.p>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full origin-center"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 p-8 rounded-3xl border border-white/10 shadow-sm hover:bg-white/10 transition-all duration-500 group relative"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-emerald-500 text-emerald-500" />
                ))}
              </div>

              <Quote className="absolute top-8 right-8 text-white/5 group-hover:text-white/10 transition-colors duration-500" size={64} />

              <p className="text-gray-300 text-lg italic leading-relaxed mb-8 relative z-10">
                "{item.quote}"
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <div className={`w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-500`}>
                  <item.icon size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-white leading-tight">{item.author}</h4>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{item.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
