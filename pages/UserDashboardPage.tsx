import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import TrackCard from '../components/TrackCard';
import Button from '../components/Button';
import { AppPage, MasteredTrackInfo } from '../types';
import { IconUpload } from '../constants';
import { db } from '../src/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ListStatusDisplay from '../components/ListStatusDisplay';

const UserDashboardPage: React.FC = () => {
  const { user, setCurrentPage, isAuthenticated } = useAppContext();
  const [projects, setProjects] = useState<MasteredTrackInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchProjects = async () => {
        setIsLoading(true);
        const q = query(collection(db, "projects"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const userProjects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MasteredTrackInfo));
        setProjects(userProjects);
        setIsLoading(false);
      };
      fetchProjects();
    } else if (!isAuthenticated) {
      setCurrentPage(AppPage.AUTH);
    }
  }, [isAuthenticated, user, setCurrentPage]);

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  const displayStatus = (
    <ListStatusDisplay
      isLoading={isLoading}
      isEmpty={projects.length === 0}
      loadingMessage="Loading projects..."
      emptyMessage="Click 'Master New Track' to get started!"
    />
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
        <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-gradient-primary">Your Project Studio</h2>
        {isAuthenticated && (
           <Button onClick={() => setCurrentPage(AppPage.UPLOAD)} leftIcon={<IconUpload className="w-5 h-5"/>}>
            Master New Track
          </Button>
        )}
      </div>

      {displayStatus || (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(track => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboardPage;
