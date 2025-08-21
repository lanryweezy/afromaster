import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { IconMusicNote } from '../constants';

interface ListStatusDisplayProps {
  isLoading: boolean;
  isEmpty: boolean;
  loadingMessage: string;
  emptyMessage: string;
}

const ListStatusDisplay: React.FC<ListStatusDisplayProps> = ({
  isLoading,
  isEmpty,
  loadingMessage,
  emptyMessage,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-20">
        <LoadingSpinner text={loadingMessage} />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center py-20 bg-slate-900/60 backdrop-blur-lg border border-slate-800/50 rounded-xl shadow-lg card-accent">
        <IconMusicNote className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-primary">No Projects Yet</h3>
        <p className="text-slate-300 mt-2">{emptyMessage}</p>
      </div>
    );
  }

  return null; // Render nothing if not loading and not empty
};

export default ListStatusDisplay;
