import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, MapPin, Clock, ChevronRight, X, Send, CheckCircle } from 'lucide-react';

const jobs = [
  {
    id: 'java-fullstack',
    title: 'Senior Java Full Stack Developer (React)',
    experience: '8–10 years',
    location: 'Pune (Hybrid)',
    type: 'Full-time',
    description: 'Build and maintain enterprise-level applications using modern Java and React stacks.',
    responsibilities: [
      'Build and maintain enterprise-level applications',
      'Create backend using Java + Spring Boot',
      'Develop frontend using React.js',
      'Work in an Agile team environment',
      'Fix bugs and support live systems',
      'Modernize legacy systems'
    ],
    skills: {
      backend: ['Java (8/11/17)', 'Spring Boot', 'Spring MVC', 'Spring Security', 'REST APIs', 'Microservices', 'Hibernate / JPA', 'OAuth2', 'JWT'],
      frontend: ['React.js', 'JavaScript / TypeScript', 'Redux / Context API', 'HTML5', 'CSS3'],
      database: ['Oracle', 'SQL Server', 'NoSQL (optional)'],
      tools: ['Git', 'Jenkins', 'Docker', 'AWS / Azure', 'JUnit', 'Mockito', 'Jest']
    }
  },
  {
    id: 'gen-ai',
    title: 'Generative AI Engineer',
    experience: '7+ years',
    location: 'Gurgaon (Hybrid)',
    type: 'Full-time',
    description: 'Build cutting-edge AI applications using LLMs, RAG, and Agentic AI systems.',
    responsibilities: [
      'Build AI applications using LLMs',
      'Work on RAG, NLP, and ML models',
      'Create Agentic AI systems',
      'Use Python for AI development',
      'Deploy projects using CI/CD',
      'Work with OCR and image processing'
    ],
    skills: {
      core: ['Generative AI', 'LLMs', 'Python (Expert)', 'Machine Learning', 'Agentic AI', 'MCP'],
      vision: ['OCR', 'Image Processing'],
      devops: ['Docker', 'Kubernetes', 'Jenkins']
    }
  },
  {
    id: 'ibm-sterling',
    title: 'IBM Sterling B2B Integrator Developer',
    experience: '5+ years',
    location: 'Hyderabad (Hybrid)',
    type: 'Full-time',
    description: 'Manage complex B2B integrations and business processes for global clients.',
    responsibilities: [
      'Build and manage B2B integrations',
      'Create business processes',
      'Handle file transfers between companies',
      'Monitor systems and fix issues',
      'Support production systems'
    ],
    skills: {
      core: ['IBM Sterling B2Bi', 'Business Process Development', 'Map Development', 'Sterling File Gateway'],
      ops: ['File Monitoring', 'Troubleshooting', 'Production Support']
    }
  },
  {
    id: 'opentext-sap',
    title: 'OpenText Archive Migration Specialist (SAP)',
    experience: '5+ years',
    location: 'Hyderabad (Hybrid)',
    type: 'Full-time',
    description: 'Lead data migration projects from legacy systems to cloud-based SAP environments.',
    responsibilities: [
      'Move data from legacy systems to cloud',
      'Work with SAP + OpenText integrations',
      'Test and validate migrated data',
      'Ensure data integrity and security',
      'Coordinate with cross-functional teams'
    ],
    skills: {
      core: ['OpenText Archive (Cloud & On-Prem)', 'SAP Integration', 'Data Migration'],
      process: ['Testing & Validation', 'Team Coordination', 'Project Management']
    }
  },
  {
    id: 'react-lead',
    title: 'Senior React.js Developer / Frontend Lead',
    experience: '5+ years',
    location: 'Pune (Hybrid)',
    type: 'Full-time',
    description: 'Lead frontend architecture and guide teams in building scalable, high-performance UIs.',
    responsibilities: [
      'Lead frontend development initiatives',
      'Design scalable UI architecture',
      'Mentor and guide team members',
      'Collaborate with product and design teams',
      'Optimize UI performance and quality'
    ],
    skills: {
      core: ['React.js (Expert)', 'JavaScript / TypeScript', 'HTML5', 'CSS3'],
      advanced: ['API Integration', 'UI Performance Optimization', 'Code Quality Practices', 'Architecture Design']
    }
  }
];

export const Careers = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [formStatus, setFormStatus] = useState('idle'); // idle, sending, success

  const handleApply = (e) => {
    e.preventDefault();
    setFormStatus('sending');
    setTimeout(() => {
      setFormStatus('success');
      setTimeout(() => {
        setIsApplying(false);
        setSelectedJob(null);
        setFormStatus('idle');
      }, 2000);
    }, 1500);
  };

  return (
    <section id="careers" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium"
          >
            <Briefcase size={16} />
            <span>Careers at AadhyaRaj</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-50">Join Our Expert Team</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            We're looking for passionate innovators to help us build the next generation of digital solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 md:p-8 group cursor-pointer"
              onClick={() => setSelectedJob(job)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                      {job.experience}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-medium border border-slate-700">
                      {job.type}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-50 group-hover:text-emerald-400 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-emerald-500" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-emerald-500" />
                      Posted recently
                    </div>
                  </div>
                </div>
                <button className="btn-secondary whitespace-nowrap group-hover:bg-emerald-500 group-hover:text-slate-950 group-hover:border-emerald-500">
                  View Details
                  <ChevronRight className="ml-2" size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Job Details Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-12 shadow-2xl"
            >
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                      {selectedJob.experience} Exp
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-medium border border-slate-700">
                      {selectedJob.location}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold text-slate-50">{selectedJob.title}</h2>
                  <p className="text-base md:text-lg text-slate-400">{selectedJob.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <div className="space-y-6">
                    <h4 className="text-lg md:text-xl font-bold text-slate-50 flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                      Key Responsibilities
                    </h4>
                    <ul className="space-y-3">
                      {selectedJob.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-400 text-sm md:text-base">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500/50 shrink-0" />
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-lg md:text-xl font-bold text-slate-50 flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                      Technical Skills
                    </h4>
                    <div className="space-y-4">
                      {Object.entries(selectedJob.skills).map(([category, list]) => (
                        <div key={category}>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-2">{category}</p>
                          <div className="flex flex-wrap gap-2">
                            {list.map((skill, i) => (
                              <span key={i} className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px] md:text-xs border border-slate-700">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => setIsApplying(true)}
                    className="w-full md:w-auto btn-primary"
                  >
                    Apply for this Position
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Application Form Modal */}
      <AnimatePresence>
        {isApplying && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsApplying(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl"
            >
              <button
                onClick={() => setIsApplying(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              {formStatus === 'success' ? (
                <div className="text-center py-12 space-y-6">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                    <CheckCircle size={48} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-50">Application Sent!</h3>
                    <p className="text-slate-400">Our HR team will review your profile and get back to you soon.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-50">Apply for {selectedJob?.title}</h3>
                    <p className="text-sm md:text-base text-slate-400">Please fill in your details below.</p>
                  </div>

                  <form onSubmit={handleApply} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs md:text-sm font-medium text-slate-300">Full Name</label>
                        <input
                          required
                          type="text"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:border-emerald-500 outline-none transition-colors text-sm"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs md:text-sm font-medium text-slate-300">Email Address</label>
                        <input
                          required
                          type="email"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:border-emerald-500 outline-none transition-colors text-sm"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs md:text-sm font-medium text-slate-300">Experience (Years)</label>
                      <input
                        required
                        type="number"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:border-emerald-500 outline-none transition-colors text-sm"
                        placeholder="e.g. 5"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs md:text-sm font-medium text-slate-300">Resume Link (Drive/Dropbox)</label>
                      <input
                        required
                        type="url"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:border-emerald-500 outline-none transition-colors text-sm"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs md:text-sm font-medium text-slate-300">Message (Optional)</label>
                      <textarea
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:border-emerald-500 outline-none transition-colors min-h-[80px] text-sm"
                        placeholder="Tell us why you're a great fit..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className="w-full btn-primary flex items-center justify-center gap-2 py-3"
                    >
                      {formStatus === 'sending' ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send size={18} />
                          Submit Application
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
