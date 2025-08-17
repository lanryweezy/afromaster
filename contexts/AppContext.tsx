import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { AppPage, UploadedTrack, MasteringSettings, MasteredTrackInfo, Theme } from '../types';
import { Genre, LoudnessTarget, TonePreference, StereoWidth } from '../constants';

interface User {
  name: string;
  avatarUrl: string;
}

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
  setIsAuthenticated: (isAuth: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<AppPage>(AppPage.LANDING);
  const [uploadedTrack, setUploadedTrack] = useState<UploadedTrack | null>(null);
  const [masteringSettings, setMasteringSettings] = useState<MasteringSettings | null>({
    genre: Genre.POP,
    loudnessTarget: LoudnessTarget.STREAMING_STANDARD,
    tonePreference: TonePreference.BALANCED,
    stereoWidth: StereoWidth.STANDARD,
    customLoudnessValue: -14,
    referenceTrackFile: null,
    // New settings with defaults
    compressionAmount: 50,
    saturationAmount: 0,
    bassBoost: 0,
    trebleBoost: 0,
  });
  const [masteredTrackInfo, setMasteredTrackInfo] = useState<MasteredTrackInfo | null>(null);
  const [userProjects, setUserProjects] = useState<MasteredTrackInfo[]>([]);
  const [apiKey, setApiKey] = useState<string | undefined>(process.env.API_KEY);
  const [originalAudioBuffer, setOriginalAudioBuffer] = useState<AudioBuffer | null>(null);
  const [masteredAudioBuffer, setMasteredAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>('solar-flare');

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
      isAuthenticated, setIsAuthenticated,
      user, setUser,
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
