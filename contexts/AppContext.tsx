import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { AppPage, UploadedTrack, MasteringSettings, MasteredTrackInfo, Theme } from '../types';
import { Genre, LoudnessTarget, TonePreference, StereoWidth } from '../constants';
import { auth } from '../src/firebaseConfig';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useLocalStorage } from '../hooks/useLocalStorage';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusMessage from '../components/StatusMessage';

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
  audioBuffersAvailable: boolean;
  setAudioBuffersAvailable: (available: boolean) => void;
  isMusicPlaying: boolean;
  setIsMusicPlaying: (isPlaying: boolean) => void;
  isAuthenticated: boolean;
  user: User | null;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;
  clearError: () => void;
  // New function for optimized state updates
  updateMasteringSettings: (updater: (prev: MasteringSettings) => MasteringSettings) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const deepMerge = (target: MasteringSettings, source: Partial<MasteringSettings>) => {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key]) && typeof target[key] === 'object' && target[key] !== null && !Array.isArray(target[key])) {
        target[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useLocalStorage<AppPage>('afromaster-current-page', AppPage.LANDING);
  const [uploadedTrack, setUploadedTrack] = useState<UploadedTrack | null>(null);
  const [masteringSettings, setMasteringSettings] = useLocalStorage<MasteringSettings | null>('afromaster-settings', () => {
    const initialSettings = {
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
      aiSettingsApplied: false,
      useDynamicEQ: false,
      crossover: { lowPass: 250, highPass: 4000 },
      eq: { bassFreq: 200, trebleFreq: 5000, bassGain: 0, trebleGain: 0 },
      saturation: { amount: 0, flavor: 'tape' },
      preGain: 1.0,
      bands: {
        low: { threshold: -35, knee: 15, ratio: 4, attack: 0.05, release: 0.3, makeupGain: 2.0 },
        mid: { threshold: -30, knee: 10, ratio: 3, attack: 0.01, release: 0.25, makeupGain: 2.0 },
        high: { threshold: -25, knee: 5, ratio: 3, attack: 0.005, release: 0.15, makeupGain: 1.5 },
      },
      limiter: { threshold: -1.5, attack: 0.002, release: 0.05 },
      finalGain: 1.0,
      reverb: { impulseResponse: 'none', wetDryMix: 0 },
    };

    const storedItem = window.localStorage.getItem('afromaster-settings');
    if (storedItem) {
      try {
        const parsedItem = JSON.parse(storedItem);
        const merged = deepMerge(initialSettings, parsedItem);
        // Ensure required nested defaults
        merged.saturation = {
          flavor: merged.saturation?.flavor ?? 'tape',
          amount: merged.saturation?.amount ?? 0,
        };
        return merged;
      } catch (error) {
        console.error("Error parsing stored mastering settings:", error);
        return initialSettings;
      }
    }
    return initialSettings;
  });
  const [masteredTrackInfo, setMasteredTrackInfo] = useState<MasteredTrackInfo | null>(null);
  const [userProjects, setUserProjects] = useState<MasteredTrackInfo[]>([]);
  const [apiKey, setApiKey] = useLocalStorage<string | undefined>('afromaster-api-key', import.meta.env?.VITE_GEMINI_API_KEY || 'AIzaSyAd_a5_UCShxXzE4G_MCALTWEB9gNcO2ao');
  const [originalAudioBuffer, setOriginalAudioBuffer] = useState<AudioBuffer | null>(null);
  const [masteredAudioBuffer, setMasteredAudioBuffer] = useState<AudioBuffer | null>(null);
  
  // Add state recovery mechanism for audio buffers
  const [audioBuffersAvailable, setAudioBuffersAvailable] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  // Track when both audio buffers are available
  useEffect(() => {
    setAudioBuffersAvailable(!!(originalAudioBuffer && masteredAudioBuffer));
  }, [originalAudioBuffer, masteredAudioBuffer]);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useLocalStorage<Theme>('afromaster-theme', 'solar-flare');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const clearError = () => setErrorMessage(null);
  
  // Optimized state update function to prevent unnecessary re-renders
  const updateMasteringSettings = useCallback((updater: (prev: MasteringSettings) => MasteringSettings) => {
    setMasteringSettings(prev => {
      if (!prev) return prev;
      return updater(prev);
    });
  }, [setMasteringSettings]);

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
      audioBuffersAvailable, setAudioBuffersAvailable,
      isMusicPlaying, setIsMusicPlaying,
      isAuthenticated,
      user,
      theme, setTheme,
      isLoading, setIsLoading,
      errorMessage, setErrorMessage,
      clearError,
      updateMasteringSettings
    }}>
      {children}
      {isLoading && <LoadingSpinner />}
      {errorMessage && <StatusMessage type="error" message={errorMessage} onClose={clearError} />}
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