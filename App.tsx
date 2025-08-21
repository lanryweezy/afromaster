import React, { useEffect, useRef } from 'react';
import { AppPage } from './types';
import { useAppContext } from './contexts/AppContext';

import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import UploadAudioPage from './pages/UploadAudioPage';
import MasteringSettingsPage from './pages/MasteringSettingsPage';
import ProcessingAudioPage from './pages/ProcessingAudioPage';
import PreviewAndComparePage from './pages/PreviewAndComparePage';
import DownloadMasterPage from './pages/DownloadMasterPage';
import UserDashboardPage from './pages/UserDashboardPage';
import AuthPage from './pages/AuthPage';
import BuyCreditsPage from './pages/BuyCreditsPage';
import ParticleBackground from './components/ParticleBackground';
import ErrorBoundary from './components/ErrorBoundary';
import Breadcrumbs from './components/Breadcrumbs';
import WorkflowProgress from './components/WorkflowProgress';

const App: React.FC = () => {
  const { currentPage } = useAppContext();
  const observedElementsRef = useRef<Set<Element>>(new Set());

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
          observedElementsRef.current.delete(entry.target);
        }
      });
    }, {
      threshold: 0.1,
    });

    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => {
      // Only observe elements that haven't been observed yet
      if (!observedElementsRef.current.has(el) && !el.classList.contains('is-visible')) {
        observer.observe(el);
        observedElementsRef.current.add(el);
      }
    });

    return () => {
      observer.disconnect();
      observedElementsRef.current.clear();
    };
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case AppPage.LANDING:
        return <LandingPage />;
      case AppPage.UPLOAD:
        return <UploadAudioPage />;
      case AppPage.SETTINGS:
        return <MasteringSettingsPage />;
      case AppPage.PROCESSING:
        return <ProcessingAudioPage />;
      case AppPage.PREVIEW:
        return <PreviewAndComparePage />;
      case AppPage.DOWNLOAD:
        return <DownloadMasterPage />;
      case AppPage.DASHBOARD:
        return <UserDashboardPage />;
      case AppPage.AUTH:
        return <AuthPage />;
      case AppPage.BUY_CREDITS:
        return <BuyCreditsPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-transparent font-sans relative transition-colors duration-500 z-0">
        <ParticleBackground />
        <Header />
        <main key={currentPage} className="flex-grow container mx-auto px-4 py-8 md:py-12 animate-fadeIn z-10">
          <Breadcrumbs />
          <WorkflowProgress />
          {renderPage()}
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
