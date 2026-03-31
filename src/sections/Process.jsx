import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { Search, PenTool, Code2, Rocket, Settings } from 'lucide-react';
import { motion } from 'motion/react';

const steps = [
  {
    icon: Search,
    title: '1. Discovery & Planning',
    description: 'We start by understanding your business goals, target audience, and technical requirements to create a comprehensive project roadmap.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: PenTool,
    title: '2. Design & Prototyping',
    description: 'Our design team creates intuitive wireframes and high-fidelity prototypes, ensuring a seamless user experience before development begins.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Code2,
    title: '3. Agile Development',
    description: 'Our expert developers build your solution using modern technologies like React, Node.js, and Java, following agile methodologies for rapid delivery.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Rocket,
    title: '4. Testing & Deployment',
    description: 'Rigorous QA testing ensures your application is bug-free and secure before we deploy it to your preferred cloud infrastructure.',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    icon: Settings,
    title: '5. Maintenance & Support',
    description: 'We provide ongoing support, monitoring, and updates to ensure your software remains secure, performant, and up-to-date.',
    color: 'from-red-500 to-pink-500',
  },
];

export const Process = () => {
  return (
    <section id="process" className="py-24 bg-black relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          title="Our Development Process"
          subtitle="A proven, step-by-step methodology to ensure your project is delivered on time, within budget, and to the highest quality standards."
        />

        <div className="relative mt-16">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="glass-card p-6 h-full flex flex-col items-center text-center hover:border-white/20 transition-all relative z-10 bg-black/80 backdrop-blur-xl">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} p-0.5 mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white">
                      <step.icon size={28} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
