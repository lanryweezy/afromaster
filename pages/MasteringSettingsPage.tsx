
import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage, MasteringSettings, AIPreset } from '../types';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import AIPresetCard from '../components/AIPresetCard';
import LoadingSpinner from '../components/LoadingSpinner';
import FileUpload from '../components/FileUpload';
import Slider from '../components/Slider'; // Import the new Slider component
import { fetchAIPresets } from '../services/geminiService';
import { Genre, LoudnessTarget, TonePreference, StereoWidth, GENRE_OPTIONS, LOUDNESS_TARGET_OPTIONS, TONE_PREFERENCE_OPTIONS, STEREO_WIDTH_OPTIONS, IconArrowRight, IconSparkles, IconArrowLeft } from '../constants';

const MasteringSettingsPage: React.FC = () => {
  const { 
    setCurrentPage, 
    uploadedTrack, 
    masteringSettings, 
    setMasteringSettings,
    apiKey 
  } = useAppContext();
  
  const [currentSettings, setCurrentSettings] = useState<MasteringSettings>(
    masteringSettings || {
      genre: Genre.POP,
      loudnessTarget: LoudnessTarget.STREAMING_STANDARD,
      tonePreference: TonePreference.BALANCED,
      stereoWidth: StereoWidth.STANDARD,
      customLoudnessValue: -14,
      referenceTrackFile: null,
      compressionAmount: 50,
      saturationAmount: 0,
      bassBoost: 0,
      trebleBoost: 0,
    }
  );
  const [aiPresets, setAiPresets] = useState<AIPreset[]>([]);
  const [isLoadingPresets, setIsLoadingPresets] = useState(false);
  const [errorPresets, setErrorPresets] = useState<string | null>(null);
  const [selectedPresetName, setSelectedPresetName] = useState<string | null>(null);

  useEffect(() => {
    if (!uploadedTrack) {
      setCurrentPage(AppPage.UPLOAD); 
    }
     // Sync with global settings if they exist (e.g. on revisit)
    if (masteringSettings) {
        setCurrentSettings(masteringSettings);
    }
  }, [uploadedTrack, setCurrentPage, masteringSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumberInput = type === 'number' || type === 'range';

    setCurrentSettings(prev => {
        const newSettings = {...prev, [name]: isNumberInput ? parseFloat(value) : value };

        if (name === "loudnessTarget" && value !== LoudnessTarget.CUSTOM) {
            const lufsMatch = value.match(/(-?\d+)\s*LUFS/);
            if (lufsMatch && lufsMatch[1]) {
                newSettings.customLoudnessValue = parseInt(lufsMatch[1], 10);
            }
        }
        return newSettings;
    });
    setSelectedPresetName(null); 
  };

  const handleReferenceFileAccepted = (file: File) => {
    setCurrentSettings(prev => ({ ...prev, referenceTrackFile: file }));
  };

  const handleReferenceFileCleared = () => {
    setCurrentSettings(prev => ({ ...prev, referenceTrackFile: null }));
  };

  const handleGetAIPresets = useCallback(async () => {
    if (!uploadedTrack || !apiKey) {
      setErrorPresets(apiKey ? "No track uploaded to analyze." : "API Key is not configured.");
      return;
    }
    setIsLoadingPresets(true);
    setErrorPresets(null);
    try {
      const refTrackName = currentSettings.referenceTrackFile ? currentSettings.referenceTrackFile.name : undefined;
      const presets = await fetchAIPresets(currentSettings.genre, uploadedTrack.name, apiKey, refTrackName);
      setAiPresets(presets);
    } catch (err: any) {
      setErrorPresets(err.message || "Failed to fetch AI presets.");
      setAiPresets([]);
    } finally {
      setIsLoadingPresets(false);
    }
  }, [uploadedTrack, currentSettings.genre, currentSettings.referenceTrackFile, apiKey]);


  const applyAIPreset = (preset: AIPreset) => {
    const presetSettings = preset.settings;
    const newSettings = { ...currentSettings };

    if (presetSettings.loudnessTarget) {
      const matchedLoudness = findClosestEnumValue(presetSettings.loudnessTarget, LOUDNESS_TARGET_OPTIONS as LoudnessTarget[]);
      if (matchedLoudness) {
        newSettings.loudnessTarget = matchedLoudness;
        if (matchedLoudness === LoudnessTarget.CUSTOM) {
          const lufsValue = parseFloat(presetSettings.loudnessTarget);
          newSettings.customLoudnessValue = isNaN(lufsValue) ? -14 : lufsValue;
        } else {
           const lufsMatch = presetSettings.loudnessTarget.match(/(-?\d+)\s*LUFS/);
            if (lufsMatch && lufsMatch[1]) {
                newSettings.customLoudnessValue = parseInt(lufsMatch[1], 10);
            }
        }
      } else {
        newSettings.loudnessTarget = LoudnessTarget.CUSTOM;
        const lufsValue = parseFloat(presetSettings.loudnessTarget);
        newSettings.customLoudnessValue = isNaN(lufsValue) ? -14 : lufsValue;
      }
    }

    if (presetSettings.tonePreference) {
      newSettings.tonePreference = findClosestEnumValue(presetSettings.tonePreference, TONE_PREFERENCE_OPTIONS as TonePreference[]) || TonePreference.BALANCED;
    }

    if (presetSettings.stereoWidth) {
      newSettings.stereoWidth = findClosestEnumValue(presetSettings.stereoWidth, STEREO_WIDTH_OPTIONS as StereoWidth[]) || StereoWidth.STANDARD;
    }
    
    // Reset advanced sliders to defaults when applying a broad preset
    newSettings.compressionAmount = 50;
    newSettings.saturationAmount = 0;
    newSettings.bassBoost = 0;
    newSettings.trebleBoost = 0;
    
    setCurrentSettings(newSettings);
    setSelectedPresetName(preset.name);
  };
  
  const findClosestEnumValue = <T extends string,>(value: string, enumValues: T[]): T | undefined => {
    const normalizedValue = value.toLowerCase().replace(/\s+/g, '');
    for (const enumVal of enumValues) {
        if (typeof enumVal === 'string' && enumVal.toLowerCase().replace(/\s/g, '').includes(normalizedValue)) {
            return enumVal;
        }
    }
    if (value.toLowerCase().includes('lufs')) {
      const lufsVal = parseFloat(value);
      const found = enumValues.find(ev => typeof ev === 'string' && ev.includes(String(lufsVal)));
      if (found) return found;
      return enumValues.find(ev => typeof ev === 'string' && ev.toLowerCase().includes('custom')) as T | undefined;
    }
    return undefined;
  };


  const handleSubmit = () => {
    setMasteringSettings(currentSettings);
    setCurrentPage(AppPage.PROCESSING);
  };

  if (!uploadedTrack) return <LoadingSpinner text="Loading track data..." />;

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-2xl card-accent">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <div>
            <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-gradient-primary">Craft Your Signature Sound</h2>
            <p className="text-slate-300 mt-1">Fine-tune the settings for <span className="font-semibold text-primary-focus transition-colors">{uploadedTrack.name}</span>.</p>
        </div>
        <Button onClick={() => setCurrentPage(AppPage.UPLOAD)} variant="secondary" size="sm" leftIcon={<IconArrowLeft />}>
          Back
        </Button>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
            <h3 className="text-2xl font-heading text-primary-focus transition-colors mb-4 border-b-2 border-slate-700 pb-2">Manual Controls</h3>
            <div className="space-y-4">
                <Dropdown label="Genre" name="genre" options={GENRE_OPTIONS} value={currentSettings.genre} onChange={handleInputChange} />
                <Dropdown label="Target Loudness" name="loudnessTarget" options={LOUDNESS_TARGET_OPTIONS} value={currentSettings.loudnessTarget as LoudnessTarget} onChange={handleInputChange} />
                {currentSettings.loudnessTarget === LoudnessTarget.CUSTOM && (
                    <div className="pl-4 border-l-2 border-slate-700">
                        <label htmlFor="customLoudnessValue" className="block text-sm font-medium text-slate-300 mb-2">Custom LUFS Value (e.g. -12)</label>
                        <input
                            type="number"
                            name="customLoudnessValue"
                            id="customLoudnessValue"
                            value={currentSettings.customLoudnessValue || ''}
                            onChange={handleInputChange}
                            placeholder="-14"
                            step="0.1"
                            className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg shadow-sm focus:ring-primary focus:border-primary transition-colors"
                        />
                    </div>
                )}
                <Dropdown label="Tone Preference" name="tonePreference" options={TONE_PREFERENCE_OPTIONS} value={currentSettings.tonePreference} onChange={handleInputChange} />
                <Dropdown label="Stereo Width" name="stereoWidth" options={STEREO_WIDTH_OPTIONS} value={currentSettings.stereoWidth} onChange={handleInputChange} />
                
                <div className="pt-4 space-y-6">
                    <Slider
                        label="Compression Intensity"
                        name="compressionAmount"
                        min={0} max={100} step={1}
                        value={currentSettings.compressionAmount}
                        onChange={handleInputChange}
                        unit="%"
                    />
                    <Slider
                        label="Analog Saturation"
                        name="saturationAmount"
                        min={0} max={100} step={1}
                        value={currentSettings.saturationAmount}
                        onChange={handleInputChange}
                        unit="%"
                    />
                    <Slider
                        label="Bass Emphasis"
                        name="bassBoost"
                        min={-6} max={6} step={0.5}
                        value={currentSettings.bassBoost}
                        onChange={handleInputChange}
                        unit="dB"
                    />
                    <Slider
                        label="Treble Emphasis"
                        name="trebleBoost"
                        min={-6} max={6} step={0.5}
                        value={currentSettings.trebleBoost}
                        onChange={handleInputChange}
                        unit="dB"
                    />
                </div>

                <div className="pt-4">
                  <FileUpload
                    label="Match a Reference Track (Optional)"
                    onFileAccepted={handleReferenceFileAccepted}
                    onFileCleared={handleReferenceFileCleared}
                    existingFile={currentSettings.referenceTrackFile || null}
                    id="reference-track-upload"
                  />
                </div>
            </div>
        </div>

        <div>
            <h3 className="text-2xl font-heading text-primary mb-4 border-b-2 border-slate-700 pb-2">AI Suggestions</h3>
            <div className="mb-6 text-center bg-slate-800/50 p-4 rounded-lg">
                <Button onClick={handleGetAIPresets} isLoading={isLoadingPresets} disabled={isLoadingPresets || !apiKey} leftIcon={<IconSparkles className="w-5 h-5"/>}>
                {apiKey ? 'Get AI Preset Suggestions' : 'Configure API Key for AI Presets'}
                </Button>
                {errorPresets && <p className="text-red-400 text-sm mt-2">{errorPresets}</p>}
            </div>

            {isLoadingPresets && <LoadingSpinner text="Generating AI Presets..." className="my-6" />}
            
            {!isLoadingPresets && aiPresets.length > 0 && (
                <div className="space-y-4">
                    {aiPresets.map(preset => (
                    <AIPresetCard 
                        key={preset.name} 
                        preset={preset} 
                        onApply={() => applyAIPreset(preset)}
                        isSelected={selectedPresetName === preset.name}
                    />
                    ))}
                </div>
            )}
             {!isLoadingPresets && aiPresets.length === 0 && !errorPresets && (
                <div className="text-center p-6 bg-slate-800/50 rounded-lg">
                    <IconSparkles className="w-10 h-10 mx-auto text-slate-500 mb-2"/>
                    <p className="text-slate-400">Click the button above to get personalized presets for your track.</p>
                </div>
             )}
        </div>
      </div>
      
      <div className="mt-10 pt-6 border-t border-slate-800 text-right">
        <Button onClick={handleSubmit} size="lg" rightIcon={<IconArrowRight className="w-5 h-5"/>}>
          Start Mastering
        </Button>
      </div>
    </div>
  );
};

export default MasteringSettingsPage;
