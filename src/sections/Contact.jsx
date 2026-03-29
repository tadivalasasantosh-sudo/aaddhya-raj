import React, { useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocFromServer } from 'firebase/firestore';
import { Send, CheckCircle, AlertCircle, Mail, Phone, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { handleFirestoreError, OperationType } from '../lib/firebase-errors';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp(),
        read: false,
      });
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'messages');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-24 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          title="Get in Touch"
          subtitle="Ready to start your next project? Contact us today for a free consultation."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white">Contact Information</h3>
              <p className="text-gray-400 max-w-md">
                Have a question or need a custom solution? Our team is ready to help you navigate your digital transformation.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { icon: Mail, label: 'Email', value: 'contact@aadhyaraj.tech', color: 'text-blue-400' },
                { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', color: 'text-purple-400' },
                { icon: MapPin, label: 'Office', value: '123 Tech Avenue, Silicon Valley, CA 94025', color: 'text-cyan-400' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-6 group">
                  <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-1">{item.label}</div>
                    <div className="text-lg font-semibold text-white">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10">
              <h4 className="text-xl font-bold text-white mb-4">Business Hours</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="text-white">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="text-white">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="text-blue-400">Closed</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Your Name</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Subject</label>
                <input
                  required
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  placeholder="How can we help?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 ml-1">Message</label>
                <textarea
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                disabled={status === 'sending'}
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(147,51,234,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>

              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400"
                  >
                    <CheckCircle size={20} />
                    <span>Message sent successfully! We'll get back to you soon.</span>
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"
                  >
                    <AlertCircle size={20} />
                    <span>Failed to send message. Please try again later.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
