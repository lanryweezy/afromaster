import React from 'react';
import { AIPreset, MasteringSettings } from '../types';
import Button from './Button';
import { IconSparkles, LoudnessTarget, TonePreference, StereoWidth, LOUDNESS_TARGET_OPTIONS, TONE_PREFERENCE_OPTIONS, STEREO_WIDTH_OPTIONS } from '../constants';

interface AIPresetCardProps {
  preset: AIPreset;
  onApply: (settings: Partial<MasteringSettings>) => void;
  isSelected: boolean;
}

// Helper to find the enum value that best matches the string from AI
const findClosestEnumValue = <T extends string,>(value: string, enumValues: T[]): T | undefined => {
  const normalizedValue = value.toLowerCase().replace(/\s+/g, '');
  for (const enumVal of enumValues) {
      if (typeof enumVal === 'string' && enumVal.toLowerCase().replace(/\s+/g, '').includes(normalizedValue)) {
          return enumVal;
      }
  }
  // If LUFS value, try to match to Custom or specific LUFS enum
  if (value.toLowerCase().includes('lufs')) {
    const lufsVal = parseFloat(value);
    const found = enumValues.find(ev => typeof ev === 'string' && ev.includes(String(lufsVal)));
    if (found) return found;
    return enumValues.find(ev => typeof ev === 'string' && ev.toLowerCase().includes('custom')) as T | undefined;
  }
  return undefined;
};


const AIPresetCard: React.FC<AIPresetCardProps> = ({ preset, onApply, isSelected }) => {
  
  const handleApplyPreset = () => {
    const parsedSettings: Partial<MasteringSettings> = {};
    
    // Try to map AI string suggestions to enum values
    if (preset.settings.loudnessTarget) {
      const matchedLoudness = findClosestEnumValue(preset.settings.loudnessTarget, LOUDNESS_TARGET_OPTIONS as LoudnessTarget[]);
      if (matchedLoudness) {
        parsedSettings.loudnessTarget = matchedLoudness;
        if (matchedLoudness === LoudnessTarget.CUSTOM) {
          const lufsValue = parseFloat(preset.settings.loudnessTarget);
          if (!isNaN(lufsValue)) {
            parsedSettings.customLoudnessValue = lufsValue;
          }
        }
      } else {
         // Fallback if no match - could set to custom and parse value or use a default
        parsedSettings.loudnessTarget = LoudnessTarget.CUSTOM;
        const lufsValue = parseFloat(preset.settings.loudnessTarget);
        parsedSettings.customLoudnessValue = isNaN(lufsValue) ? -14 : lufsValue;
      }
    }

    if (preset.settings.tonePreference) {
      parsedSettings.tonePreference = findClosestEnumValue(preset.settings.tonePreference, TONE_PREFERENCE_OPTIONS as TonePreference[]) || TonePreference.BALANCED;
    }

    if (preset.settings.stereoWidth) {
      parsedSettings.stereoWidth = findClosestEnumValue(preset.settings.stereoWidth, STEREO_WIDTH_OPTIONS as StereoWidth[]) || StereoWidth.STANDARD;
    }
    
    onApply(parsedSettings);
  };

  return (
    <div className={`bg-slate-800/60 backdrop-blur-md p-5 rounded-lg shadow-md border transition-all duration-200 card-accent ${isSelected ? 'border-primary shadow-primary/20' : 'border-slate-700/50 hover:border-slate-600'}`}>
      <div className="flex items-center mb-2">
        <IconSparkles className="w-6 h-6 text-yellow-400 mr-3" />
        <h3 className="text-lg font-bold font-heading text-primary-focus">{preset.name}</h3>
      </div>
      <p className="text-sm text-white mb-4 h-16">{preset.description}</p>
      <div className="text-xs text-white space-y-1 mb-4 border-l-2 border-slate-700 pl-3">
        <p><strong>Loudness:</strong> {preset.settings.loudnessTarget}</p>
        <p><strong>Tone:</strong> {preset.settings.tonePreference}</p>
        <p><strong>Stereo:</strong> {preset.settings.stereoWidth}</p>
      </div>
      <Button onClick={handleApplyPreset} variant={isSelected ? "primary" : "ghost"} size="sm" className="w-full">
        {isSelected ? "Applied" : "Apply Preset"}
      </Button>
    </div>
  );
};

export default AIPresetCard;
