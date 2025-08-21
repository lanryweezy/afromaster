import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MasteringSettings } from '../types';

export const fetchAIChainSettings = async (
  genre: string,
  trackName: string,
  apiKey: string,
  referenceAnalysis?: Record<string, unknown> | null
): Promise<Partial<MasteringSettings>> => {
  if (!apiKey) {
    throw new Error("Gemini API key is not provided.");
  }
  const ai = new GoogleGenAI({ apiKey });

  let prompt = `
    You are 'Afromaster', an expert AI mastering engineer specializing in Afrobeats, Amapiano, Hip Hop, and Trap music.
    Generate a detailed mastering chain configuration for a track with the following details:
    - Genre: ${genre}
    - Tentative Name / Keywords: ${trackName}`;

  if (referenceAnalysis) {
    prompt += `
    - Reference Track Analysis:
      - Loudness: ${referenceAnalysis.loudness?.toFixed(2) || 'N/A'} dB
      - Spectral Balance: Bass: ${(referenceAnalysis.spectralBalance?.bass * 100)?.toFixed(1) || 'N/A'}%, Mid: ${(referenceAnalysis.spectralBalance?.mid * 100)?.toFixed(1) || 'N/A'}%, Treble: ${(referenceAnalysis.spectralBalance?.treble * 100)?.toFixed(1) || 'N/A'}%
      - Peak: ${referenceAnalysis.peak?.toFixed(2) || 'N/A'} dB`;
  }

  prompt += `

    Your task is to return a JSON object representing the mastering chain settings.
    The structure of the JSON object should be as follows:
    {
      "crossover": { "lowPass": number, "highPass": number },
      "eq": { "bassFreq": number, "trebleFreq": number, "bassGain": number, "trebleGain": number },
      "saturation": { "amount": number },
      "preGain": number,
      "bands": {
        "low": { "threshold": number, "knee": number, "ratio": number, "attack": number, "release": number, "makeupGain": number },
        "mid": { "threshold": number, "knee": number, "ratio": number, "attack": number, "release": number, "makeupGain": number },
        "high": { "threshold": number, "knee": number, "ratio": number, "attack": number, "release": number, "makeupGain": number }
      },
      "limiter": { "threshold": number, "attack": number, "release": number },
      "finalGain": number
    }

    Respond ONLY with a valid JSON object. Do not include any other text, markdown, or explanations outside the JSON object.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8,
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    let parsedData;
    try {
        parsedData = JSON.parse(jsonStr);
    } catch(e) {
        console.error("Initial JSON.parse failed:", e);
        console.error("Raw Gemini Response Text for settings:", response.text);
        throw new Error("Failed to parse AI settings JSON from Gemini response.");
    }

    if (!validateAIChainSettings(parsedData)) {
      console.error("AI response failed validation:", parsedData);
      throw new Error("AI response did not match the expected schema.");
    }

    // Ensure defaults for optional or omitted fields
    const withDefaults = {
      ...parsedData,
      saturation: {
        flavor: 'tape',
        amount: typeof parsedData?.saturation?.amount === 'number' ? parsedData.saturation.amount : 0,
      },
    };

    return withDefaults;

  } catch (error: unknown) {
    console.error("Error fetching AI chain settings from Gemini:", error);
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    if (errorMessage.includes("API key not valid")) {
        throw new Error("Invalid API Key for Gemini. Please check your configuration.");
    }
    if (errorMessage.toLowerCase().includes("quota") || errorMessage.toLowerCase().includes("rate limit")) {
        throw new Error("API quota exceeded or rate limit hit. Please try again later.");
    }
    throw new Error(`Failed to fetch AI chain settings: ${errorMessage}`);
  }
};

const validateAIChainSettings = (data: Partial<MasteringSettings>): boolean => {
  if (typeof data !== 'object' || data === null) return false;
      const has = (prop: keyof Partial<MasteringSettings>) => Object.prototype.hasOwnProperty.call(data, prop);
  if (!has('crossover') || !has('eq') || !has('saturation') || !has('preGain') || !has('bands') || !has('limiter') || !has('finalGain')) {
    return false;
  }
  if (typeof data.crossover.lowPass !== 'number' || typeof data.crossover.highPass !== 'number') return false;
  if (typeof data.eq.bassFreq !== 'number' || typeof data.eq.trebleFreq !== 'number' || typeof data.eq.bassGain !== 'number' || typeof data.eq.trebleGain !== 'number') return false;
  if (typeof data.saturation.amount !== 'number') return false;
  if (typeof data.preGain !== 'number') return false;
  if (typeof data.finalGain !== 'number') return false;
  if (typeof data.limiter.threshold !== 'number' || typeof data.limiter.attack !== 'number' || typeof data.limiter.release !== 'number') return false;
      const bandSchema = (band: { threshold: number; knee: number; ratio: number; attack: number; release: number; makeupGain: number }) => typeof band.threshold === 'number' && typeof band.knee === 'number' && typeof band.ratio === 'number' && typeof band.attack === 'number' && typeof band.release === 'number' && typeof band.makeupGain === 'number';
  if (!bandSchema(data.bands.low) || !bandSchema(data.bands.mid) || !bandSchema(data.bands.high)) return false;
  return true;
};

export const generateMasteringReport = async (
  trackName: string,
  settings: MasteringSettings,
  apiKey?: string
): Promise<string> => {
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

  try {
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
    return "AI insights temporarily unavailable.";
  }
};