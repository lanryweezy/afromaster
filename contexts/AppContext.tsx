import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { AppPage, UploadedTrack, MasteringSettings, MasteredTrackInfo, Theme } from '../types';
import { Genre, LoudnessTarget, TonePreference, StereoWidth } from '../constants';
import { auth } from '../src/firebaseConfig';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AppContextType {
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;
  uploadedTrack: UploadedTrack | null;
  setUploadedTrack: (track: UploadedTrack | null) => void;
  masteringSettings: MasteringSettings | null;
  setMasteringSettings: (settings: MasteringSettings | null) => void;
  masteredTrackInfo: MasteredTrackInfo | null;
  setMasteredTrackInfo: (info: MasteredTrackInfo | null) => void;
  userProjects: MasteredTrackInfo[];
  addUserProject: (project: MasteredTrackInfo) => void;
  apiKey: string | undefined;
  setApiKey: (key: string | undefined) => void;
  originalAudioBuffer: AudioBuffer | null;
  setOriginalAudioBuffer: (buffer: AudioBuffer | null) => void;
  masteredAudioBuffer: AudioBuffer | null;
  setMasteredAudioBuffer: (buffer: AudioBuffer | null) => void;
  isMusicPlaying: boolean;
  setIsMusicPlaying: (isPlaying: boolean) => void;
  isAuthenticated: boolean;
  user: User | null;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useLocalStorage<AppPage>('afromaster-current-page', AppPage.LANDING);
  const [uploadedTrack, setUploadedTrack] = useState<UploadedTrack | null>(null);
  const [masteringSettings, setMasteringSettings] = useLocalStorage<MasteringSettings | null>('afromaster-settings', {
    genre: Genre.POP,
    loudnessTarget: LoudnessTarget.STREAMING_STANDARD,
    tonePreference: TonePreference.BALANCED,
    stereoWidth: StereoWidth.STANDARD,
    customLoudnessValue: -14,
    referenceTrackFile: null,
    compressionAmount: 50,
    saturationAmount: 0,
    bassBoost: 0,
    trebleBoost: 0,
    aiSettingsApplied: false, // Default value
    useDynamicEQ: false, // Default value
    crossover: { lowPass: 250, highPass: 4000 },
    eq: { bassFreq: 200, trebleFreq: 5000, bassGain: 0, trebleGain: 0 },
    saturation: { amount: 0, flavor: 'tape' }, // Default values
    preGain: 1.0, // Default value
    bands: { // Default values
      low: { threshold: -35, knee: 15, ratio: 4, attack: 0.05, release: 0.3, makeupGain: 2.0 },
      mid: { threshold: -30, knee: 10, ratio: 3, attack: 0.01, release: 0.25, makeupGain: 2.0 },
      high: { threshold: -25, knee: 5, ratio: 3, attack: 0.005, release: 0.15, makeupGain: 1.5 },
    },
    limiter: { threshold: -1.5, attack: 0.002, release: 0.05 }, // Default values
    finalGain: 1.0, // Default value
    reverb: { impulseResponse: 'none', wetDryMix: 0 }, // Default values
  });
  const [masteredTrackInfo, setMasteredTrackInfo] = useState<MasteredTrackInfo | null>(null);
  const [userProjects, setUserProjects] = useState<MasteredTrackInfo[]>([]);
  const [apiKey, setApiKey] = useLocalStorage<string | undefined>('afromaster-api-key', process.env.API_KEY);
  const [originalAudioBuffer, setOriginalAudioBuffer] = useState<AudioBuffer | null>(null);
  const [masteredAudioBuffer, setMasteredAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useLocalStorage<Theme>('afromaster-theme', 'solar-flare');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const addUserProject = (project: MasteredTrackInfo) => {
    setUserProjects(prevProjects => [project, ...prevProjects]);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <AppContext.Provider value={{
      currentPage, setCurrentPage,
      uploadedTrack, setUploadedTrack,
      masteringSettings, setMasteringSettings,
      masteredTrackInfo, setMasteredTrackInfo,
      userProjects, addUserProject,
      apiKey, setApiKey,
      originalAudioBuffer, setOriginalAudioBuffer,
      masteredAudioBuffer, setMasteredAudioBuffer,
      isMusicPlaying, setIsMusicPlaying,
      isAuthenticated,
      user,
      theme, setTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
