import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const reasons = [
  {
    title: 'Proven Track Record',
    description: 'With over 500+ successful projects delivered, we have the experience to handle complex challenges and deliver results.',
  },
  {
    title: 'Expert Team of Developers',
    description: 'Our team consists of highly skilled professionals specializing in Java, React, Node.js, and Cloud technologies.',
  },
  {
    title: 'Client-Centric Approach',
    description: 'We prioritize your business goals, ensuring our solutions align perfectly with your vision and requirements.',
  },
  {
    title: 'Agile Methodology',
    description: 'We use agile practices to ensure flexibility, transparency, and rapid delivery of high-quality software.',
  },
  {
    title: '24/7 Support & Maintenance',
    description: 'Our commitment doesn\'t end at launch. We provide ongoing support to ensure your systems run smoothly.',
  },
  {
    title: 'Competitive Pricing',
    description: 'We offer premium quality services at competitive rates, providing excellent return on your investment.',
  },
];

export const WhyChooseUs = () => {
  return (
    <section id="why-choose-us" className="py-24 bg-slate-950 relative overflow-hidden border-t border-slate-800/50">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-50 mb-6">
              Why Partner With <span className="glow-text">AadhyaRaj Technologies?</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8 font-light">
              We don't just build software; we build solutions that drive your business forward. Our combination of technical expertise, industry experience, and dedication to client success sets us apart.
            </p>
            
            <div className="space-y-6">
              {reasons.slice(0, 3).map((reason, index) => (
                <div key={index} className="flex gap-4">
                  <div className="mt-1 text-emerald-500 shrink-0">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-slate-50 font-semibold text-lg mb-2">{reason.title}</h4>
                    <p className="text-slate-400 font-light">{reason.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 md:p-12 relative"
          >
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-600/20 rounded-full blur-[40px]" />
            
            <div className="space-y-8 relative z-10">
              {reasons.slice(3).map((reason, index) => (
                <div key={index} className="flex gap-4">
                  <div className="mt-1 text-emerald-400 shrink-0">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-slate-50 font-semibold text-lg mb-2">{reason.title}</h4>
                    <p className="text-slate-400 font-light">{reason.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
