import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MasteringSettings } from '../types';

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

    // Simplified prompt for better reliability
    const prompt = `You are an expert mastering engineer. Generate mastering settings for a ${genre} track called "${trackName}".

Return ONLY a JSON object with this exact structure:
{
  "crossover": {"lowPass": 250, "highPass": 4000},
  "eq": {"bassFreq": 200, "trebleFreq": 5000, "bassGain": 0, "trebleGain": 0},
  "saturation": {"amount": 0},
  "preGain": 1.0,
      "bands": {
    "low": {"threshold": -35, "knee": 15, "ratio": 4, "attack": 0.05, "release": 0.3, "makeupGain": 2.0},
    "mid": {"threshold": -30, "knee": 10, "ratio": 3, "attack": 0.01, "release": 0.25, "makeupGain": 2.0},
    "high": {"threshold": -25, "knee": 5, "ratio": 3, "attack": 0.005, "release": 0.15, "makeupGain": 1.5}
  },
  "limiter": {"threshold": -1.5, "attack": 0.002, "release": 0.05},
  "finalGain": 1.0
}

Adjust the values based on the genre. For ${genre}, focus on appropriate frequency ranges and compression settings.`;

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
    const validatedData = validateAndFixAISettings(parsedData);
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

// Helper function to get default AI settings based on genre
const getDefaultAISettings = (genre: string): Partial<MasteringSettings> => {
  const baseSettings = {
    crossover: { lowPass: 250, highPass: 4000 },
    eq: { bassFreq: 200, trebleFreq: 5000, bassGain: 0, trebleGain: 0 },
    saturation: { amount: 0 },
    preGain: 1.0,
    bands: {
      low: { threshold: -35, knee: 15, ratio: 4, attack: 0.05, release: 0.3, makeupGain: 2.0 },
      mid: { threshold: -30, knee: 10, ratio: 3, attack: 0.01, release: 0.25, makeupGain: 2.0 },
      high: { threshold: -25, knee: 5, ratio: 3, attack: 0.005, release: 0.15, makeupGain: 1.5 },
    },
    limiter: { threshold: -1.5, attack: 0.002, release: 0.05 },
    finalGain: 1.0,
  };

  // Genre-specific adjustments
  switch (genre.toLowerCase()) {
    case 'afrobeats':
    case 'amapiano':
      return {
        ...baseSettings,
        eq: { ...baseSettings.eq, bassGain: 2, trebleGain: 1 },
        saturation: { amount: 15 },
        bands: {
          ...baseSettings.bands,
          low: { ...baseSettings.bands.low, threshold: -30, makeupGain: 3.0 },
        },
      };
    case 'hip hop':
    case 'trap':
      return {
        ...baseSettings,
        eq: { ...baseSettings.eq, bassGain: 3, trebleGain: 0 },
        saturation: { amount: 20 },
        bands: {
          ...baseSettings.bands,
          low: { ...baseSettings.bands.low, threshold: -25, makeupGain: 4.0 },
        },
      };
    case 'pop':
      return {
        ...baseSettings,
        eq: { ...baseSettings.eq, bassGain: 1, trebleGain: 2 },
        saturation: { amount: 10 },
      };
    default:
      return baseSettings;
  }
};

// Helper function to validate and fix AI settings
const validateAndFixAISettings = (data: unknown): Partial<MasteringSettings> => {
  const defaults = getDefaultAISettings('Pop');
  
  // Ensure all required properties exist with proper types
  const validated = {
    crossover: {
      lowPass: typeof data?.crossover?.lowPass === 'number' ? data.crossover.lowPass : defaults.crossover.lowPass,
      highPass: typeof data?.crossover?.highPass === 'number' ? data.crossover.highPass : defaults.crossover.highPass,
    },
    eq: {
      bassFreq: typeof data?.eq?.bassFreq === 'number' ? data.eq.bassFreq : defaults.eq.bassFreq,
      trebleFreq: typeof data?.eq?.trebleFreq === 'number' ? data.eq.trebleFreq : defaults.eq.trebleFreq,
      bassGain: typeof data?.eq?.bassGain === 'number' ? data.eq.bassGain : defaults.eq.bassGain,
      trebleGain: typeof data?.eq?.trebleGain === 'number' ? data.eq.trebleGain : defaults.eq.trebleGain,
    },
    saturation: {
      amount: typeof data?.saturation?.amount === 'number' ? data.saturation.amount : defaults.saturation.amount,
    },
    preGain: typeof data?.preGain === 'number' ? data.preGain : defaults.preGain,
    bands: {
      low: {
        threshold: typeof data?.bands?.low?.threshold === 'number' ? data.bands.low.threshold : defaults.bands.low.threshold,
        knee: typeof data?.bands?.low?.knee === 'number' ? data.bands.low.knee : defaults.bands.low.knee,
        ratio: typeof data?.bands?.low?.ratio === 'number' ? data.bands.low.ratio : defaults.bands.low.ratio,
        attack: typeof data?.bands?.low?.attack === 'number' ? data.bands.low.attack : defaults.bands.low.attack,
        release: typeof data?.bands?.low?.release === 'number' ? data.bands.low.release : defaults.bands.low.release,
        makeupGain: typeof data?.bands?.low?.makeupGain === 'number' ? data.bands.low.makeupGain : defaults.bands.low.makeupGain,
      },
      mid: {
        threshold: typeof data?.bands?.mid?.threshold === 'number' ? data.bands.mid.threshold : defaults.bands.mid.threshold,
        knee: typeof data?.bands?.mid?.knee === 'number' ? data.bands.mid.knee : defaults.bands.mid.knee,
        ratio: typeof data?.bands?.mid?.ratio === 'number' ? data.bands.mid.ratio : defaults.bands.mid.ratio,
        attack: typeof data?.bands?.mid?.attack === 'number' ? data.bands.mid.attack : defaults.bands.mid.attack,
        release: typeof data?.bands?.mid?.release === 'number' ? data.bands.mid.release : defaults.bands.mid.release,
        makeupGain: typeof data?.bands?.mid?.makeupGain === 'number' ? data.bands.mid.makeupGain : defaults.bands.mid.makeupGain,
      },
      high: {
        threshold: typeof data?.bands?.high?.threshold === 'number' ? data.bands.high.threshold : defaults.bands.high.threshold,
        knee: typeof data?.bands?.high?.knee === 'number' ? data.bands.high.knee : defaults.bands.high.knee,
        ratio: typeof data?.bands?.high?.ratio === 'number' ? data.bands.high.ratio : defaults.bands.high.ratio,
        attack: typeof data?.bands?.high?.attack === 'number' ? data.bands.high.attack : defaults.bands.high.attack,
        release: typeof data?.bands?.high?.release === 'number' ? data.bands.high.release : defaults.bands.high.release,
        makeupGain: typeof data?.bands?.high?.makeupGain === 'number' ? data.bands.high.makeupGain : defaults.bands.high.makeupGain,
      },
    },
    limiter: {
      threshold: typeof data?.limiter?.threshold === 'number' ? data.limiter.threshold : defaults.limiter.threshold,
      attack: typeof data?.limiter?.attack === 'number' ? data.limiter.attack : defaults.limiter.attack,
      release: typeof data?.limiter?.release === 'number' ? data.limiter.release : defaults.limiter.release,
    },
    finalGain: typeof data?.finalGain === 'number' ? data.finalGain : defaults.finalGain,
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

    Briefly describe the key processing steps you would take to achieve these mastering goals.
    Focus on 2-4 main actions or considerations (e.g., "Gentle low-end boost for warmth", "Subtle high-frequency lift for clarity", "Overall dynamic range control to meet loudness target", "Careful stereo widening to enhance immersion without phase issues").
    Keep the description concise and suitable for a user to understand as a quick insight into the AI's 'thinking' process.
    Respond with a short paragraph or a few bullet points. Do not use markdown formatting like backticks or #. Just plain text.
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
