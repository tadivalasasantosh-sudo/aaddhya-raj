import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './sections/Hero';
import { Services } from './sections/Services';
import { About } from './sections/About';
import { WhyChooseUs } from './sections/WhyChooseUs';
import { TechStack } from './sections/TechStack';
import { Testimonials } from './sections/Testimonials';
import { Contact } from './sections/Contact';
import { Careers } from './sections/Careers';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { AdminDashboard } from './components/AdminDashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AIAssistant } from './components/AIAssistant';
import { WhatsAppButton } from './components/WhatsAppButton';
import { SettingsProvider } from './context/SettingsContext';

const HomePage = () => (
  <div className="bg-black text-white selection:bg-blue-500/30">
    <Navbar />
    <main>
      <Hero />
      <Services />
      <About />
      <WhyChooseUs />
      <TechStack />
      <Testimonials />
      <Careers />
      <Contact />
    </main>
    <Footer />
    <AIAssistant />
    <WhatsAppButton />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </SettingsProvider>
    </ErrorBoundary>
  );
}

export default App;
