import React, { useState, useEffect } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { Send, CheckCircle, AlertCircle, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, onSnapshot, collection, addDoc } from 'firebase/firestore';

export const Contact = () => {
  const [settings, setSettings] = useState({
    contactEmail: 'tag@aadhyarajtech.com',
    whatsappNumber: '+91 9127912345'
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'global'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data());
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'settings/global');
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'new'
      });
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'messages');
      setStatus('error');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-24 bg-slate-950 relative overflow-hidden">
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
              <h3 className="text-3xl font-bold text-slate-50">Contact Information</h3>
              <p className="text-slate-400 max-w-md font-light">
                Have a question or need a custom solution? Our team is ready to help you navigate your digital transformation.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { icon: Mail, label: 'Email', value: settings.contactEmail, color: 'text-emerald-400', href: `mailto:${settings.contactEmail}` },
                { icon: Phone, label: 'Phone', value: settings.whatsappNumber, color: 'text-emerald-400', href: `tel:${settings.whatsappNumber}` },
                { icon: MessageCircle, label: 'WhatsApp', value: settings.whatsappNumber, color: 'text-emerald-500', href: `https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}` },
                { icon: MapPin, label: 'Office', value: 'Hyderabad, Telangana, India', color: 'text-emerald-400', href: 'https://maps.google.com/?q=Hyderabad,Telangana,India' },
              ].map((item, i) => (
                <a key={i} href={item.href} target={item.icon === MapPin ? "_blank" : "_self"} rel="noopener noreferrer" className="flex items-start gap-6 group cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-center ${item.color} group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300`}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-1">{item.label}</div>
                    <div className="text-lg font-semibold text-slate-50 group-hover:text-emerald-400 transition-colors">{item.value}</div>
                  </div>
                </a>
              ))}
            </div>

            <div className="p-8 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
              <h4 className="text-xl font-bold text-slate-50 mb-4">Company Hours</h4>
              <div className="space-y-2 text-slate-400 font-light">
                <p className="text-slate-200 leading-relaxed">
                  {settings.companyHours || 'Monday to Friday: 9:00 AM - 6:00 PM, Saturday & Sunday: Closed'}
                </p>
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
                  <label className="text-sm font-medium text-slate-400 ml-1">Your Name</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:border-emerald-500 outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:border-emerald-500 outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Subject</label>
                <input
                  required
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:border-emerald-500 outline-none transition-colors"
                  placeholder="How can we help?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Message</label>
                <textarea
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:border-emerald-500 outline-none transition-colors resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                disabled={status === 'sending'}
                type="submit"
                className="w-full py-4 rounded-xl bg-emerald-600 text-slate-950 font-bold text-lg hover:bg-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? (
                  <div className="w-6 h-6 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink-0 mx-4 text-slate-500 text-sm">or</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              <a 
                href={`mailto:${settings.contactEmail}?subject=${encodeURIComponent(formData.subject || 'Contact Inquiry')}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`}
                className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-lg transition-all flex items-center justify-center gap-3 border border-slate-700"
              >
                <Mail size={20} />
                Send Directly via Email
              </a>

              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
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
