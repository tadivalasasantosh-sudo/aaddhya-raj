import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { Cloud, Code, Shield, Cpu, Globe, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

const services = [
  {
    title: 'Cloud Infrastructure',
    description: 'Scalable, secure, and high-performance cloud solutions tailored to your business needs.',
    icon: Cloud,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Custom Software',
    description: 'Bespoke software development using the latest technologies and agile methodologies.',
    icon: Code,
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Cyber Security',
    description: 'Comprehensive security audits and implementation to protect your digital assets.',
    icon: Shield,
    color: 'from-red-500 to-orange-500',
  },
  {
    title: 'AI & Machine Learning',
    description: 'Intelligent automation and data-driven insights to transform your operations.',
    icon: Cpu,
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Web Development',
    description: 'Modern, responsive, and high-converting websites and web applications.',
    icon: Globe,
    color: 'from-indigo-500 to-blue-500',
  },
  {
    title: 'Mobile Solutions',
    description: 'Native and cross-platform mobile apps for iOS and Android devices.',
    icon: Smartphone,
    color: 'from-yellow-500 to-orange-500',
  },
];

export const Services = () => {
  return (
    <section id="services" className="py-24 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          title="Our Services"
          subtitle="Comprehensive technology solutions to drive your business forward in the digital age."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card group p-8 hover:border-white/20 transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} p-0.5 mb-6 group-hover:scale-110 transition-transform`}>
                <div className="w-full h-full rounded-[14px] bg-black flex items-center justify-center text-white">
                  <service.icon size={28} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
