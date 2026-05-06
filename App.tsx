import React, { useEffect } from 'react';
import { AppPage } from './types';
import { useAppContext } from './contexts/AppContext';
import { analyticsService } from './services/analyticsService';

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
import ErrorBoundary from './components/ErrorBoundary';
import Breadcrumbs from './components/Breadcrumbs';
import WorkflowProgress from './components/WorkflowProgress';

const App: React.FC = () => {
  const { currentPage } = useAppContext();

  // Track page views
  useEffect(() => {
    const pageNames = {
      [AppPage.LANDING]: 'Landing Page',
      [AppPage.UPLOAD]: 'Upload Audio',
      [AppPage.SETTINGS]: 'Mastering Settings',
      [AppPage.PROCESSING]: 'Processing Audio',
      [AppPage.PREVIEW]: 'Preview & Compare',
      [AppPage.DOWNLOAD]: 'Download Master',
      [AppPage.DASHBOARD]: 'User Dashboard',
      [AppPage.AUTH]: 'Authentication',
      [AppPage.BUY_CREDITS]: 'Buy Credits'
    };

    const pageName = pageNames[currentPage] || 'Unknown Page';
    analyticsService.trackPageView(pageName);
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
      <div className="min-h-screen flex flex-col bg-transparent font-sans relative transition-all duration-500 z-0">
        <Header />
        <main key={currentPage} className="flex-grow container mx-auto px-4 py-8 md:py-12 animate-fade-in-up z-10 relative">
          <Breadcrumbs />
          <WorkflowProgress />
          <div className="animate-scale-in">
            {renderPage()}
          </div>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;