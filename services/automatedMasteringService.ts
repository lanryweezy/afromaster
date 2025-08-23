import { MasteringSettings, Genre } from '../types';
import { analyzeAudioBuffer } from './audioProcessingService';

export interface AudioAnalysis {
  loudness: number;
  peak: number;
  dynamicRange: number;
  spectralBalance: {
    low: number;
    mid: number;
    high: number;
  };
  duration: number;
  sampleRate: number;
  channels: number;
}

export interface AutomatedMasteringResult {
  settings: MasteringSettings;
  analysis: AudioAnalysis;
  recommendations: string[];
}

// Genre-specific mastering presets
const getGenrePreset = (genre: Genre): Partial<MasteringSettings> => {
  switch (genre) {
    case 'Hip Hop':
      return {
        eq: { bassFreq: 150, trebleFreq: 4000, bassGain: 2, trebleGain: 1 },
        saturation: { amount: 15, flavor: 'tube' },
        bands: {
          low: { threshold: -25, knee: 10, ratio: 4, attack: 0.01, release: 0.2, makeupGain: 3.0 },
          mid: { threshold: -20, knee: 8, ratio: 3, attack: 0.005, release: 0.15, makeupGain: 2.0 },
          high: { threshold: -18, knee: 5, ratio: 2, attack: 0.002, release: 0.1, makeupGain: 1.5 }
        },
        limiter: { threshold: -1.0, attack: 0.001, release: 0.01 },
        finalGain: 1.2
      };
    
    case 'Pop':
      return {
        eq: { bassFreq: 200, trebleFreq: 5000, bassGain: 1, trebleGain: 2 },
        saturation: { amount: 10, flavor: 'tape' },
        bands: {
          low: { threshold: -30, knee: 12, ratio: 3, attack: 0.02, release: 0.25, makeupGain: 2.5 },
          mid: { threshold: -25, knee: 10, ratio: 3, attack: 0.01, release: 0.2, makeupGain: 2.0 },
          high: { threshold: -20, knee: 6, ratio: 2, attack: 0.005, release: 0.12, makeupGain: 1.8 }
        },
        limiter: { threshold: -1.2, attack: 0.002, release: 0.02 },
        finalGain: 1.1
      };
    
    case 'Rock':
      return {
        eq: { bassFreq: 180, trebleFreq: 4500, bassGain: 1.5, trebleGain: 1.5 },
        saturation: { amount: 20, flavor: 'transformer' },
        bands: {
          low: { threshold: -28, knee: 15, ratio: 4, attack: 0.015, release: 0.3, makeupGain: 3.5 },
          mid: { threshold: -22, knee: 12, ratio: 3, attack: 0.008, release: 0.18, makeupGain: 2.5 },
          high: { threshold: -18, knee: 8, ratio: 2, attack: 0.003, release: 0.1, makeupGain: 2.0 }
        },
        limiter: { threshold: -0.8, attack: 0.001, release: 0.015 },
        finalGain: 1.3
      };
    
    case 'Electronic':
      return {
        eq: { bassFreq: 120, trebleFreq: 6000, bassGain: 2.5, trebleGain: 1.8 },
        saturation: { amount: 12, flavor: 'digital' },
        bands: {
          low: { threshold: -22, knee: 8, ratio: 5, attack: 0.005, release: 0.15, makeupGain: 4.0 },
          mid: { threshold: -18, knee: 6, ratio: 3, attack: 0.002, release: 0.1, makeupGain: 2.5 },
          high: { threshold: -15, knee: 4, ratio: 2, attack: 0.001, release: 0.08, makeupGain: 2.0 }
        },
        limiter: { threshold: -0.5, attack: 0.0005, release: 0.008 },
        finalGain: 1.4
      };
    
    case 'Jazz':
      return {
        eq: { bassFreq: 250, trebleFreq: 3500, bassGain: 0.5, trebleGain: 1.5 },
        saturation: { amount: 8, flavor: 'tube' },
        bands: {
          low: { threshold: -35, knee: 20, ratio: 2, attack: 0.05, release: 0.4, makeupGain: 1.5 },
          mid: { threshold: -30, knee: 15, ratio: 2, attack: 0.02, release: 0.3, makeupGain: 1.8 },
          high: { threshold: -25, knee: 10, ratio: 2, attack: 0.01, release: 0.2, makeupGain: 1.2 }
        },
        limiter: { threshold: -2.0, attack: 0.005, release: 0.05 },
        finalGain: 0.9
      };
    
    case 'Afrobeats':
      return {
        eq: { bassFreq: 160, trebleFreq: 4500, bassGain: 2.5, trebleGain: 1.2 },
        saturation: { amount: 18, flavor: 'tape' },
        bands: {
          low: { threshold: -24, knee: 12, ratio: 4, attack: 0.012, release: 0.22, makeupGain: 3.5 },
          mid: { threshold: -20, knee: 10, ratio: 3, attack: 0.006, release: 0.16, makeupGain: 2.5 },
          high: { threshold: -16, knee: 6, ratio: 2, attack: 0.003, release: 0.1, makeupGain: 2.0 }
        },
        limiter: { threshold: -0.8, attack: 0.001, release: 0.012 },
        finalGain: 1.25
      };
    
    default:
      return {
        eq: { bassFreq: 200, trebleFreq: 5000, bassGain: 1, trebleGain: 1 },
        saturation: { amount: 10, flavor: 'tape' },
        bands: {
          low: { threshold: -28, knee: 12, ratio: 3, attack: 0.02, release: 0.25, makeupGain: 2.0 },
          mid: { threshold: -24, knee: 10, ratio: 3, attack: 0.01, release: 0.2, makeupGain: 2.0 },
          high: { threshold: -20, knee: 6, ratio: 2, attack: 0.005, release: 0.12, makeupGain: 1.5 }
        },
        limiter: { threshold: -1.5, attack: 0.002, release: 0.02 },
        finalGain: 1.0
      };
  }
};

// Analyze audio characteristics and adjust settings accordingly
const analyzeAndAdjust = (analysis: AudioAnalysis, baseSettings: MasteringSettings): MasteringSettings => {
  let adjustedSettings = { ...baseSettings };
  const recommendations: string[] = [];

  // Adjust based on loudness
  if (analysis.loudness < -20) {
    adjustedSettings.finalGain *= 1.3;
    recommendations.push("Track is quiet - increased overall gain");
  } else if (analysis.loudness > -12) {
    adjustedSettings.finalGain *= 0.8;
    recommendations.push("Track is loud - reduced overall gain");
  }

  // Adjust based on dynamic range
  if (analysis.dynamicRange > 15) {
    // High dynamic range - apply more compression
    adjustedSettings.bands.low.threshold -= 5;
    adjustedSettings.bands.mid.threshold -= 5;
    adjustedSettings.bands.high.threshold -= 5;
    recommendations.push("High dynamic range detected - applied gentle compression");
  } else if (analysis.dynamicRange < 8) {
    // Low dynamic range - apply less compression
    adjustedSettings.bands.low.threshold += 3;
    adjustedSettings.bands.mid.threshold += 3;
    adjustedSettings.bands.high.threshold += 3;
    recommendations.push("Low dynamic range detected - reduced compression");
  }

  // Adjust based on spectral balance
  if (analysis.spectralBalance.low > analysis.spectralBalance.mid * 1.5) {
    // Bass heavy
    adjustedSettings.eq.bassGain -= 1;
    recommendations.push("Bass-heavy track - reduced low-end boost");
  } else if (analysis.spectralBalance.high > analysis.spectralBalance.mid * 1.3) {
    // Bright track
    adjustedSettings.eq.trebleGain -= 1;
    recommendations.push("Bright track - reduced high-end boost");
  }

  // Adjust based on peak levels
  if (analysis.peak > -3) {
    // Track is clipping or very hot
    adjustedSettings.limiter.threshold = -3;
    recommendations.push("High peak levels - applied stronger limiting");
  }

  return adjustedSettings;
};

// Main automated mastering function
export const automatedMastering = async (
  audioBuffer: AudioBuffer,
  genre: Genre,
  userPreferences?: Partial<MasteringSettings>
): Promise<AutomatedMasteringResult> => {
  try {
    // Step 1: Analyze the audio
    const analysis = analyzeAudioBuffer(audioBuffer);
    
    // Step 2: Get genre-specific preset
    const genrePreset = getGenrePreset(genre);
    
    // Step 3: Create base settings
    const baseSettings: MasteringSettings = {
      genre,
      loudnessTarget: 'STREAMING_STANDARD',
      tonePreference: 'BALANCED',
      stereoWidth: 'STANDARD',
      customLoudnessValue: -14,
      referenceTrackFile: null,
      compressionAmount: 50,
      saturationAmount: 0,
      bassBoost: 0,
      trebleBoost: 0,
      aiSettingsApplied: true,
      useDynamicEQ: false,
      crossover: { lowPass: 250, highPass: 4000 },
      eq: { bassFreq: 200, trebleFreq: 5000, bassGain: 0, trebleGain: 0 },
      saturation: { amount: 0, flavor: 'tape' },
      preGain: 1.0,
      bands: {
        low: { threshold: -30, knee: 12, ratio: 3, attack: 0.02, release: 0.25, makeupGain: 2.0 },
        mid: { threshold: -25, knee: 10, ratio: 3, attack: 0.01, release: 0.2, makeupGain: 2.0 },
        high: { threshold: -20, knee: 6, ratio: 2, attack: 0.005, release: 0.12, makeupGain: 1.5 }
      },
      limiter: { threshold: -1.5, attack: 0.002, release: 0.02 },
      finalGain: 1.0,
      reverb: { impulseResponse: 'none', wetDryMix: 0 },
      ...genrePreset,
      ...userPreferences
    };
    
    // Step 4: Analyze and adjust based on audio characteristics
    const optimizedSettings = analyzeAndAdjust(analysis, baseSettings);
    
    // Step 5: Generate recommendations
    const recommendations = [
      `Genre: ${genre} - Applied ${genre} mastering chain`,
      `Loudness: ${analysis.loudness.toFixed(1)} LUFS`,
      `Dynamic Range: ${analysis.dynamicRange.toFixed(1)} dB`,
      `Peak Level: ${analysis.peak.toFixed(1)} dB`,
      ...optimizedSettings.recommendations || []
    ];
    
    return {
      settings: optimizedSettings,
      analysis,
      recommendations
    };
    
  } catch (error) {
    console.error('Automated mastering failed:', error);
    throw new Error('Failed to analyze and optimize audio for mastering');
  }
};

// Get mastering recommendations based on analysis
export const getMasteringRecommendations = (analysis: AudioAnalysis, genre: Genre): string[] => {
  const recommendations: string[] = [];
  
  // Loudness recommendations
  if (analysis.loudness < -18) {
    recommendations.push("Consider increasing overall loudness for streaming platforms");
  } else if (analysis.loudness > -10) {
    recommendations.push("Track may be too loud - consider reducing gain");
  }
  
  // Dynamic range recommendations
  if (analysis.dynamicRange > 18) {
    recommendations.push("High dynamic range - consider gentle compression");
  } else if (analysis.dynamicRange < 6) {
    recommendations.push("Low dynamic range - track may be over-compressed");
  }
  
  // Spectral balance recommendations
  if (analysis.spectralBalance.low > analysis.spectralBalance.mid * 2) {
    recommendations.push("Bass-heavy mix - consider reducing low-end");
  } else if (analysis.spectralBalance.high > analysis.spectralBalance.mid * 1.5) {
    recommendations.push("Bright mix - consider reducing high-end");
  }
  
  // Genre-specific recommendations
  switch (genre) {
    case 'Hip Hop':
      if (analysis.spectralBalance.low < analysis.spectralBalance.mid * 0.8) {
        recommendations.push("Hip Hop typically benefits from stronger bass presence");
      }
      break;
    case 'Pop':
      if (analysis.loudness < -14) {
        recommendations.push("Pop music typically targets -14 LUFS for streaming");
      }
      break;
    case 'Rock':
      if (analysis.dynamicRange < 10) {
        recommendations.push("Rock music benefits from some dynamic range preservation");
      }
      break;
  }
  
  return recommendations;
};
