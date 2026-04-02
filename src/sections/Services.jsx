import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { Cloud, MonitorSmartphone, BrainCircuit, AppWindow, Smartphone, GitMerge, Wifi, Users } from 'lucide-react';
import { motion } from 'motion/react';

const services = [
  {
    title: 'Cloud Services',
    description: 'End-to-end cloud solutions to help businesses migrate, manage, and scale on cloud platforms like AWS, Azure, and Google Cloud.',
    icon: Cloud,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Modern Workplace',
    description: 'Empowering employees with smart digital tools, collaboration platforms, and secure remote working environments.',
    icon: MonitorSmartphone,
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Cloud Analytics & AI',
    description: 'Leverage data with advanced analytics and AI to gain real-time insights, improve decision-making, and predict future trends.',
    icon: BrainCircuit,
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Business Applications',
    description: 'Build and integrate enterprise-grade applications to streamline operations and enhance overall business performance.',
    icon: AppWindow,
    color: 'from-indigo-500 to-blue-500',
  },
  {
    title: 'Mobility Solutions',
    description: 'Develop mobile-friendly solutions to improve accessibility, user experience, and business connectivity on the go.',
    icon: Smartphone,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    title: 'DevOps Services',
    description: 'Accelerate development with CI/CD pipelines, automation, and cloud-based DevOps practices for faster delivery.',
    icon: GitMerge,
    color: 'from-red-500 to-orange-500',
  },
  {
    title: 'Internet of Things (IoT)',
    description: 'Design scalable IoT solutions to connect devices, collect data, and improve operational efficiency.',
    icon: Wifi,
    color: 'from-teal-500 to-emerald-500',
  },
  {
    title: 'Talent Services',
    description: 'Provide skilled professionals, staffing solutions, and resource-as-a-service to support business growth.',
    icon: Users,
    color: 'from-pink-500 to-rose-500',
  },
];

export const Services = () => {
  return (
    <section id="services" className="py-24 bg-slate-950 relative overflow-hidden">
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
              className="glass-card group p-8"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300">
                <service.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-50 mb-4 group-hover:text-emerald-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-400 leading-relaxed font-light">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
