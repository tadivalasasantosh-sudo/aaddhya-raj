import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { Star, Quote } from 'lucide-react';
import { motion } from 'motion/react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CTO, TechFlow Inc.',
    content: 'AadhyaRaj Technologies transformed our legacy systems into a modern, scalable cloud architecture. Their expertise and dedication are unmatched.',
    rating: 5,
    image: 'https://picsum.photos/seed/sarah/100/100',
  },
  {
    name: 'Michael Chen',
    role: 'Founder, DataSync',
    content: 'The AI-driven analytics platform they built for us exceeded all expectations. It has completely revolutionized how we understand our data.',
    rating: 5,
    image: 'https://picsum.photos/seed/michael/100/100',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Operations Director, GlobalRetail',
    content: 'Professional, responsive, and incredibly talented. They delivered our enterprise web application on time and perfectly to spec.',
    rating: 5,
    image: 'https://picsum.photos/seed/emily/100/100',
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-slate-950 relative overflow-hidden border-t border-slate-800/50">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          title="Client Success Stories"
          subtitle="Don't just take our word for it. Here's what our partners have to say about working with us."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-8 relative group"
            >
              <Quote className="absolute top-6 right-6 text-emerald-500/5 w-12 h-12 group-hover:text-emerald-500/10 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-emerald-500 text-emerald-500" />
                ))}
              </div>
              
              <p className="text-slate-300 leading-relaxed mb-8 relative z-10 font-light italic">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-800"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-slate-50 font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
