
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

export const IconHome: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

export const IconCheck: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

export const IconAlertTriangle: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

export const IconRefresh: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 001.3-4.386c0-1.452.446-2.8 1.207-3.907M16.023 9.348l-3.181-3.183a8.25 8.25 0 00-1.3 4.386c0 1.452.446 2.8 1.207 3.907" />
  </svg>
);

export const IconGift: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25a8.384 8.384 0 01-.75 3.451c-.5.75-1.5 1.5-2.25 2.25a8.384 8.384 0 01-3.451.75H12a8.384 8.384 0 01-3.451-.75c-.75-.75-1.75-1.5-2.25-2.25a8.384 8.384 0 01-.75-3.451V9a3 3 0 013-3h6a3 3 0 013 3v2.25zM12 9v12m0-12l-3-3m3 3l3-3" />
  </svg>
);

export const IconUsers: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

export const IconCopy: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
  </svg>
);

export const IconShare: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
  </svg>
);

export const IconUser: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

export const IconSettings: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const IconCreditCard: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
  </svg>
);

export const IconGlobe: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

export const IconTrendingUp: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

export const IconAward: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.228a25.135 25.135 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
  </svg>
);

export const IconBolt: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

export const IconHeart: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

export const IconFire: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
  </svg>
);

export const IconStar: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

export const IconMail: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

export const IconPhone: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

export const IconMapPin: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

export const IconShield: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);
