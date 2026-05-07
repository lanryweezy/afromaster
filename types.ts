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
  loudnessTarget: LoudnessTarget | string;
  tonePreference: TonePreference;
  stereoWidth: StereoWidth;
  referenceTrackFile?: File | null;
  referenceUrl?: string; // Added for URL references
  customLoudnessValue?: number;
  
  // Advanced DSP Settings
  preGain: number;
  finalGain: number;
  
  eq: {
    bassFreq: number;
    bassGain: number;
    trebleFreq: number;
    trebleGain: number;
  };
  
  saturation: {
    amount: number;
    flavor: 'tape' | 'tube' | 'transformer' | 'digital';
  };
  
  bands: {
    low: { threshold: number; knee: number; ratio: number; attack: number; release: number; makeupGain: number };
    mid: { threshold: number; knee: number; ratio: number; attack: number; release: number; makeupGain: number };
    high: { threshold: number; knee: number; ratio: number; attack: number; release: number; makeupGain: number };
  };
  
  limiter: {
    threshold: number;
    attack: number;
    release: number;
  };

  // Restoration (Audio Archeology)
  restoration: {
    deNoise: number; // 0-100
    deClip: number; // 0-100
    deReverb: number; // 0-100
  };

  // UI / Legacy compatibility
  compressionAmount: number; // 0-100
  saturationAmount: number; // 0-100
  bassBoost: number; // in dB
  trebleBoost: number; // in dB
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

export interface AIPreset {
  id?: string;
  name: string;
  description: string;
  settings: Partial<MasteringSettings> & {
    loudnessTarget?: string;
    tonePreference?: string;
    stereoWidth?: string;
  };
}

export type StemType = 'vocals' | 'drums' | 'bass' | 'instruments' | 'other';

export interface Stem {
  id: string;
  file: File;
  name: string;
  type: StemType;
  audioBuffer?: AudioBuffer | null;
  gain: number; // Applied by AI or user before summing
  analysis?: any;
}

export interface UploadedTrack {
  id: string; 
  file?: File; // Optional if in stem mode
  name: string;
  duration?: number;
  waveformUrl?: string;
  audioBuffer?: AudioBuffer | null; // The summed buffer or single track buffer
  analysis?: any; 
  stems?: Stem[]; // Added for Stem Mastering
  isStemMode?: boolean;
}

export interface MasteringVariation {
  id: string;
  name: string;
  settings: Partial<MasteringSettings>;
  audioBuffer?: AudioBuffer | null;
  projectBuffers?: Record<string, AudioBuffer>; // id -> buffer mapping for batch processing
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