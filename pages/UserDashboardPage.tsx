import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import TrackCard from '../components/TrackCard';
import Button from '../components/Button';
import { AppPage } from '../types';
import { IconUpload, IconMusicNote, IconLockClosed } from '../constants';

const UserDashboardPage: React.FC = () => {
  const { userProjects, setCurrentPage, isAuthenticated } = useAppContext();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-heading font-semibold text-gradient-primary">Your Project Studio</h2>
        {isAuthenticated && (
           <Button onClick={() => setCurrentPage(AppPage.UPLOAD)} leftIcon={<IconUpload className="w-5 h-5"/>}>
            Master New Track
          </Button>
        )}
      </div>

      {!isAuthenticated ? (
        <div className="text-center py-20 bg-slate-900/60 backdrop-blur-lg border border-slate-800/50 rounded-xl shadow-lg card-accent">
          <IconLockClosed className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-primary">Please log in to view your dashboard.</h3>
          <p className="text-slate-300 mt-2">Your mastered tracks and projects will be saved here.</p>
        </div>
      ) : userProjects.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/60 backdrop-blur-lg border border-slate-800/50 rounded-xl shadow-lg card-accent">
          <IconMusicNote className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-primary">No Projects Yet</h3>
          <p className="text-slate-300 mt-2">Click "Master New Track" to get started!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProjects.map(track => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboardPage;
