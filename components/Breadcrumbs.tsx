import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';

const Breadcrumbs: React.FC = () => {
  const { currentPage, setCurrentPage } = useAppContext();

  const getBreadcrumbs = () => {
    switch (currentPage) {
      case AppPage.UPLOAD:
        return [{ label: 'Home', page: AppPage.LANDING }, { label: 'Upload', active: true }];
      case AppPage.SETTINGS:
        return [{ label: 'Home', page: AppPage.LANDING }, { label: 'Upload', page: AppPage.UPLOAD }, { label: 'Settings', active: true }];
      case AppPage.PROCESSING:
        return [{ label: 'Home', page: AppPage.LANDING }, { label: 'Processing', active: true }];
      case AppPage.PREVIEW:
        return [{ label: 'Home', page: AppPage.LANDING }, { label: 'Preview', active: true }];
      case AppPage.DOWNLOAD:
        return [{ label: 'Home', page: AppPage.LANDING }, { label: 'Download', active: true }];
      default:
        return [];
    }
  };

  const crumbs = getBreadcrumbs();
  if (crumbs.length === 0) return null;

  return (
    <nav className="flex mb-6 text-xs text-slate-500 font-medium uppercase tracking-widest overflow-x-auto whitespace-nowrap pb-2">
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.label}>
          {crumb.active ? (
            <span className="text-primary">{crumb.label}</span>
          ) : (
            <button 
              onClick={() => setCurrentPage(crumb.page!)}
              className="hover:text-white transition-colors"
            >
              {crumb.label}
            </button>
          )}
          {i < crumbs.length - 1 && <span className="mx-3 opacity-30">/</span>}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;