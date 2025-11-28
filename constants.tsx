
import React from 'react';

export enum Genre {
  POP = "Pop",
  ROCK = "Rock",
  HIPHOP = "Hip Hop",
  EDM = "EDM",
  JAZZ = "Jazz",
  CLASSICAL = "Classical",
  RB = "R&B / Soul",
  METAL = "Metal",
  COUNTRY = "Country",
  // Added Genres
  AFROBEATS = "Afrobeats",
  AMAPIANO = "Amapiano",
  HIGHLIFE = "Highlife",
  REGGAE = "Reggae",
  DANCEHALL = "Dancehall",
  LATIN = "Latin",
  GOSPEL = "Gospel",
  BLUES = "Blues",
  FOLK = "Folk",
  INDIE_ROCK = "Indie Rock",
  PUNK = "Punk",
  AMBIENT = "Ambient",
  TECHNO = "Techno",
  HOUSE = "House",
  TRANCE = "Trance",
  DRUM_AND_BASS = "Drum & Bass",
  K_POP = "K-Pop",
  SOUNDTRACK = "Soundtrack",
  SPOKEN_WORD = "Spoken Word",
  FUNK = "Funk",
  OTHER = "Other",
}

export enum LoudnessTarget {
  STREAMING_STANDARD = "-14 LUFS (Streaming Standard)",
  STREAMING_LOUD = "-11 LUFS (Streaming Loud)",
  CLUB = "-8 LUFS (Club Ready)",
  VINYL = "-16 LUFS (Vinyl Pre-master)",
  CUSTOM = "Custom LUFS",
}

export enum TonePreference {
  BALANCED = "Balanced",
  WARM = "Warm & Smooth",
  BRIGHT = "Bright & Clear",
  PUNCHY = "Punchy & Dynamic",
  VINTAGE = "Vintage Analog",
}

export enum StereoWidth {
  STANDARD = "Standard",
  WIDE = "Wide & Immersive",
  FOCUSED = "Focused Center",
  MONO_COMPATIBLE = "Mono Compatible",
}

export const GENRE_OPTIONS = Object.values(Genre);
export const LOUDNESS_TARGET_OPTIONS = Object.values(LoudnessTarget);
export const TONE_PREFERENCE_OPTIONS = Object.values(TonePreference);
export const STEREO_WIDTH_OPTIONS = Object.values(StereoWidth);

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash';

// Using a self-contained, royalty-free drum loop as a Base64 data URI to prevent network/CORS errors.
// This ensures the demo is always available and loads instantly.
export const BACKGROUND_MUSIC_URL = "data:audio/wav;base64,UklGRvx0AABXQVZFZm10IBAAAAABAAIARKwAABCxAgAEABAAZGF0YfR0AACAgICAwMDAv7+/v7+/v7+/wMDAwMDAwMCAgICAwMDAwMDAgICAgICAgICAgICAgICAgIAAAICAgACAgIAAgICAgICAgICAgIAAAICAgICAgICAgICAgIAAgACAgIAAgACAgICAgICAgIAAgIAAAACAgACAgIAAgACAgIAAAACAgACAgIAAgIAAAACAgACAgICAgIAAgICAgICAgIAAgICAgIAAgACAgICAgACAgICAgIAAgACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAAgACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgACAgICAgIAAAICAgIAAgACAgICAgICAgACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgACAgICAgACAgICAgICAgIAAAICAgACAgICAgICAgICAgIAAgACAgICAgICAgICAgIAAAICAgIAAgACAgICAgICAgACAgICAgICAgACAgICAgICAgICAgACAgICAgICAgICAgICAgICAgICAgICAgACAgICAgICAgACAgICAgICAgIAAAACAgICAgICAgICAgICAgIAAgACAgICAgICAgICAgIAAgACAgICAgICAgACAgIAAgACAgICAgICAgICAgICAgIAAAICAgIAAgACAgICAgICAgICAgIAAgACAgICAgIAAAICAgIAAAICAgACAgIAAgACAgICAgICAgICAgACAgICAgACAgICAgICAgICAgICAgICAgICAgICAgICAgIAAgACAgICAgICAgIAAAICAgIAAgACAgIAAgACAgICAgIAAgACAgICAgIAAAICAgACAgIAAAICAgIAAAICAgIAAAICAgIAAgACAgICAgICAgICAgIAAAICAgIAAgACAgIAAgACAgICAgIAAgACAgICAgIAAgACAgICAgACAgIAAgACAgICAgACAgICAgICAgIAAgACAgIAAgACAgICAgICAgIAAgACAgIAAgICAgICAgICAgICAgICAgICAgICAgACAgIAAgACAgICAgICAgICAgACAgICAgICAgIAAgACAgICAgICAgACAgICAgICAgACAgACAgICAgICAgICAgICAgICAgICAgACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAAAICAgICAgIAAAICAgIAAgACAgICAgICAgACAgICAgIAAgACAgICAgACAgICAgIAAAICAgIAAgACAgIAAgACAgICAgIAAgACAgICAgACAgICAgICAgICAgICAgIAAgICAgICAgICAgICAgICAgICAgACAgICAgICAgICAgICAgACAgICAgICAgICAgIAAgACAgICAgICAgACAgICAgACAgICAgICAgIAAgACAgIAAgACAgICAgICAgICAgICAgIAAgACAgICAgIAAgACAgIAAgACAgICAgACAgICAgACAgICAgICAgICAgICAgACAgICAgICAgICAgICAgIAAgACAgICAgICAgACAgICAgIAAAICAgIAAAICAgACAgIAAgACAgIAAgACAgICAgACAgICAgICAgICAgICAgICAgACAgIAAgACAgICAgICAgICAgIAAgACAgICAgICAgIAAgACAgIAAgACAgACAgICAgICAgACAgIAAgACAgICAgICAgICAgACAgIAAgICAgICAgIAAAICAgICAgIAAAICAgICAgICAgICAgICAgIAAgACAgICAgACAgICAgACAgICAgACAgACAgICAgICAgIAAgACAgICAgICAgIAAgACAgICAgIAAgACAgICAgICAgICAgIAAAICAgICAgIAAgICAgICAgICAgICAgICAgIAAgACAgICAgIAAgACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAAgACAgICAgICAgICAgICAgICAgICAgICAgACAgICAgICAgICAgIAAgACAgICAgICAgIAAgACAgICAgIAAAACAgICAgIAAgACAgICAgICAgICAgICAgICAgICAgIAAAACAgICAgICAgICAgICAgICAgIAAAACAgICAgICAgICAgICAgICAgIAAAICAgICAgICAgICAgICAgIAAgACAgIAAAICAgICAgICAgICAgICAgICAgIAAAICAgICAgICAgICAgICAgIAAAICAgICAgICAgICAgICAgICAgIAAAICAgIAAAICAgICAgICAgIAAgACAgIAAAICAgICAgICAgIAAAICAgIAAgACAgIAAAICAgIAAAICAgICAgICAgIAAAICAgICAgICAgICAgIAAAICAgIAAAICAgICAgIAAgACAgICAgICAgICAgIAAAICAgIAAAICAgICAgICAgIAAAICAgICAgICAgICAgICAgICAgIAAAICAgICAgACAgICAgICAgIAAAICAgICAgICAgIAAAICAgICAgICAgIAAgACAgICAgICAgICAgICAgIAAAICAgICAgICAgICAgIAAAICAgICAgICAgICAgIAAgACAgIAAgACAgIAAAICAgICAgICAgICAgICAgICAgICAgIAAAICAgIAAgACAgICAgICAgICAgIAAAICAgICAgICAgICAgIAAgACAgICAgIAAgACAgICAgICAgIAAAICAgICAgIAAgACAgIAAgACAgICAgICAgIAAAICAgIAAgACAgICAgIAAgACAgICAgICAgIAAAICAgIAAAICAgIAAgACAgIAAAICAgICAgIAAAICAgICAgICAgICAgIAAgACAgICAgICAgICAgIAAAICAgIAAAICAgIAAAICAgICAgIAAAICAgIAAAICAgICAgICAgIAAgACAgIAAAICAgICAgIAAAICAgIAAAICAgICAgICAgIAAAICAgICAgICAgIAAgACAgIAAAICAgIAAAICAgICAgACAgICAgICAgICAgIAAAICAgIAAAICAgICAgIAAAICAgIAAAICAgIAAgACAgIAAAICAgICAgICAgICAgIAAgACAgIAAAICAgICAgIAAAICAgIAAAICAgICAgIAAAICAgIAAAICAgICAgACAgIAAgACAgICAgICAgICAgICAgIAAgACAgIAAAICAgICAgICAgIAAAICAgIAAAICAgICAgIAAgACAgIAAAICAgICAgICAgIAAAICAgICAgICAgIAAgACAgICAgIAAgACAgIAAAICAgIAAgACAgICAgICAgIAAgACAgIAAAICAgIAAAICAgICAgICAgIAAgACAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgICAgIAAgACAgIAAAICAgIAAAICAgICAgICAgIAAgACAgIAAAICAgIAAAICAgIAAAICAgICAgICAgIAAAICAgICAgACAgICAgIAAgACAgICAgIAAgACAgIAAAICAgICAgICAgIAAAICAgICAgICAgIAAAICAgIAAgACAgICAgIAAgACAgIAAgACAgIAAAICAgICAgIAAgACAgIAAAICAgICAgICAgICAgIAAgACAgICAgIAAAICAgICAgIAAgACAgIAAAICAgICAgACAgICAgIAAgACAgICAgIAAgACAgICAgICAgIAAAICAgIAAAICAgICAgIAAAICAgIAAAICAgIAAAICAgICAgICAgIAAgACAgIAAAICAgIAAAICAgICAgIAAgACAgICAgIAAgACAgIAAAICAgICAgIAAgACAgIAAgACAgIAAAICAgIAAAICAgICAgIAAAICAgICAgICAgIAAgACAgIAAgACAgIAAAICAgIAAAICAgIAAgACAgIAAAICAgIAAAICAgICAgACAgIAAAICAgICAgICAgIAAgACAgICAgICAgICAgIAAAICAgICAgIAAgACAgIAAAICAgICAgIAAAICAgICAgACAgICAgIAAAICAgICAgACAgICAgICAgIAAgACAgIAAAICAgIAAAICAgICAgICAgICAgICAgIAAAICAgICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgICAgIAAAICAgICAgIAAgACAgIAAAICAgICAgICAgIAAAICAgIAAAICAgICAgICAgIAAAICAgIAAAICAgICAgIAAgACAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgICAgIAAAICAgIAAAICAgIAAAICAgICAgACAgICAgICAgIAAgACAgICAgIAAgACAgIAAAICAgICAgIAAAICAgICAgIAAAICAgIAAAICAgICAgIAAAICAgICAgIAAgACAgICAgIAAgACAgICAgIAAAICAgICAgICAgICAgIAAgACAgIAAAICAgIAAAICAgICAgACAgIAAAICAgIAAAICAgICAgICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgICAgICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgICAgICAgIAAAICAgICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgICAgIAAAICAgIAAAICAgICAgACAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgICAgACAgICAgIAAAICAgICAgICAgICAgIAAAICAgIAAAICAgICAgIAAgACAgIAAAICAgICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgICAgIAAAICAgIAAAICAgIAAAICAgICAgACAgICAgICAgICAgIAAAICAgICAgICAgIAAAICAgICAgICAgIAAAICAgICAgIAAgACAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgICAgACAgIAAAICAgIAAAICAgIAAAICAgICAgIAAgACAgIAAAICAgICAgICAgICAgIAAAICAgICAgACAgICAgIAAAICAgIAAAICAgIAAAICAgICAgACAgICAgIAAAICAgICAgICAgIAAAICAgICAgICAgIAAAICAgICAgIAAAICAgIAAAICAgIAAAICAgICAgACAgICAgICAgICAgIAAAICAgIAAAICAgICAgACAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgICAgACAgIAAgACAgIAAgACAgIAAgACAgICAgICAgIAAAICAgIAAAICAgIAAAICAgICAgIAAAICAgICAgACAgIAAAICAgICAgACAgICAgICAgIAAAICAgICAgICAgIAAAICAgICAgACAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgICAgIAAAICAgICAgICAgIAAAICAgICAgIAAAICAgICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgICAgICAgIAAAICAgIAAAICAgICAgIAAAICAgIAAAICAgICAgACAgIAAAICAgIAAAICAgICAgACAgIAAAICAgICAgICAgICAgIAAAICAgICAgICAgIAAAICAgICAgACAgIAAAICAgIAAAICAgIAAAICAgICAgIAAAICAgICAgIAAAICAgICAgIAAAICAgICAgICAgIAAAICAgICAgICAgICAgIAAAICAgICAgIAAAICAgICAgICAgIAAAICAgICAgACAgICAgIAAAICAgICAgIAAAICAgICAgACAgIAAAICAgICAgICAgICAgIAAAICAgIAAAICAgICAgICAgICAgIAAAICAgICAgIAAAICAgICAgACAgIAAAICAgIAAAICAgICAgACAgIAAAICAgICAgACAgIAAAICAgICAgACAgICAgICAgIAAAICAgIAAAICAgIAAAICAgICAgACAgICAgIAAAICAgICAgACAgICAgIAAAICAgIAAAICAgICAgICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgICAgIAAAICAgIAAAICAgICAgICAgIAAAICAgICAgIAAAICAgICAgICAgIAAAICAgIAAAICAgIAAAICAgICAgACAgIAAAICAgICAgICAgIAAAICAgICAgICAgIAAAICAgIAAAICAgICAgACAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgICAgIAAAICAgIAAAICAgICAgICAgICAgIAAAICAgIAAAICAgICAgICAgIAAAICAgIAAAICAgICAgACAgIAAAICAgICAgICAgICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgIAAAICAgICAgACAgIAAAICAgICAgACAgIAAAICAgICAgACAgICAgICAgIAAAICAgICAgIAAAICAgICAgIAAAICAgICAgIAAAICAgICAgICAgICAgIAAAICAgIAAAICAgICAgICAgIAAAICAgIAAAICAgICAgIAAAICAgICAgACAgICAgIAAAICAgICAgACAgIAAAICAgIAAAICAgIAAAICAgICAgICAgICAgIAAAICAgICAgACAgICAgICAgIAAAICAgICAgICAgIAAAICAgICAgICAgICAgIAAAICAgICAgICAgICAgICAgIAAAICAgICAgICAgIAAAICAgICAgACAgIAAAICAgICAgIAAAICAgICAgICAgIAAAICAgICAgIAAAICAgICAgIAAAICAgICAgIAAAICAgIAAAICAgICAgICAgICAgIAAAICAgICAgICAgIAAAICAgICAgIAAAICAgICAgACAgIC-3/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/+n/-n/+n/+n/+n/+n/g/6/9/zD/MP+o/zD/r/9N/1H/S/9T/1L/Yv9q/1r/b/9P/1H/Q/+4/5z/kP+g/w==";

// SVG Icons (Heroicons)
export const IconUpload: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

export const IconCog: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15.036-7.026A7.5 7.5 0 0012 21a7.5 7.5 0 007.5-7.5c0-1.06-.212-2.072-.606-3M3.58 4.974A7.5 7.5 0 0012 3a7.5 7.5 0 007.5 7.5c0 1.06.212 2.072.606 3" />
  </svg>
);

export const IconPlay: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
  </svg>
);

export const IconPause: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
  </svg>
);

export const IconDownload: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const IconArrowLeft: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

export const IconArrowRight: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export const IconSparkles: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 14.188l-1.25-2.188a2.25 2.25 0 00-1.7-1.7L12 9.75l2.188-1.25a2.25 2.25 0 001.7-1.7L17 4.75l1.25 2.188a2.25 2.25 0 001.7 1.7L22.25 9.75l-2.188 1.25a2.25 2.25 0 00-1.7 1.7z" />
  </svg>
);

export const IconMusicNote: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V7.5A2.25 2.25 0 0013.5 3H12m0 0v6.553m0 0l-1.059.302a1.803 1.803 0 01-2.118 0l-1.059-.302m0 0a2.25 2.25 0 00-2.25 2.25v3.75a2.25 2.25 0 001.632 2.163l1.32.377A1.803 1.803 0 019.99 15.367c.836 0 1.513-.333 2.012-.924l2.31-.66A2.25 2.25 0 0015 9.75V7.5a2.25 2.25 0 00-2.25-2.25H12z" />
  </svg>
);

export const IconXCircle: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const IconCheckCircle: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
);

export const IconVolumeUp: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
);

export const IconVolumeOff: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
</svg>
);

export const IconLockClosed: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

export const IconGoogle: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={className}>
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 9.196C34.978 5.617 29.818 3.5 24 3.5C13.791 3.5 5.5 11.791 5.5 22s8.291 18.5 18.5 18.5s18.5-8.291 18.5-18.5c0-1.251-.131-2.45-.353-3.617l.001-.002z"></path>
    <path fill="#FF3D00" d="M6.306 14.691L11.5 18.337C12.876 15.31 15.418 13.235 18.5 12.083L13.585 7.904C10.575 9.778 8.046 12.059 6.306 14.691z"></path>
    <path fill="#4CAF50" d="M24 44.5c5.166 0 9.86-1.977 13.409-5.192L32.64 34.69C30.222 36.786 27.275 38 24 38c-3.866 0-7.22-1.886-9.228-4.856L9.043 37.026C12.31 41.56 17.8 44.5 24 44.5z"></path>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l5.833 4.492C42.844 34.257 44.5 30.075 44.5 25.5c0-2.732-.37-5.31-.989-7.738z"></path>
  </svg>
);

export const IconLogout: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);

// Social Icons
export const IconTwitter: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg fill="currentColor" viewBox="0 0 512 512" className={className}><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
);

export const IconInstagram: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg fill="currentColor" viewBox="0 0 24 24" className={className}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.645-.07-4.85s.012-3.584.07-4.85c.148-3.225 1.664 4.771 4.919 4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.359 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.359-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.359-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.44-1.441-1.44z"/></svg>
);

export const IconFacebook: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg fill="currentColor" viewBox="0 0 24 24" className={className}><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
);

export const IconMenu: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export const IconX: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
