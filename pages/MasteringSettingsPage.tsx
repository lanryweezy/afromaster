import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage, MasteringSettings, AIPreset } from '../types';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import AIPresetCard from '../components/AIPresetCard';
import LoadingSpinner from '../components/LoadingSpinner';
import FileUpload from '../components/FileUpload';
import Slider from '../components/Slider';
import { fetchAIPresets } from '../services/geminiService';
import { Genre, LoudnessTarget, TonePreference, StereoWidth, GENRE_OPTIONS, LOUDNESS_TARGET_OPTIONS, TONE_PREFERENCE_OPTIONS, STEREO_WIDTH_OPTIONS, IconArrowRight, IconSparkles, IconArrowLeft, IconCog, IconMusicNote } from '../constants';

const GENRE_PRESETS: Partial<Record<Genre, { loudnessTarget: LoudnessTarget; tonePreference: TonePreference; stereoWidth: StereoWidth }>> = {
  [Genre.AFROBEATS]: { loudnessTarget: LoudnessTarget.STREAMING_LOUD, tonePreference: TonePreference.WARM, stereoWidth: StereoWidth.WIDE },
  [Genre.AMAPIANO]: { loudnessTarget: LoudnessTarget.CLUB, tonePreference: TonePreference.WARM, stereoWidth: StereoWidth.WIDE },
  [Genre.HIPHOP]: { loudnessTarget: LoudnessTarget.STREAMING_LOUD, tonePreference: TonePreference.PUNCHY, stereoWidth: StereoWidth.STANDARD },
  [Genre.POP]: { loudnessTarget: LoudnessTarget.STREAMING_STANDARD, tonePreference: TonePreference.BALANCED, stereoWidth: StereoWidth.STANDARD },
  [Genre.RB]: { loudnessTarget: LoudnessTarget.STREAMING_STANDARD, tonePreference: TonePreference.WARM, stereoWidth: StereoWidth.WIDE },
  [Genre.EDM]: { loudnessTarget: LoudnessTarget.CLUB, tonePreference: TonePreference.BRIGHT, stereoWidth: StereoWidth.WIDE },
  [Genre.DANCEHALL]: { loudnessTarget: LoudnessTarget.STREAMING_LOUD, tonePreference: TonePreference.PUNCHY, stereoWidth: StereoWidth.WIDE },
  [Genre.ROCK]: { loudnessTarget: LoudnessTarget.STREAMING_LOUD, tonePreference: TonePreference.PUNCHY, stereoWidth: StereoWidth.STANDARD },
  [Genre.JAZZ]: { loudnessTarget: LoudnessTarget.STREAMING_STANDARD, tonePreference: TonePreference.WARM, stereoWidth: StereoWidth.FOCUSED },
};

const MasteringSettingsPage: React.FC = () => {
  const { setCurrentPage, uploadedTrack, masteringSettings, setMasteringSettings, apiKey } = useAppContext();
  const [viewMode, setViewMode] = useState<'simple' | 'advanced'>('simple');
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
    if (!uploadedTrack) setCurrentPage(AppPage.UPLOAD); 
    if (masteringSettings) setCurrentSettings(masteringSettings);
  }, [uploadedTrack, setCurrentPage, masteringSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumberInput = type === 'number' || type === 'range';

    setCurrentSettings(prev => {
        let newSettings = {...prev, [name]: isNumberInput ? parseFloat(value) : value };
        if (name === "loudnessTarget" && value !== LoudnessTarget.CUSTOM) {
            const lufsMatch = value.match(/(-?\d+)\s*LUFS/);
            if (lufsMatch && lufsMatch[1]) newSettings.customLoudnessValue = parseInt(lufsMatch[1], 10);
        }
        if (name === "genre") {
            const preset = GENRE_PRESETS[value as Genre];
            if (preset) {
                newSettings = { ...newSettings, ...preset };
                if (preset.loudnessTarget && preset.loudnessTarget !== LoudnessTarget.CUSTOM) {
                    const lufsMatch = preset.loudnessTarget.match(/(-?\d+)\s*LUFS/);
                    if (lufsMatch && lufsMatch[1]) newSettings.customLoudnessValue = parseInt(lufsMatch[1], 10);
                }
            }
        }
        return newSettings;
    });
    setSelectedPresetName(null); 
  };

  const handleReferenceFileAccepted = (file: File) => setCurrentSettings(prev => ({ ...prev, referenceTrackFile: file }));
  const handleReferenceFileCleared = () => setCurrentSettings(prev => ({ ...prev, referenceTrackFile: null }));

  const handleGetAIPresets = useCallback(async () => {
    if (!uploadedTrack || !apiKey) {
      setErrorPresets(apiKey ? "No track uploaded." : "API Key is not configured.");
      return;
    }
    setIsLoadingPresets(true);
    setErrorPresets(null);
    try {
      const presets = await fetchAIPresets(currentSettings.genre, uploadedTrack.name, apiKey, currentSettings.referenceTrackFile?.name);
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
    const newSettings = { ...currentSettings, compressionAmount: 50, saturationAmount: 0, bassBoost: 0, trebleBoost: 0 };
    // Mapping logic (simplified for brevity, logic remains same as original)
    if (presetSettings.loudnessTarget) {
      const matched = LOUDNESS_TARGET_OPTIONS.find(o => typeof o === 'string' && o.includes(presetSettings.loudnessTarget.split(' ')[0]));
      newSettings.loudnessTarget = matched as LoudnessTarget || LoudnessTarget.CUSTOM;
      const lufs = parseFloat(presetSettings.loudnessTarget);
      if(!isNaN(lufs)) newSettings.customLoudnessValue = lufs;
    }
    if (presetSettings.tonePreference) newSettings.tonePreference = (TONE_PREFERENCE_OPTIONS.find(o => o.includes(presetSettings.tonePreference.split(' ')[0])) as TonePreference) || TonePreference.BALANCED;
    if (presetSettings.stereoWidth) newSettings.stereoWidth = (STEREO_WIDTH_OPTIONS.find(o => o.includes(presetSettings.stereoWidth.split(' ')[0])) as StereoWidth) || StereoWidth.STANDARD;
    
    setCurrentSettings(newSettings);
    setSelectedPresetName(preset.name);
  };

  const handleSubmit = () => {
    setMasteringSettings(currentSettings);
    setCurrentPage(AppPage.PROCESSING);
  };

  if (!uploadedTrack) return <LoadingSpinner text="Loading track..." />;

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
           <div className="flex items-center space-x-2 text-sm text-slate-400 mb-1">
             <span className="cursor-pointer hover:text-white" onClick={() => setCurrentPage(AppPage.UPLOAD)}>Upload</span>
             <span>/</span>
             <span className="text-primary">Settings</span>
           </div>
           <h2 className="text-3xl font-heading font-bold text-white">Mastering Console</h2>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-lg">
             <button 
                onClick={() => setViewMode('simple')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'simple' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
             >
                 AI Assistant
             </button>
             <button 
                onClick={() => setViewMode('advanced')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'advanced' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
             >
                 Manual Control
             </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Core Settings (Always Visible) */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 p-6 rounded-2xl shadow-xl">
                 <h3 className="text-lg font-heading font-semibold text-white mb-4 flex items-center">
                    <IconMusicNote className="w-5 h-5 mr-2 text-primary"/> Track Identity
                 </h3>
                 <div className="space-y-5">
                    <Dropdown label="Genre" name="genre" options={GENRE_OPTIONS} value={currentSettings.genre} onChange={handleInputChange} />
                    <FileUpload
                        label="Reference Track (Optional)"
                        onFileAccepted={handleReferenceFileAccepted}
                        onFileCleared={handleReferenceFileCleared}
                        existingFile={currentSettings.referenceTrackFile || null}
                        id="ref-track"
                    />
                 </div>
            </div>
            
            {/* Summary Card for Mobile/Quick view */}
             <div className="bg-slate-800/40 border border-slate-700/30 p-6 rounded-2xl">
                 <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Current Configuration</h4>
                 <ul className="space-y-3 text-sm text-slate-300">
                     <li className="flex justify-between border-b border-slate-700 pb-2">
                         <span>Loudness</span>
                         <span className="font-mono text-primary">{typeof currentSettings.loudnessTarget === 'string' && currentSettings.loudnessTarget !== 'Custom LUFS' ? currentSettings.loudnessTarget.split('(')[0] : `${currentSettings.customLoudnessValue} LUFS`}</span>
                     </li>
                     <li className="flex justify-between border-b border-slate-700 pb-2">
                         <span>Tone</span>
                         <span className="font-mono text-primary">{currentSettings.tonePreference}</span>
                     </li>
                     <li className="flex justify-between">
                         <span>Width</span>
                         <span className="font-mono text-primary">{currentSettings.stereoWidth}</span>
                     </li>
                 </ul>
             </div>
        </div>

        {/* Right Column: Dynamic Content based on View Mode */}
        <div className="lg:col-span-8">
             <div className="bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-xl min-h-[500px] flex flex-col">
                {viewMode === 'simple' ? (
                    <div className="flex-grow flex flex-col">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full mb-4 ring-1 ring-indigo-500/50">
                                <IconSparkles className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">AI Sonic Analysis</h3>
                            <p className="text-slate-400 max-w-lg mx-auto">Let Afromaster analyze <span className="text-white font-semibold">{uploadedTrack.name}</span> based on the {currentSettings.genre} genre to suggest the perfect mastering chain.</p>
                        </div>
                        
                        <div className="flex-grow">
                             {aiPresets.length === 0 && !isLoadingPresets ? (
                                 <div className="flex items-center justify-center h-full py-8">
                                     <Button onClick={handleGetAIPresets} size="lg" variant="primary" leftIcon={<IconSparkles className="w-5 h-5"/>} className="w-full sm:w-auto">
                                        Analyze & Generate Presets
                                     </Button>
                                 </div>
                             ) : isLoadingPresets ? (
                                 <div className="flex flex-col items-center justify-center h-64">
                                     <LoadingSpinner size="lg" text="Analyzing frequency spectrum & dynamics..." />
                                 </div>
                             ) : (
                                 <div className="grid gap-4 animate-fadeIn">
                                     <div className="flex justify-between items-center mb-2">
                                         <h4 className="text-white font-semibold">Suggested Presets</h4>
                                         <button onClick={handleGetAIPresets} className="text-xs text-primary hover:underline">Regenerate</button>
                                     </div>
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
                             {errorPresets && <p className="text-red-400 text-center mt-4 bg-red-500/10 p-2 rounded-lg">{errorPresets}</p>}
                        </div>
                    </div>
                ) : (
                    <div className="animate-fadeIn space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                <IconCog className="w-5 h-5 mr-2 text-slate-400"/> Global Parameters
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <Dropdown label="Target Loudness" name="loudnessTarget" options={LOUDNESS_TARGET_OPTIONS} value={currentSettings.loudnessTarget as LoudnessTarget} onChange={handleInputChange} />
                                {currentSettings.loudnessTarget === LoudnessTarget.CUSTOM && (
                                     <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Custom Value</label>
                                        <input type="number" name="customLoudnessValue" value={currentSettings.customLoudnessValue} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-primary focus:border-primary"/>
                                     </div>
                                )}
                                <Dropdown label="Tone Character" name="tonePreference" options={TONE_PREFERENCE_OPTIONS} value={currentSettings.tonePreference} onChange={handleInputChange} />
                                <Dropdown label="Stereo Image" name="stereoWidth" options={STEREO_WIDTH_OPTIONS} value={currentSettings.stereoWidth} onChange={handleInputChange} />
                            </div>
                        </div>
                        
                        <div>
                             <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                <div className="w-2 h-6 bg-primary rounded-full mr-2"></div>
                                Fine Tuning
                            </h3>
                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                                <Slider label="Compression" name="compressionAmount" min={0} max={100} step={1} value={currentSettings.compressionAmount} onChange={handleInputChange} unit="%" />
                                <Slider label="Saturation" name="saturationAmount" min={0} max={100} step={1} value={currentSettings.saturationAmount} onChange={handleInputChange} unit="%" />
                                <Slider label="Bass EQ" name="bassBoost" min={-6} max={6} step={0.5} value={currentSettings.bassBoost} onChange={handleInputChange} unit="dB" />
                                <Slider label="Treble EQ" name="trebleBoost" min={-6} max={6} step={0.5} value={currentSettings.trebleBoost} onChange={handleInputChange} unit="dB" />
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="mt-auto pt-8 border-t border-slate-800 flex justify-between items-center">
                    <Button onClick={() => setCurrentPage(AppPage.UPLOAD)} variant="ghost" leftIcon={<IconArrowLeft className="w-4 h-4" />}>Back</Button>
                    <Button onClick={handleSubmit} size="lg" variant="primary" rightIcon={<IconArrowRight className="w-5 h-5"/>}>Start Mastering</Button>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default MasteringSettingsPage;