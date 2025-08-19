import { Genre, LoudnessTarget, TonePreference, StereoWidth } from './constants';

export type Theme = 'nebula' | 'solar-flare' | 'starlight';

export enum AppPage {
  LANDING,
  UPLOAD,
  SETTINGS,
  PROCESSING,
  PREVIEW,
  DOWNLOAD,
  DASHBOARD,
  AUTH,
  BUY_CREDITS,
}

export interface MasteringSettings {
  genre: Genre;
  loudnessTarget: LoudnessTarget | string;
  tonePreference: TonePreference;
  stereoWidth: StereoWidth;
  referenceTrackFile?: File | null;
  customLoudnessValue?: number;
  compressionAmount: number;
  saturationAmount: number;
  bassBoost: number;
  trebleBoost: number;
  aiSettingsApplied?: boolean;
  useDynamicEQ?: boolean;
  crossover: { lowPass: number; highPass: number };
  eq: { bassFreq: number; trebleFreq: number; bassGain: number; trebleGain: number };
  preGain: number;
  bands: {
    low: { threshold: number; knee: number; ratio: number; attack: number; release: number; makeupGain: number };
    mid: { threshold: number; knee: number; ratio: number; attack: number; release: number; makeupGain: number };
    high: { threshold: number; knee: number; ratio: number; attack: number; release: number; makeupGain: number };
  };
  limiter: { threshold: number; attack: number; release: number };
  finalGain: number;
}

export interface UploadedTrack {
  file: File;
  name: string;
  duration?: number; // Optional, can be extracted later
  waveformUrl?: string; // Placeholder for a visual
  audioBuffer?: AudioBuffer | null; // To store decoded audio data
}

export interface MasteredTrackInfo {
  id: string;
  originalName: string;
  masteredName: string;
  dateProcessed: string;
  settings: MasteringSettings;
  downloadUrl: string;
  originalDuration: number;
  masteredDuration: number;
  masteringReportNotes?: string; // Added for AI-generated notes
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  retrievedContext?: {
    uri?: string;
    title?: string;
  };
}