import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { motion } from 'motion/react';

const technologies = [
  {
    category: 'Frontend',
    skills: ['React.js', 'Next.js', 'Vue.js', 'Angular', 'Tailwind CSS', 'TypeScript'],
  },
  {
    category: 'Backend',
    skills: ['Node.js', 'Java', 'Spring Boot', 'Python', 'Express.js', 'GraphQL'],
  },
  {
    category: 'Database',
    skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 'ElasticSearch'],
  },
  {
    category: 'Cloud & DevOps',
    skills: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD'],
  },
  {
    category: 'AI & Machine Learning',
    skills: ['TensorFlow', 'PyTorch', 'OpenAI', 'LangChain', 'Computer Vision', 'NLP'],
  },
  {
    category: 'Mobile',
    skills: ['React Native', 'Flutter', 'iOS (Swift)', 'Android (Kotlin)'],
  },
];

export const TechStack = () => {
  return (
    <section id="tech-stack" className="py-24 bg-white relative overflow-hidden border-t border-gray-100">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-[120px] -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          title="Our Technology Stack"
          subtitle="We leverage the latest and most robust technologies to build scalable, secure, and future-proof solutions."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-shadow p-8 group"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.2)]" />
                {tech.category}
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {tech.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-3 py-1.5 text-sm rounded-lg bg-gray-50 text-gray-600 border border-gray-100 group-hover:border-emerald-500/30 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
