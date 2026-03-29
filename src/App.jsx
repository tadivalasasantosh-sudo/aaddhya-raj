import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './sections/Hero';
import { Services } from './sections/Services';
import { Portfolio } from './sections/Portfolio';
import { About } from './sections/About';
import { Contact } from './sections/Contact';
import { Login } from './admin/Login';
import { AdminLayout } from './admin/AdminLayout';
import { Dashboard } from './admin/Dashboard';
import { ProjectsManager } from './admin/ProjectsManager';
import { MessagesManager } from './admin/MessagesManager';
import { ErrorBoundary } from './components/ErrorBoundary';
import { db } from './firebase';
import { doc, getDocFromServer } from 'firebase/firestore';

const HomePage = () => (
  <div className="bg-black text-white selection:bg-blue-500/30">
    <Navbar />
    <main>
      <Hero />
      <Services />
      <Portfolio />
      <About />
      <Contact />
    </main>
    <Footer />
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
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="messages" element={<MessagesManager />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
