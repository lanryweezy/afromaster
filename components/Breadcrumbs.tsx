import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import { IconHome, IconUpload, IconCog, IconPlay, IconDownload, IconSparkles } from '../constants';

const Breadcrumbs: React.FC = () => {
  const { currentPage, setCurrentPage } = useAppContext();

  const getBreadcrumbItems = () => {
    const items = [
      { page: AppPage.LANDING, label: 'Home', icon: IconHome, clickable: true }
    ];

    switch (currentPage) {
      case AppPage.UPLOAD:
        items.push({ page: AppPage.UPLOAD, label: 'Upload Track', icon: IconUpload, clickable: false });
        break;
      case AppPage.SETTINGS:
        items.push(
          { page: AppPage.UPLOAD, label: 'Upload Track', icon: IconUpload, clickable: true },
          { page: AppPage.SETTINGS, label: 'Mastering Settings', icon: IconCog, clickable: false }
        );
        break;
      case AppPage.PROCESSING:
        items.push(
          { page: AppPage.UPLOAD, label: 'Upload Track', icon: IconUpload, clickable: true },
          { page: AppPage.SETTINGS, label: 'Mastering Settings', icon: IconCog, clickable: true },
          { page: AppPage.PROCESSING, label: 'Processing', icon: IconSparkles, clickable: false }
        );
        break;
      case AppPage.PREVIEW:
        items.push(
          { page: AppPage.UPLOAD, label: 'Upload Track', icon: IconUpload, clickable: true },
          { page: AppPage.SETTINGS, label: 'Mastering Settings', icon: IconCog, clickable: true },
          { page: AppPage.PROCESSING, label: 'Processing', icon: IconSparkles, clickable: true },
          { page: AppPage.PREVIEW, label: 'Preview & Compare', icon: IconPlay, clickable: false }
        );
        break;
      case AppPage.DOWNLOAD:
        items.push(
          { page: AppPage.UPLOAD, label: 'Upload Track', icon: IconUpload, clickable: true },
          { page: AppPage.SETTINGS, label: 'Mastering Settings', icon: IconCog, clickable: true },
          { page: AppPage.PROCESSING, label: 'Processing', icon: IconSparkles, clickable: true },
          { page: AppPage.PREVIEW, label: 'Preview & Compare', icon: IconPlay, clickable: true },
          { page: AppPage.DOWNLOAD, label: 'Download', icon: IconDownload, clickable: false }
        );
        break;
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-700/30 rounded-xl p-3 shadow-lg">
        <ol className="flex items-center space-x-1 text-sm">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg className="mx-2 w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
              <button
                onClick={() => item.clickable && setCurrentPage(item.page)}
                disabled={!item.clickable}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 group ${
                  item.clickable
                    ? 'text-slate-400 hover:text-orange-400 hover:bg-slate-800/50 cursor-pointer transform hover:scale-105'
                    : 'text-orange-400 bg-orange-500/10 border border-orange-500/20 cursor-default shadow-lg'
                }`}
              >
                <item.icon className={`w-4 h-4 ${!item.clickable ? 'text-orange-400' : 'group-hover:scale-110 transition-transform'}`} />
                <span className="hidden sm:inline font-medium">{item.label}</span>
                
                {/* Current page indicator */}
                {!item.clickable && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                )}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
