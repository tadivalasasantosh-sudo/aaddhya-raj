import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { Cloud, MonitorSmartphone, BrainCircuit, AppWindow, Smartphone, GitMerge, Wifi, Users, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

const services = [
  {
    title: 'Cloud Services',
    description: 'End-to-end cloud solutions to help businesses migrate, manage, and scale on cloud platforms like AWS, Azure, and Google Cloud.',
    icon: Cloud,
    color: 'from-sky-500 to-teal-500',
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
    color: 'from-sky-500 to-sky-700',
  },
  {
    title: 'Business Applications',
    description: 'Build and integrate enterprise-grade applications to streamline operations and enhance overall business performance.',
    icon: AppWindow,
    color: 'from-teal-500 to-sky-500',
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
    color: 'from-sky-400 to-sky-600',
  },
  {
    title: 'Talent Services',
    description: 'Provide skilled white team members, staffing solutions, and resource-as-a-service to support business growth.',
    icon: Users,
    color: 'from-pink-500 to-rose-500',
  },
];

export const Services = () => {
  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          title="Our Services"
          subtitle="Comprehensive technology solutions to drive your business forward in the digital age."
          dark={false}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 mb-6 group-hover:scale-110 transition-all duration-300">
                <service.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed font-light mb-6">
                {service.description}
              </p>
              <div className="flex items-center gap-2 text-sky-600 font-semibold text-sm hover:gap-3 transition-all cursor-pointer">
                Learn More <ChevronRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
