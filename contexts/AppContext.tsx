import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { AppPage, UploadedTrack, MasteringSettings, MasteredTrackInfo, Theme, MasteringVariation } from '../types';
import { Genre, LoudnessTarget, TonePreference, StereoWidth } from '../constants';

interface User {
  name: string;
  avatarUrl: string;
}

interface AppContextType {
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;
  projectTracks: UploadedTrack[];
  setProjectTracks: (tracks: UploadedTrack[]) => void;
  leadTrackId: string | null;
  setLeadTrackId: (id: string | null) => void;
  masteringSettings: MasteringSettings | null;
  setMasteringSettings: (settings: MasteringSettings | null) => void;
  masteredTrackInfo: MasteredTrackInfo | null;
  setMasteredTrackInfo: (info: MasteredTrackInfo | null) => void;
  userProjects: MasteredTrackInfo[];
  addUserProject: (project: MasteredTrackInfo) => void;
  apiKey: string | undefined;
  setApiKey: (key: string | undefined) => void;
  masteringVariations: MasteringVariation[];
  setMasteringVariations: (variations: MasteringVariation[]) => void;
  activeVariationId: string | null;
  setActiveVariationId: (id: string | null) => void;
  isMusicPlaying: boolean;
  setIsMusicPlaying: (isPlaying: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuth: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  // Computed / Helper values for backward compatibility and convenience
  uploadedTrack: UploadedTrack | null; // Returns lead track or first track
  originalAudioBuffer: AudioBuffer | null; // Returns lead track buffer
  masteredAudioBuffer: AudioBuffer | null; // Returns active variation buffer for lead track
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<AppPage>(AppPage.LANDING);
  const [projectTracks, setProjectTracks] = useState<UploadedTrack[]>([]);
  const [leadTrackId, setLeadTrackId] = useState<string | null>(null);
  const [masteringSettings, setMasteringSettings] = useState<MasteringSettings | null>({
    genre: Genre.POP,
    loudnessTarget: LoudnessTarget.STREAMING_STANDARD,
    tonePreference: TonePreference.BALANCED,
    stereoWidth: StereoWidth.STANDARD,
    customLoudnessValue: -14,
    referenceTrackFile: null,
    
    preGain: 1.0,
    finalGain: 1.0,
    eq: { bassFreq: 200, bassGain: 0, trebleFreq: 5000, trebleGain: 0 },
    saturation: { amount: 0, flavor: 'tape' },
    bands: {
      low: { threshold: -35, knee: 15, ratio: 4, attack: 0.05, release: 0.3, makeupGain: 2.0 },
      mid: { threshold: -30, knee: 10, ratio: 3, attack: 0.01, release: 0.25, makeupGain: 2.0 },
      high: { threshold: -25, knee: 5, ratio: 3, attack: 0.005, release: 0.15, makeupGain: 1.5 },
    },
    limiter: { threshold: -1.5, attack: 0.002, release: 0.05 },
    restoration: {
      deNoise: 0,
      deClip: 0,
      deReverb: 0,
    },
    compressionAmount: 50,
    saturationAmount: 0,
    bassBoost: 0,
    trebleBoost: 0,
  });
  const [masteredTrackInfo, setMasteredTrackInfo] = useState<MasteredTrackInfo | null>(null);
  const [userProjects, setUserProjects] = useState<MasteredTrackInfo[]>([]);
  const [apiKey, setApiKey] = useState<string | undefined>(process.env.API_KEY);
  const [masteringVariations, setMasteringVariations] = useState<MasteringVariation[]>([]);
  const [activeVariationId, setActiveVariationId] = useState<string | null>(null);
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

  // Derived values for compatibility
  const leadTrack = projectTracks.find(t => t.id === leadTrackId) || projectTracks[0] || null;
  const originalAudioBuffer = leadTrack?.audioBuffer || null;
  const activeVariation = masteringVariations.find(v => v.id === activeVariationId);
  const masteredAudioBuffer = activeVariation?.audioBuffer || null;

  return (
    <AppContext.Provider value={{
      currentPage, setCurrentPage,
      projectTracks, setProjectTracks,
      leadTrackId, setLeadTrackId,
      masteringSettings, setMasteringSettings,
      masteredTrackInfo, setMasteredTrackInfo,
      userProjects, addUserProject,
      apiKey, setApiKey,
      masteringVariations, setMasteringVariations,
      activeVariationId, setActiveVariationId,
      isMusicPlaying, setIsMusicPlaying,
      isAuthenticated, setIsAuthenticated,
      user, setUser,
      theme, setTheme,
      uploadedTrack: leadTrack,
      originalAudioBuffer,
      masteredAudioBuffer
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
