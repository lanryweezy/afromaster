import React from 'react';
import Button from '../components/Button';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import { IconGoogle } from '../constants';

const AuthPage: React.FC = () => {
  const { setCurrentPage, setIsAuthenticated, setUser } = useAppContext();

  const handleLogin = () => {
    // Simulated login
    setUser({
      name: 'Producer Name',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Producer'
    });
    setIsAuthenticated(true);
    setCurrentPage(AppPage.UPLOAD);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 rounded-2xl shadow-2xl text-center">
      <h2 className="text-3xl font-heading font-bold text-white mb-6">Welcome Back</h2>
      <p className="text-slate-400 mb-10">Sign in to save your masters and access Pro tools.</p>
      
      <Button 
        onClick={handleLogin} 
        size="lg" 
        variant="primary" 
        className="w-full flex items-center justify-center space-x-3"
      >
        <IconGoogle className="w-5 h-5" />
        <span>Continue with Google</span>
      </Button>
      
      <p className="mt-8 text-xs text-slate-500 leading-relaxed">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};

export default AuthPage;