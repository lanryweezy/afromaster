import React, { useState } from 'react';
import { auth } from '../src/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import Button from '../components/Button';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import Card from '../components/Card';

const AuthPage: React.FC = () => {
  const { setCurrentPage, setIsLoading, setErrorMessage } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);

  const handleEmailPasswordAuth = async () => {
    setIsLoading(true);
    setErrorMessage(null); // Clear previous errors
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setCurrentPage(AppPage.DASHBOARD);
    } catch (error: unknown) {
      console.error("Email/Password Auth Error:", error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage(null); // Clear previous errors
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setCurrentPage(AppPage.DASHBOARD);
    } catch (error: unknown) {
      console.error("Google Auth Error:", error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card maxWidth="max-w-md" shadow="shadow-xl" className="mt-10">
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
        <Button onClick={handleEmailPasswordAuth} className="w-full" isLoading={false} disabled={false}> {/* isLoading and disabled will be handled by global context */}
          {isSignUp ? 'Sign Up' : 'Log In'}
        </Button>
        <Button onClick={handleGoogleAuth} variant="secondary" className="w-full" isLoading={false} disabled={false}> {/* isLoading and disabled will be handled by global context */}
          Sign in with Google
        </Button>
      </div>
      {/* Error display is now handled globally by AppContext */}
      <p className="text-center text-sm text-slate-400 mt-6">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-primary hover:underline ml-1"
        >
          {isSignUp ? 'Log In' : 'Sign Up'}
        </button>
      </p>
    </Card>
  );
};

export default AuthPage;
