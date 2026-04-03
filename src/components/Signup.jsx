import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { OperationType, handleFirestoreError } from '../firebase';

export const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user document in Firestore with 'user' role
      try {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          uid: user.uid,
          role: 'user',
          createdAt: new Date().toISOString()
        }, { merge: true });
      } catch (firestoreErr) {
        handleFirestoreError(firestoreErr, OperationType.WRITE, `users/${user.uid}`);
      }

      setSuccess('Account created! Please wait for an administrator to grant you access.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user already exists
      let userDoc;
      try {
        userDoc = await getDoc(doc(db, 'users', user.uid));
      } catch (firestoreErr) {
        handleFirestoreError(firestoreErr, OperationType.GET, `users/${user.uid}`);
      }

      if (!userDoc.exists()) {
        // Create user document in Firestore with 'user' role
        try {
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            uid: user.uid,
            role: 'user',
            createdAt: new Date().toISOString()
          });
        } catch (firestoreErr) {
          handleFirestoreError(firestoreErr, OperationType.WRITE, `users/${user.uid}`);
        }
        setSuccess('Account created with Google! Please wait for an administrator to grant you access.');
      } else {
        setSuccess('Account already exists. Redirecting to login...');
      }
      
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Google sign-up failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative">
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-gray-900 p-8 rounded-2xl border border-white/10 space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Request Portal Access</h2>
          <p className="text-gray-400 text-sm">Create an account to be assigned a role by an administrator.</p>
        </div>
        
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-emerald-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-emerald-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-emerald-500 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Account...' : <><UserPlus size={18} /> Create Account</>}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign up with Google
        </button>

        <p className="text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};
