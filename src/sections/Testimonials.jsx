import React from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { Star, Quote } from 'lucide-react';
import { motion } from 'motion/react';

const testimonials = [
  {
    name: 'ISO-certified enterprise',
    role: 'USA',
    content: 'Aditya Raj Technologies transformed our legacy systems into a modern, scalable cloud architecture. Their expertise and dedication are unmatched.',
    rating: 5,
    image: 'https://picsum.photos/seed/usa/100/100',
  },
  {
    name: 'Healthcare solutions provider',
    role: 'North America',
    content: 'The AI-driven analytics platform they built for us exceeded all expectations. It has completely revolutionized how we understand our data.',
    rating: 5,
    image: 'https://picsum.photos/seed/healthcare/100/100',
  },
  {
    name: 'Globally recognized fintech company',
    role: 'UK',
    content: 'Professional, responsive, and incredibly talented. They delivered our enterprise web application on time and perfectly to spec.',
    rating: 5,
    image: 'https://picsum.photos/seed/fintech/100/100',
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-slate-50 relative overflow-hidden border-t border-gray-100">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-[120px]" />
      
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
              className="card-shadow p-8 relative group"
            >
              <Quote className="absolute top-6 right-6 text-emerald-600/5 w-12 h-12 group-hover:text-emerald-600/10 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-emerald-600 text-emerald-600" />
                ))}
              </div>
              
              <p className="text-gray-600 leading-relaxed mb-8 relative z-10 font-light italic">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-100"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-gray-900 font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
