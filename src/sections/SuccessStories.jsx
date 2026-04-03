import React from 'react';
import { motion } from 'motion/react';
import { SectionHeader } from '../components/SectionHeader';
import { CheckCircle, Award, TrendingUp, ShieldCheck } from 'lucide-react';

export const SuccessStories = () => {
  const story = {
    client: "Health Care Solutions Private",
    industry: "Healthcare / ISO-Certified Enterprise",
    title: "Revolutionizing Patient Care with AI-Driven Analytics",
    description: "Health Care Solutions Private, a leading ISO-certified healthcare enterprise, partnered with Aditya Raj Technologies to modernize their legacy data systems. We implemented a secure, high-performance cloud architecture that integrated real-time patient data with predictive AI analytics.",
    results: [
      { label: "Data Processing Speed", value: "400%", icon: TrendingUp },
      { label: "Operational Efficiency", value: "65%", icon: CheckCircle },
      { label: "Security Compliance", value: "100%", icon: ShieldCheck },
      { label: "Patient Satisfaction", value: "92%", icon: Award },
    ],
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000", // Professional hospital/healthcare image
    logo: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=200", // Professional abstract logo (finance-style)
  };

  return (
    <section id="success-stories" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          title="Client Success Stories"
          subtitle="Real-world impact through innovative technology solutions."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Professional Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10">
              <div className="absolute -inset-4 bg-emerald-600/5 rounded-[40px] blur-2xl" />
              <img
                src={story.image}
                alt={story.client}
                className="relative rounded-[32px] shadow-2xl border border-gray-100 object-cover w-full h-[500px]"
                referrerPolicy="no-referrer"
              />
              
              {/* Floating ISO Badge */}
              <div className="absolute -bottom-6 -right-6 p-6 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 backdrop-blur-sm bg-white/90">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">ISO Certified</div>
                  <div className="text-xs text-gray-500 font-medium">Enterprise Standards</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Story Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 p-2 flex items-center justify-center overflow-hidden">
                <img 
                  src={story.logo} 
                  alt={`${story.client} Logo`} 
                  className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{story.client}</h3>
                <p className="text-emerald-600 font-medium text-sm uppercase tracking-widest">{story.industry}</p>
              </div>
            </div>

            <h4 className="text-3xl font-bold text-gray-900 leading-tight">
              {story.title}
            </h4>

            <p className="text-gray-600 text-lg leading-relaxed font-light">
              {story.description}
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              {story.results.map((result, index) => (
                <div key={index} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <result.icon size={20} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{result.value}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">{result.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
