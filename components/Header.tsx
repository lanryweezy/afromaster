import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import { IconMusicNote, IconLogout, IconMenu, IconX } from '../constants';
import ThemeSwitcher from './ThemeSwitcher';
import { auth } from '../src/firebaseConfig';
import { signOut } from 'firebase/auth';

const Header: React.FC = () => {
  const { setCurrentPage, isAuthenticated, user } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentPage(AppPage.LANDING);
    setIsMobileMenuOpen(false);
  };

  const navigate = (page: AppPage) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-800/50 shadow-lg shadow-black/20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => navigate(AppPage.LANDING)}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg shadow-orange-500/25">
            <IconMusicNote className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-gradient-primary">
            Afromaster
          </h1>
        </div>

        {/* --- Desktop Nav --- */}
        <div className="hidden md:flex items-center space-x-4">
           <ThemeSwitcher />
           <nav className="flex items-center space-x-2">
            {isAuthenticated ? (
                <>
                    <span className="text-slate-300 text-sm font-medium">Welcome, {user?.displayName || user?.email}</span>
                    <button 
                      onClick={() => navigate(AppPage.DASHBOARD)}
                      className="text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-300 px-4 py-2 rounded-lg text-sm font-medium border border-transparent hover:border-slate-700"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => navigate(AppPage.BUY_CREDITS)}
                      className="text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-300 px-4 py-2 rounded-lg text-sm font-medium border border-transparent hover:border-slate-700"
                    >
                      Buy Credits
                    </button>
                    <button
                        onClick={handleLogout}
                        className="text-slate-300 hover:bg-red-600 hover:text-white transition-all duration-300 px-4 py-2 rounded-lg text-sm font-medium border border-transparent hover:border-red-500"
                    >
                        Logout
                    </button>
                </>
            ) : (
                <button
                    onClick={() => navigate(AppPage.AUTH)}
                    className="flex items-center space-x-2 font-semibold bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-lg text-sm hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 border border-orange-400/30"
                >
                    <span>Log In / Sign Up</span>
                </button>
            )}
          </nav>
        </div>

        {/* --- Mobile Menu Button --- */}
        <div className="md:hidden flex items-center gap-2">
            <ThemeSwitcher />
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              aria-label="Open menu" 
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
                <IconMenu className="w-6 h-6 text-slate-300" />
            </button>
        </div>
      </div>

      {/* --- Mobile Menu Overlay --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col p-4 md:hidden animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
                 <div 
                  className="flex items-center space-x-3 cursor-pointer group"
                  onClick={() => navigate(AppPage.LANDING)}
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/25">
                        <IconMusicNote className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-heading font-bold text-gradient-primary">Afromaster</h1>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  aria-label="Close menu" 
                  className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                    <IconX className="w-7 h-7 text-slate-400" />
                </button>
            </div>
            
            <nav className="flex flex-col items-center justify-center flex-grow gap-8 text-center">
                 {isAuthenticated ? (
                    <>
                        {user && <p className="text-xl font-medium text-slate-200">Welcome, <span className="text-gradient-primary font-semibold">{user.displayName || user.email}</span>!</p>}
                        <button 
                          onClick={() => navigate(AppPage.DASHBOARD)}
                          className="text-2xl font-semibold text-slate-200 hover:text-orange-400 transition-colors py-2 px-4 rounded-lg hover:bg-slate-800/50"
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={() => navigate(AppPage.BUY_CREDITS)}
                          className="text-2xl font-semibold text-slate-200 hover:text-orange-400 transition-colors py-2 px-4 rounded-lg hover:bg-slate-800/50"
                        >
                          Buy Credits
                        </button>
                        <button
                            onClick={handleLogout}
                            className="text-lg font-semibold flex items-center space-x-2 text-slate-400 hover:text-red-400 transition-colors mt-8 py-2 px-4 rounded-lg hover:bg-red-900/20"
                        >
                            <IconLogout className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => navigate(AppPage.AUTH)}
                        className="flex items-center space-x-3 font-semibold bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-xl text-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 border border-orange-400/30"
                    >
                        <span>Log In / Sign Up</span>
                    </button>
                )}
            </nav>
             <div className="pb-4 text-center text-xs text-slate-600">
                &copy; {new Date().getFullYear()} Afromaster - Mastering for the Culture
            </div>
        </div>
      )}
    </header>
  );
};

export default Header;