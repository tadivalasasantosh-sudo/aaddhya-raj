import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { Target, Users, Award, Rocket } from 'lucide-react';
import { motion } from 'motion/react';

const values = [
  {
    title: 'Our Mission',
    description: 'To empower businesses through innovative technology solutions that drive growth and efficiency.',
    icon: Target,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    title: 'Expert Team',
    description: 'A diverse group of passionate engineers, designers, and strategists dedicated to your success.',
    icon: Users,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
  {
    title: 'Quality First',
    description: 'We maintain the highest standards of code quality and design excellence in every project.',
    icon: Award,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    title: 'Innovation',
    description: 'Constantly exploring emerging technologies to keep our clients ahead of the curve.',
    icon: Rocket,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
  },
];

export const About = () => {
  return (
    <section id="about" className="py-24 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <SectionHeader
              title="About AadhyaRaj Technologies"
              subtitle="We are more than just an IT company. We are your strategic partner in digital transformation."
              centered={false}
              className="mb-0"
            />
            <p className="text-gray-400 text-lg leading-relaxed">
              Founded with a vision to bridge the gap between complex technology and business needs, AadhyaRaj Technologies has grown into a leading provider of innovative IT solutions. We specialize in building scalable systems that solve real-world problems.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              Our approach combines technical expertise with a deep understanding of business strategy, ensuring that every solution we deliver provides maximum value to our clients.
            </p>
            <div className="flex gap-4 pt-4">
              <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-white">10+</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">Years Experience</div>
              </div>
              <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-white">200+</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">Global Clients</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden glass-card p-4">
              <img
                src="https://picsum.photos/seed/office/800/800"
                alt="Our Office"
                className="w-full h-full object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-purple-600/20 rounded-full blur-[60px] -z-10" />
            <div className="absolute -top-8 -left-8 w-48 h-48 bg-blue-600/20 rounded-full blur-[60px] -z-10" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-8 group hover:border-white/20 transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl ${value.bg} ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <value.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
