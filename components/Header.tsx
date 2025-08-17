import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import { IconMusicNote, IconGoogle, IconLogout } from '../constants';
import ThemeSwitcher from './ThemeSwitcher';

const UserMenu: React.FC = () => {
    const { user, setIsAuthenticated, setUser, setCurrentPage } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setCurrentPage(AppPage.LANDING);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
                <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border-2 border-slate-700 hover:border-primary-focus transition-colors" />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800/80 backdrop-blur-lg border border-slate-700 rounded-lg shadow-2xl z-50 animate-fadeIn p-2">
                     <div className="px-3 py-2 border-b border-slate-700">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-400">Logged In</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm rounded-md flex items-center space-x-3 text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-colors mt-1"
                    >
                        <IconLogout className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
};


const Header: React.FC = () => {
  const { setCurrentPage, isAuthenticated, setIsAuthenticated, setUser } = useAppContext();
  
  const handleLogin = () => {
    // This is a simulation. In a real app, this would trigger the Google OAuth flow.
    setUser({
        name: 'Demo User',
        avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=Demo%20User`
    });
    setIsAuthenticated(true);
  };

  return (
    <header className="bg-slate-950/70 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-800/50 shadow-lg shadow-black/20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => setCurrentPage(AppPage.LANDING)}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110">
            <IconMusicNote className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-gradient-primary">
            Afromaster
          </h1>
        </div>
        <div className="flex items-center space-x-4">
           <ThemeSwitcher />
           <nav className="flex items-center space-x-2">
            {isAuthenticated ? (
                <>
                    <button 
                      onClick={() => setCurrentPage(AppPage.DASHBOARD)}
                      className="text-slate-300 hover:bg-slate-800 hover:text-white transition-colors px-4 py-2 rounded-md text-sm font-medium hidden sm:inline"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => setCurrentPage(AppPage.UPLOAD)}
                      className="font-semibold bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-md text-sm hover:opacity-90 transition-opacity"
                    >
                      New Master
                    </button>
                    <UserMenu />
                </>
            ) : (
                <button
                    onClick={handleLogin}
                    className="flex items-center space-x-2 font-semibold bg-slate-800 text-white px-4 py-2 rounded-md text-sm hover:bg-slate-700 transition-colors border border-slate-700"
                >
                    <IconGoogle className="w-5 h-5"/>
                    <span>Login with Google</span>
                </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
