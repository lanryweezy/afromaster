import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import { IconHome, IconUpload, IconCog, IconPlay, IconDownload } from '../constants';

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
          { page: AppPage.PROCESSING, label: 'Processing', icon: IconCog, clickable: false }
        );
        break;
      case AppPage.PREVIEW:
        items.push(
          { page: AppPage.UPLOAD, label: 'Upload Track', icon: IconUpload, clickable: true },
          { page: AppPage.SETTINGS, label: 'Mastering Settings', icon: IconCog, clickable: true },
          { page: AppPage.PROCESSING, label: 'Processing', icon: IconCog, clickable: true },
          { page: AppPage.PREVIEW, label: 'Preview & Compare', icon: IconPlay, clickable: false }
        );
        break;
      case AppPage.DOWNLOAD:
        items.push(
          { page: AppPage.UPLOAD, label: 'Upload Track', icon: IconUpload, clickable: true },
          { page: AppPage.SETTINGS, label: 'Mastering Settings', icon: IconCog, clickable: true },
          { page: AppPage.PROCESSING, label: 'Processing', icon: IconCog, clickable: true },
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
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-slate-500">/</span>
            )}
            <button
              onClick={() => item.clickable && setCurrentPage(item.page)}
              disabled={!item.clickable}
              className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors ${
                item.clickable
                  ? 'text-slate-300 hover:text-primary hover:bg-slate-800/50 cursor-pointer'
                  : 'text-primary font-medium cursor-default'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
