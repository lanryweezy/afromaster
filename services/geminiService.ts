import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AIPreset, MasteringSettings } from '../types';

export const fetchAIPresets = async (
  genre: string, 
  trackName: string, 
  apiKey: string,
  referenceTrackName?: string // Optional reference track name
): Promise<AIPreset[]> => {
  if (!apiKey) {
    throw new Error("Gemini API key is not provided.");
  }
  const ai = new GoogleGenAI({ apiKey });

  let prompt = `
    You are 'Afromaster', an expert AI mastering engineer specializing in Afrobeats, Amapiano, Hip Hop, and Trap music. The user is looking for presets that will make their track sound professional, punchy, and ready for streaming platforms and clubs, fitting within modern Afrobeats and Trap aesthetics.
    For a track with the following details:
    - Genre: ${genre}
    - Tentative Name / Keywords: ${trackName}`;

  if (referenceTrackName) {
    prompt += `
    - Reference Track Inspiration: ${referenceTrackName}`;
  }

  prompt += `

    Suggest 3 distinct mastering presets. Your goal is to provide varied options that enhance the track appropriately for its genre and common listening contexts.
    Consider the reference track inspiration if provided, to tailor suggestions that might align with its character, while still offering variety.
    
    For each preset, provide:
    1. "name": A catchy and descriptive name for the preset (e.g., "Lagos Club Banger", "OVO Drizzy Vibe", "Amapiano Groove").
    2. "description": A brief explanation of what the preset aims to achieve and its sonic character.
    3. "settings": An object containing specific mastering parameter suggestions:
        - "loudnessTarget": A target loudness level string (e.g., "-14 LUFS (Spotify Standard)", "-10 LUFS (Club Master)", "-9 LUFS (Aggressive Pop)").
        - "tonePreference": A descriptive tone (e.g., "Warm & Smooth", "Bright & Punchy", "Balanced & Natural", "Crisp Highs & Tight Lows").
        - "stereoWidth": A description of the stereo image (e.g., "Standard Stereo", "Wide & Immersive", "Focused Center", "Enhanced Sides").

    Respond ONLY with a valid JSON array of these preset objects. Do not include any other text, markdown, or explanations outside the JSON array.
    Example of one preset object in the array:
    {
      "name": "Lagos Club Banger",
      "description": "Maximizes low-end punch and stereo width for a sound that translates perfectly to large sound systems.",
      "settings": {
        "loudnessTarget": "-8 LUFS (Club Ready)",
        "tonePreference": "Punchy & Dynamic",
        "stereoWidth": "Wide & Immersive"
      }
    }
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.75, // Slightly increased for more varied suggestions with reference
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
        console.error("Raw Gemini Response Text for presets:", response.text);
        throw new Error("Failed to parse AI presets JSON from Gemini response. The response was not valid JSON.");
    }

    if (Array.isArray(parsedData)) {
        if (parsedData.length > 0 && parsedData.every(p => p.name && p.description && p.settings && 
            typeof p.settings.loudnessTarget === 'string' &&
            typeof p.settings.tonePreference === 'string' &&
            typeof p.settings.stereoWidth === 'string')) {
            return parsedData as AIPreset[];
        }
    } else if (typeof parsedData === 'object' && parsedData !== null) {
        const commonKeys = ['presets', 'suggestions', 'data', 'results'];
        for (const key of commonKeys) {
            if (Array.isArray(parsedData[key]) && parsedData[key].every((p: any) => p.name && p.description && p.settings &&
                typeof p.settings.loudnessTarget === 'string' &&
                typeof p.settings.tonePreference === 'string' &&
                typeof p.settings.stereoWidth === 'string')) {
                return parsedData[key] as AIPreset[];
            }
        }
    }
    
    console.warn("AI presets response was valid JSON but not in the expected array format or content.", parsedData);
    throw new Error("AI presets received, but data format is unexpected. Ensure presets have name, description, and settings with loudnessTarget, tonePreference, and stereoWidth as strings.");

  } catch (error: any) {
    console.error("Error fetching AI presets from Gemini:", error);
    if (error.message && error.message.includes("API key not valid")) {
        throw new Error("Invalid API Key for Gemini. Please check your configuration.");
    }
    if (error.message && (error.message.toLowerCase().includes("quota") || error.message.toLowerCase().includes("rate limit"))) {
        throw new Error("API quota exceeded or rate limit hit. Please try again later.");
    }
    throw new Error(`Failed to fetch AI presets: ${error.message || 'Unknown error'}`);
  }
};


export const generateMasteringReport = async (
  trackName: string,
  settings: MasteringSettings,
  apiKey: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("Gemini API key is not provided.");
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
  } catch (error: any) {
    console.error("Error generating mastering report from Gemini:", error);
    if (error.message && error.message.includes("API key not valid")) {
      throw new Error("Invalid API Key for Gemini. Please check your configuration for report generation.");
    }
    if (error.message && (error.message.toLowerCase().includes("quota") || error.message.toLowerCase().includes("rate limit"))) {
        throw new Error("API quota exceeded or rate limit hit while generating report. Please try again later.");
    }
    throw new Error(`Failed to generate mastering report: ${error.message || 'Unknown error'}`);
  }
};
