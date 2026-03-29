import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck, AlertCircle } from 'lucide-react';
import { CompanyLogo } from '../components/CompanyLogo';
import { motion } from 'motion/react';

export const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full glass-card p-10 space-y-8 relative z-10"
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CompanyLogo size="lg" />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Access</h1>
          <p className="text-gray-400">Secure portal for AadhyaRaj Technologies</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck size={20} />
            </div>
            <div className="text-sm text-gray-400">
              Authorized personnel only. Access is monitored and logged.
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={20} />
                Sign in with Google
              </>
            )}
          </button>
        </div>

        <div className="text-center">
          <a href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
            Return to Homepage
          </a>
        </div>
      </motion.div>
    </div>
  );
};
