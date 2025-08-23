import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import { IconMusicNote, IconLogout, IconMenu, IconX, IconUser, IconSettings, IconCreditCard } from '../constants';
import ThemeSwitcher from './ThemeSwitcher';
import { auth } from '../src/firebaseConfig';
import { signOut } from 'firebase/auth';

const Header: React.FC = () => {
  const { setCurrentPage, isAuthenticated, user, currentPage } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentPage(AppPage.LANDING);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigate = (page: AppPage) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Home', page: AppPage.LANDING },
    { label: 'Master Track', page: AppPage.UPLOAD },
    ...(isAuthenticated ? [
      { label: 'Dashboard', page: AppPage.DASHBOARD },
      { label: 'Credits', page: AppPage.BUY_CREDITS }
    ] : [
      { label: 'Sign In', page: AppPage.AUTH }
    ])
  ];

  return (
    <header className={`navbar transition-all duration-300 ${isScrolled ? 'bg-studio-dark/95 border-gray-700' : 'bg-transparent border-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => navigate(AppPage.LANDING)}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <IconMusicNote className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-hero rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300 animate-pulse-glow"></div>
            </div>
            <h1 className="navbar-brand text-2xl font-black">
              Afromaster
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.page)}
                className={`nav-link px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentPage === item.page 
                    ? 'active bg-glass-bg text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-glass-bg'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop User Menu & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeSwitcher />
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* User Avatar & Info */}
                <div className="flex items-center space-x-2 bg-glass-bg backdrop-filter backdrop-blur-lg px-3 py-2 rounded-lg border border-glass-border">
                  <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center">
                    <IconUser className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-white font-medium">
                    {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}
                  </span>
                </div>

                {/* Action Buttons */}
                <button
                  onClick={() => navigate(AppPage.DASHBOARD)}
                  className="btn btn-ghost btn-sm"
                  title="Dashboard"
                >
                  <IconSettings className="w-4 h-4" />
                </button>

                <button
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm text-gray-400 hover:text-red-400"
                  title="Logout"
                >
                  <IconLogout className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate(AppPage.AUTH)}
                  className="btn btn-ghost"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate(AppPage.UPLOAD)}
                  className="btn btn-primary"
                >
                  Try Free
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden btn btn-ghost btn-sm"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <IconX className="w-6 h-6" />
            ) : (
              <IconMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-studio-dark/95 backdrop-filter backdrop-blur-xl border-t border-gray-700 animate-slide-in-down">
            <div className="container mx-auto px-4 py-6">
              <nav className="space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.page)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                      currentPage === item.page 
                        ? 'bg-gradient-hero text-white font-semibold' 
                        : 'text-gray-300 hover:text-white hover:bg-glass-bg'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                
                {isAuthenticated && (
                  <>
                    <hr className="border-gray-700 my-4" />
                    
                    {/* Mobile User Info */}
                    <div className="flex items-center space-x-3 px-4 py-2">
                      <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center">
                        <IconUser className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {user?.displayName || 'User'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3">
                        <IconLogout className="w-5 h-5" />
                        <span>Sign Out</span>
                      </div>
                    </button>
                  </>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;