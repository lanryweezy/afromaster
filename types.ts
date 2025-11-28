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
}

export interface MasteringSettings {
  genre: Genre;
  loudnessTarget: LoudnessTarget | string; // string for custom LUFS
  tonePreference: TonePreference;
  stereoWidth: StereoWidth;
  referenceTrackFile?: File | null; // Renamed for clarity, storing the File object
  customLoudnessValue?: number; // e.g. -12 for -12 LUFS
  // New advanced settings
  compressionAmount: number; // 0-100
  saturationAmount: number; // 0-100
  bassBoost: number; // in dB, e.g., -6 to 6
  trebleBoost: number; // in dB, e.g., -6 to 6
}

export interface AIPreset {
  name: string;
  description: string;
  settings: {
    loudnessTarget: string; // e.g., "-14 LUFS"
    tonePreference: string; // e.g., "Warm"
    stereoWidth: string; // e.g., "Wide"
  };
}

export interface UploadedTrack {
  file: File;
  name: string;
  duration?: number; // Optional, can be extracted later
  waveformUrl?: string; // Placeholder for a visual
  audioBuffer?: AudioBuffer | null; // To store decoded audio data
}

export interface MasteredTrackInfo extends UploadedTrack {
  id: string;
  masteredFileUrl: string; // Simulated URL
  settings: MasteringSettings;
  masteredDate: Date;
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