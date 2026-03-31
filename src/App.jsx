import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './sections/Hero';
import { Services } from './sections/Services';
import { About } from './sections/About';
import { WhyChooseUs } from './sections/WhyChooseUs';
import { Process } from './sections/Process';
import { TechStack } from './sections/TechStack';
import { Testimonials } from './sections/Testimonials';
import { Contact } from './sections/Contact';
import { Careers } from './sections/Careers';
import { Login } from './admin/Login';
import { AdminLayout } from './admin/AdminLayout';
import { Dashboard } from './admin/Dashboard';
import { JobsManager } from './admin/JobsManager';
import { CandidatesManager } from './admin/CandidatesManager';
import { UsersManager } from './admin/UsersManager';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AIAssistant } from './components/AIAssistant';
import { WhatsAppButton } from './components/WhatsAppButton';
import { db } from './firebase';
import { doc, getDocFromServer } from 'firebase/firestore';

const HomePage = () => (
  <div className="bg-black text-white selection:bg-blue-500/30">
    <Navbar />
    <main>
      <Hero />
      <Services />
      <About />
      <WhyChooseUs />
      <Process />
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
  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test connection to Firestore
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. The client is offline.");
        }
        // Skip logging for other errors, as this is simply a connection test.
      }
    };
    testConnection();
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="jobs" element={<JobsManager />} />
            <Route path="candidates" element={<CandidatesManager />} />
            <Route path="users" element={<UsersManager />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
