import React, { useState } from 'react';
import { auth } from '../src/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import Button from '../components/Button';
<<<<<<< HEAD

const AuthPage: React.FC = () => {
=======
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';

const AuthPage: React.FC = () => {
  const { setCurrentPage } = useAppContext();
>>>>>>> main
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState<string | null>(null);
<<<<<<< HEAD

  const handleEmailPasswordAuth = async () => {
    setError(null);
=======
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailPasswordAuth = async () => {
    setError(null);
    setIsLoading(true);
>>>>>>> main
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
<<<<<<< HEAD
    } catch (err: any) {
      setError(err.message);
=======
      // Redirect to dashboard after successful authentication
      setCurrentPage(AppPage.DASHBOARD);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
>>>>>>> main
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
<<<<<<< HEAD
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
=======
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Redirect to dashboard after successful authentication
      setCurrentPage(AppPage.DASHBOARD);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
>>>>>>> main
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-slate-800 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        {isSignUp ? 'Create an Account' : 'Log In'}
      </h2>
      <div className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
<<<<<<< HEAD
        <Button onClick={handleEmailPasswordAuth} className="w-full">
          {isSignUp ? 'Sign Up' : 'Log In'}
        </Button>
        <Button onClick={handleGoogleAuth} variant="secondary" className="w-full">
=======
        <Button onClick={handleEmailPasswordAuth} className="w-full" isLoading={isLoading} disabled={isLoading}>
          {isSignUp ? 'Sign Up' : 'Log In'}
        </Button>
        <Button onClick={handleGoogleAuth} variant="secondary" className="w-full" isLoading={isLoading} disabled={isLoading}>
>>>>>>> main
          Sign in with Google
        </Button>
      </div>
      {error && <p className="text-red-500 text-xs mt-4">{error}</p>}
      <p className="text-center text-sm text-slate-400 mt-6">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-primary hover:underline ml-1"
        >
          {isSignUp ? 'Log In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
