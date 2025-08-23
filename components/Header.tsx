import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import { auth } from '../src/firebaseConfig';
import { signOut } from 'firebase/auth';
import Button from './Button';
import { IconUser, IconMenu, IconX, IconLogout, IconDashboard, IconCreditCard, IconMusic, IconHome, IconUpload } from '../constants';

const Header: React.FC = () => {
  const { currentPage, setCurrentPage, user, userCredits } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentPage(AppPage.LANDING);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { page: AppPage.LANDING, label: 'Home', icon: IconHome },
    { page: AppPage.UPLOAD, label: 'Master', icon: IconUpload },
    ...(user ? [
      { page: AppPage.DASHBOARD, label: 'Dashboard', icon: IconDashboard },
      { page: AppPage.BUY_CREDITS, label: 'Credits', icon: IconCreditCard },
    ] : []),
  ];

  const isActivePage = (page: AppPage) => currentPage === page;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-card border-b border-white/10 backdrop-blur-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setCurrentPage(AppPage.LANDING)}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <IconMusic className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gradient">Afromaster</span>
                <span className="text-xs text-gray-400 leading-none">Professional Mastering</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ page, label, icon: Icon }) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`nav-link ${isActivePage(page) ? 'active' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>

            {/* User Section */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="hidden sm:flex items-center gap-4">
                  {/* Credits Display */}
                  <div className="glass-card px-3 py-1.5 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="body-small font-semibold">{userCredits} Credits</span>
                  </div>

                  {/* User Menu */}
                  <div className="relative group">
                    <button className="flex items-center gap-2 glass-card px-3 py-1.5 hover:bg-white/10 transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full flex items-center justify-center">
                        <IconUser className="w-4 h-4 text-white" />
                      </div>
                      <span className="body-small font-medium hidden lg:block">
                        {user.displayName || user.email?.split('@')[0]}
                      </span>
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 glass-card border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                      <div className="p-2">
                        <button
                          onClick={() => setCurrentPage(AppPage.DASHBOARD)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <IconDashboard className="w-4 h-4" />
                          <span className="body-small">Dashboard</span>
                        </button>
                        <button
                          onClick={() => setCurrentPage(AppPage.BUY_CREDITS)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <IconCreditCard className="w-4 h-4" />
                          <span className="body-small">Buy Credits</span>
                        </button>
                        <div className="h-px bg-white/10 my-2" />
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                        >
                          <IconLogout className="w-4 h-4" />
                          <span className="body-small">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => setCurrentPage(AppPage.AUTH)}
                  variant="primary"
                  size="sm"
                  className="hidden sm:flex"
                >
                  <IconUser className="w-4 h-4" />
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden glass-card p-2 hover:bg-white/10 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <IconX className="w-5 h-5" />
                ) : (
                  <IconMenu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
        isMobileMenuOpen 
          ? 'opacity-100 visible' 
          : 'opacity-0 invisible'
      }`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div className={`absolute top-0 right-0 h-full w-80 max-w-[90vw] glass-card border-l border-white/20 transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <IconMusic className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gradient">Afromaster</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2 mb-8">
              {navItems.map(({ page, label, icon: Icon }) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActivePage(page)
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </nav>

            {/* Mobile User Section */}
            {user ? (
              <div className="space-y-4">
                {/* User Info */}
                <div className="glass-card p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full flex items-center justify-center">
                      <IconUser className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {user.displayName || 'User'}
                      </div>
                      <div className="body-small text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="body-small font-semibold">{userCredits} Credits</span>
                  </div>
                </div>

                {/* Sign Out Button */}
                <Button
                  onClick={handleSignOut}
                  variant="danger"
                  className="w-full"
                >
                  <IconLogout className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  setCurrentPage(AppPage.AUTH);
                  setIsMobileMenuOpen(false);
                }}
                variant="primary"
                className="w-full"
              >
                <IconUser className="w-4 h-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-16" />
    </>
  );
};

export default Header;