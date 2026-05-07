import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MasteringSettings, MasteringVariation, Stem } from '../types';

export const fetchMasteringVariations = async (
  genre: string,
  trackName: string,
  apiKey: string,
  referenceAnalysis: Record<string, any> | null | undefined,
  setIsLoading: (loading: boolean) => void,
  setErrorMessage: (message: string | null) => void,
  stems?: Stem[]
): Promise<MasteringVariation[]> => {
  setIsLoading(true);
  setErrorMessage(null);
  
  try {
    if (!apiKey) throw new Error("Gemini API key is not provided.");
    const ai = new GoogleGenAI({ apiKey });
    
    let analysisContext = "";
    if (referenceAnalysis) {
      analysisContext = `Technical analysis: Loudness: ${referenceAnalysis.loudness} LUFS, Spectral: Lows: ${referenceAnalysis.spectralBalance?.low}, Highs: ${referenceAnalysis.spectralBalance?.high}`;
    }

    let stemContext = "";
    if (stems && stems.length > 0) {
      stemContext = `The user has provided ${stems.length} stems: ${stems.map(s => `${s.name} (${s.type})`).join(', ')}. 
      For each variation, suggest a 'stemGains' object mapping stem IDs to a multiplier (e.g. 1.0 is unity, 1.2 is +1.5dB).`;
    }

    const prompt = `You are 'Afromaster'. Generate 3 mastering variations for a ${genre} track.
    ${analysisContext}
    ${stemContext}

    Variation A: "Balanced"
    Variation B: "Warm & Analog"
    Variation C: "Punchy & Aggressive"

    For each variation, include a 'restoration' object:
    { "deNoise": number, "deClip": number, "deReverb": number }
    Use the analysis data: if peak is 0dB, the track might be clipped (suggest deClip > 0). If dynamic range is low, suggest de-noise or de-reverb if needed.

    Return ONLY a JSON array of 3 objects:
    {
      "id": "v1",
      "name": "Variation Name",
      "settings": { 
        ...MasteringSettings...
        "restoration": { "deNoise": 10, "deClip": 5, "deReverb": 0 }
      },
      "stemGains": { "id": 1.0 }
    }`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { temperature: 0.7, maxOutputTokens: 2048 },
    });

    let jsonStr = response.text.trim();
    const jsonStart = jsonStr.indexOf('[');
    const jsonEnd = jsonStr.lastIndexOf(']') + 1;
    if (jsonStart !== -1 && jsonEnd > jsonStart) jsonStr = jsonStr.substring(jsonStart, jsonEnd);

    const variationsData = JSON.parse(jsonStr);
    return variationsData.map((v: any) => ({
      id: v.id,
      name: v.name,
      settings: validateAndFixAISettings(v.settings, genre),
      stemGains: v.stemGains
    }));

  } catch (error) {
    console.error("Error fetching variations:", error);
    return [
      { id: 'v1', name: 'Balanced', settings: getDefaultAISettings(genre, 'balanced') },
      { id: 'v2', name: 'Warm', settings: getDefaultAISettings(genre, 'warm') },
      { id: 'v3', name: 'Punchy', settings: getDefaultAISettings(genre, 'punchy') }
    ];
  } finally {
    setIsLoading(false);
  }
};

export const fetchAIChainSettings = async (
  genre: string,
  trackName: string,
  apiKey: string,
  referenceAnalysis: Record<string, unknown> | null | undefined,
  setIsLoading: (loading: boolean) => void,
  setErrorMessage: (message: string | null) => void
): Promise<Partial<MasteringSettings> | undefined> => {
  setIsLoading(true);
  setErrorMessage(null);
  
  try {
    console.log("Starting AI settings generation for:", genre, trackName);
    
  if (!apiKey) {
    throw new Error("Gemini API key is not provided.");
  }
    
  const ai = new GoogleGenAI({ apiKey });
    console.log("Gemini AI initialized");

    // Construct a more detailed prompt using analysis data if available
    let analysisContext = "";
    if (referenceAnalysis) {
      analysisContext = `
Here is a technical analysis of the audio:
- Average Loudness: ${referenceAnalysis.loudness} LUFS
- Peak Level: ${referenceAnalysis.peak} dB
- Dynamic Range: ${referenceAnalysis.dynamicRange} dB
- Spectral Balance: Lows: ${referenceAnalysis.spectralBalance?.low}, Mids: ${referenceAnalysis.spectralBalance?.mid}, Highs: ${referenceAnalysis.spectralBalance?.high}

Please use this technical data to inform your mastering decisions. For example, if the loudness is low, increase makeup gain. If the spectral balance is heavy on the lows, consider a gentle low-shelf cut or more aggressive low-band compression.
`;
    }

    const prompt = `You are an expert mastering engineer. Generate professional mastering settings for a ${genre} track called "${trackName}".
${analysisContext}

Return ONLY a JSON object with this exact structure:
{
  "crossover": {"lowPass": 250, "highPass": 4000},
  "eq": {"bassFreq": 200, "trebleFreq": 5000, "bassGain": 0, "trebleGain": 0},
  "saturation": {"amount": 0, "flavor": "tape"},
  "preGain": 1.0,
  "bands": {
    "low": {"threshold": -35, "knee": 15, "ratio": 4, "attack": 0.05, "release": 0.3, "makeupGain": 2.0},
    "mid": {"threshold": -30, "knee": 10, "ratio": 3, "attack": 0.01, "release": 0.25, "makeupGain": 2.0},
    "high": {"threshold": -25, "knee": 5, "ratio": 3, "attack": 0.005, "release": 0.15, "makeupGain": 1.5}
  },
  "limiter": {"threshold": -1.5, "attack": 0.002, "release": 0.05},
  "finalGain": 1.0
}

Adjust all values precisely based on the genre and the provided technical analysis.
Valid saturation flavors are: "tape", "tube", "transformer", "digital".
Return ONLY the JSON object. No other text.`;

    console.log("Sending prompt to Gemini...");
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.5,
        maxOutputTokens: 1024,
      },
    });

    console.log("Received response from Gemini:", response.text);

    let jsonStr = response.text.trim();
    
    // Clean up the response
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    // Remove any non-JSON text before or after
    const jsonStart = jsonStr.indexOf('{');
    const jsonEnd = jsonStr.lastIndexOf('}') + 1;
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      jsonStr = jsonStr.substring(jsonStart, jsonEnd);
    }

    console.log("Cleaned JSON string:", jsonStr);

    let parsedData;
    try {
        parsedData = JSON.parse(jsonStr);
      console.log("Parsed data:", parsedData);
    } catch(e) {
      console.error("JSON parse failed:", e);
      console.error("Raw response:", response.text);
      console.error("Cleaned JSON:", jsonStr);
      
      // Return default settings if parsing fails
      console.log("Returning default settings due to parse failure");
      return getDefaultAISettings(genre);
    }

    // Validate and return with defaults
    const validatedData = validateAndFixAISettings(parsedData, genre);
    console.log("Validated settings:", validatedData);
    
    return validatedData;

  } catch (error: unknown) {
    console.error("Error in fetchAIChainSettings:", error);
    let message = "Unknown error";
    if (error instanceof Error) {
      message = error.message;
    }
    
    if (message.includes("API key not valid")) {
      message = "Invalid API Key for Gemini. Please check your configuration.";
    } else if (message.toLowerCase().includes("quota") || message.toLowerCase().includes("rate limit")) {
      message = "API quota exceeded or rate limit hit. Please try again later.";
    } else if (message.includes("network") || message.includes("fetch")) {
      message = "Network error. Please check your connection and try again.";
    }
    
    setErrorMessage(`Failed to fetch AI chain settings: ${message}`);
    
    // Return default settings as fallback
    console.log("Returning default settings due to error");
    return getDefaultAISettings(genre);
  } finally {
    setIsLoading(false);
  }
};

// Helper function to get default AI settings based on genre and flavor
const getDefaultAISettings = (genre: string, flavor: string = 'balanced'): Partial<MasteringSettings> => {
  const baseSettings = {
    crossover: { lowPass: 250, highPass: 4000 },
    eq: { bassFreq: 200, trebleFreq: 5000, bassGain: 0, trebleGain: 0 },
    saturation: { amount: 5, flavor: 'tape' as const },
    preGain: 1.0,
    bands: {
      low: { threshold: -35, knee: 15, ratio: 4, attack: 0.05, release: 0.3, makeupGain: 2.0 },
      mid: { threshold: -30, knee: 10, ratio: 3, attack: 0.01, release: 0.25, makeupGain: 2.0 },
      high: { threshold: -25, knee: 5, ratio: 3, attack: 0.005, release: 0.15, makeupGain: 1.5 },
    },
    limiter: { threshold: -1.5, attack: 0.002, release: 0.05 },
    restoration: { deNoise: 0, deClip: 0, deReverb: 0 },
    finalGain: 1.0,
  };

  // Flavor-specific overrides
  if (flavor === 'warm') {
    baseSettings.saturation.amount = 20;
    baseSettings.saturation.flavor = 'tube';
    baseSettings.eq.bassGain = 1.5;
  } else if (flavor === 'punchy') {
    baseSettings.bands.low.ratio = 6;
    baseSettings.bands.low.threshold = -25;
    baseSettings.limiter.threshold = -0.5;
    baseSettings.eq.trebleGain = 2;
  }

  // Genre-specific adjustments
  switch (genre.toLowerCase()) {
    case 'afrobeats':
      return {
        ...baseSettings,
        eq: { ...baseSettings.eq, bassGain: baseSettings.eq.bassGain + 1.5, trebleGain: baseSettings.eq.trebleGain + 1 },
        saturation: { ...baseSettings.saturation, amount: baseSettings.saturation.amount + 10 },
      };
    case 'amapiano':
      return {
        ...baseSettings,
        eq: { ...baseSettings.eq, bassGain: baseSettings.eq.bassGain + 3, trebleGain: baseSettings.eq.trebleGain + 2 },
        bands: {
          ...baseSettings.bands,
          low: { ...baseSettings.bands.low, threshold: -30, makeupGain: 4.0 },
        },
      };
    case 'highlife':
      return {
        ...baseSettings,
        saturation: { amount: 12, flavor: 'transformer' },
        preGain: 1.1,
      };
    case 'pop':
      return {
        ...baseSettings,
        eq: { ...baseSettings.eq, trebleGain: baseSettings.eq.trebleGain + 1 },
      };
    default:
      return baseSettings;
  }
};

// Helper function to validate and fix AI settings
const validateAndFixAISettings = (data: any, genre: string = 'Pop'): Partial<MasteringSettings> => {
  const defaults = getDefaultAISettings(genre);
  
  // Ensure all required properties exist with proper types
  const validated = {
    crossover: {
      lowPass: typeof data?.crossover?.lowPass === 'number' ? data.crossover.lowPass : defaults.crossover!.lowPass,
      highPass: typeof data?.crossover?.highPass === 'number' ? data.crossover.highPass : defaults.crossover!.highPass,
    },
    eq: {
      bassFreq: typeof data?.eq?.bassFreq === 'number' ? data.eq.bassFreq : defaults.eq!.bassFreq,
      trebleFreq: typeof data?.eq?.trebleFreq === 'number' ? data.eq.trebleFreq : defaults.eq!.trebleFreq,
      bassGain: typeof data?.eq?.bassGain === 'number' ? data.eq.bassGain : defaults.eq!.bassGain,
      trebleGain: typeof data?.eq?.trebleGain === 'number' ? data.eq.trebleGain : defaults.eq!.trebleGain,
    },
    saturation: {
      amount: typeof data?.saturation?.amount === 'number' ? data.saturation.amount : defaults.saturation?.amount || 0,
      flavor: typeof data?.saturation?.flavor === 'string' ? data.saturation.flavor : defaults.saturation?.flavor || 'tape',
    },
    preGain: typeof data?.preGain === 'number' ? data.preGain : defaults.preGain!,
    bands: {
      low: {
        threshold: typeof data?.bands?.low?.threshold === 'number' ? data.bands.low.threshold : defaults.bands!.low.threshold,
        knee: typeof data?.bands?.low?.knee === 'number' ? data.bands.low.knee : defaults.bands!.low.knee,
        ratio: typeof data?.bands?.low?.ratio === 'number' ? data.bands.low.ratio : defaults.bands!.low.ratio,
        attack: typeof data?.bands?.low?.attack === 'number' ? data.bands.low.attack : defaults.bands!.low.attack,
        release: typeof data?.bands?.low?.release === 'number' ? data.bands.low.release : defaults.bands!.low.release,
        makeupGain: typeof data?.bands?.low?.makeupGain === 'number' ? data.bands.low.makeupGain : defaults.bands!.low.makeupGain,
      },
      mid: {
        threshold: typeof data?.bands?.mid?.threshold === 'number' ? data.bands.mid.threshold : defaults.bands!.mid.threshold,
        knee: typeof data?.bands?.mid?.knee === 'number' ? data.bands.mid.knee : defaults.bands!.mid.knee,
        ratio: typeof data?.bands?.mid?.ratio === 'number' ? data.bands.mid.ratio : defaults.bands!.mid.ratio,
        attack: typeof data?.bands?.mid?.attack === 'number' ? data.bands.mid.attack : defaults.bands!.mid.attack,
        release: typeof data?.bands?.mid?.release === 'number' ? data.bands.mid.release : defaults.bands!.mid.release,
        makeupGain: typeof data?.bands?.mid?.makeupGain === 'number' ? data.bands.mid.makeupGain : defaults.bands!.mid.makeupGain,
      },
      high: {
        threshold: typeof data?.bands?.high?.threshold === 'number' ? data.bands.high.threshold : defaults.bands!.high.threshold,
        knee: typeof data?.bands?.high?.knee === 'number' ? data.bands.high.knee : defaults.bands!.high.knee,
        ratio: typeof data?.bands?.high?.ratio === 'number' ? data.bands.high.ratio : defaults.bands!.high.ratio,
        attack: typeof data?.bands?.high?.attack === 'number' ? data.bands.high.attack : defaults.bands!.high.attack,
        release: typeof data?.bands?.high?.release === 'number' ? data.bands.high.release : defaults.bands!.high.release,
        makeupGain: typeof data?.bands?.high?.makeupGain === 'number' ? data.bands.high.makeupGain : defaults.bands!.high.makeupGain,
      },
    },
    limiter: {
      threshold: typeof data?.limiter?.threshold === 'number' ? data.limiter.threshold : defaults.limiter!.threshold,
      attack: typeof data?.limiter?.attack === 'number' ? data.limiter.attack : defaults.limiter!.attack,
      release: typeof data?.limiter?.release === 'number' ? data.limiter.release : defaults.limiter!.release,
    },
    restoration: {
      deNoise: typeof data?.restoration?.deNoise === 'number' ? data.restoration.deNoise : defaults.restoration!.deNoise,
      deClip: typeof data?.restoration?.deClip === 'number' ? data.restoration.deClip : defaults.restoration!.deClip,
      deReverb: typeof data?.restoration?.deReverb === 'number' ? data.restoration.deReverb : defaults.restoration!.deReverb,
    },
    finalGain: typeof data?.finalGain === 'number' ? data.finalGain : defaults.finalGain!,
  };

  return validated;
};

export const generateMasteringReport = async (
  trackName: string,
  settings: MasteringSettings,
  apiKey: string | undefined,
  setIsLoading: (loading: boolean) => void,
  setErrorMessage: (message: string | null) => void
): Promise<string> => {
  setIsLoading(true);
  setErrorMessage(null);
  try {
  if (!apiKey) {
      return "AI insights unavailable - API key not configured.";
  }
    
  const ai = new GoogleGenAI({ apiKey });

  const loudnessTargetString = typeof settings.loudnessTarget === 'string' 
    ? settings.loudnessTarget 
    : `${settings.customLoudnessValue} LUFS`;

  const prompt = `
    You are 'Afromaster', an expert AI mastering engineer specializing in Afrobeats, Amapiano, Hip Hop, and Trap music.
    A track named "${trackName}" is being submitted for mastering with the following preferences:
    - Genre: ${settings.genre}
    - Target Loudness: ${loudnessTargetString}
    - Tone Preference: ${settings.tonePreference}
    - Stereo Width: ${settings.stereoWidth}
    ${settings.referenceTrackFile ? `- Inspired by reference track: ${settings.referenceTrackFile.name}` : ''}
    ${settings.referenceUrl ? `- Reference Link: ${settings.referenceUrl} (Extract the sonic blueprint from this known track)` : ''}

    Briefly describe the key processing steps you would take to achieve these mastering goals.
    If a Reference Link is provided, describe the specific sonic characteristics of that track (e.g., "The Burna Boy track has a signature warm low-mid presence") and how you will replicate them.
    Focus on 2-4 main actions. Respond with a short paragraph. Just plain text.
  `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.6,
      },
    });
    return response.text;
  } catch (error: unknown) {
    console.error("Error generating mastering report from Gemini:", error);
    let message = "AI insights temporarily unavailable.";
    if (error instanceof Error) {
      message = error.message;
    }
    setErrorMessage(`Failed to generate AI report: ${message}`);
    return message;
  } finally {
    setIsLoading(false);
  }
};
