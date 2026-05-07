import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage, MasteringSettings, AIPreset, Genre, LoudnessTarget, TonePreference, StereoWidth, StemType, Stem } from '../types';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import AIPresetCard from '../components/AIPresetCard';
import LoadingSpinner from '../components/LoadingSpinner';
import FileUpload from '../components/FileUpload';
import Slider from '../components/Slider';
import InteractiveMasteringCanvas from '../components/InteractiveMasteringCanvas';
import StemMixer from '../components/StemMixer';
import { fetchAIPresets } from '../services/geminiService';
import { GENRE_OPTIONS, LOUDNESS_TARGET_OPTIONS, TONE_PREFERENCE_OPTIONS, STEREO_WIDTH_OPTIONS, IconArrowRight, IconSparkles, IconArrowLeft, IconCog, IconMusicNote } from '../constants';
import { useTranslation } from 'react-i18next';

const GENRE_PRESETS: Partial<Record<Genre, Partial<MasteringSettings>>> = {
  [Genre.AFROBEATS]: { loudnessTarget: LoudnessTarget.STREAMING_LOUD, tonePreference: TonePreference.WARM, stereoWidth: StereoWidth.WIDE },
  [Genre.AMAPIANO]: { loudnessTarget: LoudnessTarget.CLUB, tonePreference: TonePreference.WARM, stereoWidth: StereoWidth.WIDE },
  [Genre.HIPHOP]: { loudnessTarget: LoudnessTarget.STREAMING_LOUD, tonePreference: TonePreference.PUNCHY, stereoWidth: StereoWidth.STANDARD },
  [Genre.POP]: { loudnessTarget: LoudnessTarget.STREAMING_STANDARD, tonePreference: TonePreference.BALANCED, stereoWidth: StereoWidth.STANDARD },
};

const MasteringSettingsPage: React.FC = () => {
  const { setCurrentPage, projectTracks, setProjectTracks, masteringSettings, setMasteringSettings, apiKey } = useAppContext();
  const [viewMode, setViewMode] = useState<'simple' | 'advanced'>('simple');
  const [canvasMode, setCanvasMode] = useState<'eq' | 'dynamics'>('eq');
  const { t } = useTranslation();
  
  const [currentSettings, setCurrentSettings] = useState<MasteringSettings>(
    masteringSettings || ({} as any)
  );
  
  const [aiPresets, setAiPresets] = useState<AIPreset[]>([]);
  const [isLoadingPresets, setIsLoadingPresets] = useState(false);
  const [errorPresets, setErrorPresets] = useState<string | null>(null);
  const [selectedPresetName, setSelectedPresetName] = useState<string | null>(null);

  const mainTrack = projectTracks[0];

  useEffect(() => {
    if (projectTracks.length === 0) setCurrentPage(AppPage.UPLOAD); 
    if (masteringSettings) setCurrentSettings(masteringSettings);
  }, [projectTracks, setCurrentPage, masteringSettings]);

  const handleGainChange = (stemId: string, gain: number) => {
    const updatedTracks = projectTracks.map(t => {
        if (t.id === mainTrack.id) {
            return { ...t, stems: t.stems?.map(s => s.id === stemId ? { ...s, gain } : s) };
        }
        return t;
    });
    setProjectTracks(updatedTracks);
  };

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
                if (preset.loudnessTarget && preset.loudnessTarget !== LoudnessTarget.CUSTOM && typeof preset.loudnessTarget === 'string') {
                    const lufsMatch = preset.loudnessTarget.match(/(-?\d+)\s*LUFS/);
                    if (lufsMatch && lufsMatch[1]) newSettings.customLoudnessValue = parseInt(lufsMatch[1], 10);
                }
            }
        }
        return newSettings;
    });
    setSelectedPresetName(null); 
  };

  const handleCanvasChange = (updates: Partial<MasteringSettings>) => {
    setCurrentSettings(prev => ({ ...prev, ...updates }));
  };

  const handleReferenceFileAccepted = (file: File) => setCurrentSettings(prev => ({ ...prev, referenceTrackFile: file }));
  const handleReferenceFileCleared = () => setCurrentSettings(prev => ({ ...prev, referenceTrackFile: null }));

  const handleGetAIPresets = useCallback(async () => {
    if (!mainTrack || !apiKey) {
      setErrorPresets(apiKey ? "No track uploaded." : "API Key is not configured.");
      return;
    }
    setIsLoadingPresets(true);
    setErrorPresets(null);
    try {
      const presets = await fetchAIPresets(currentSettings.genre, mainTrack.name, apiKey, currentSettings.referenceTrackFile?.name);
      setAiPresets(presets);
    } catch (err: any) {
      setErrorPresets(err.message || "Failed to fetch AI presets.");
      setAiPresets([]);
    } finally {
      setIsLoadingPresets(false);
    }
  }, [mainTrack, currentSettings.genre, currentSettings.referenceTrackFile, apiKey]);

  const applyAIPreset = (preset: AIPreset) => {
    const newSettings = { ...currentSettings, ...preset.settings };
    setCurrentSettings(newSettings as any);
    setSelectedPresetName(preset.name);
  };

  const handleSubmit = () => {
    setMasteringSettings(currentSettings);
    setCurrentPage(AppPage.PROCESSING);
  };

  if (!mainTrack || !currentSettings.genre) return <LoadingSpinner text="Initializing console..." />;

  return (
    <div className="max-w-6xl mx-auto animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
           <div className="flex items-center space-x-2 text-sm text-slate-400 mb-1">
             <span className="cursor-pointer hover:text-white" onClick={() => setCurrentPage(AppPage.UPLOAD)}>Lab</span>
             <span>/</span>
             <span className="text-primary">Mastering</span>
           </div>
           <h2 className="text-3xl font-heading font-bold text-white">Mixing Console</h2>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-lg">
             <button onClick={() => setViewMode('simple')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'simple' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}>{t('ai_assistant')}</button>
             <button onClick={() => setViewMode('advanced')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'advanced' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}>{t('pro_console')}</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 p-6 rounded-2xl shadow-xl">
                 <h3 className="text-lg font-heading font-semibold text-white mb-4 flex items-center">
                    <IconMusicNote className="w-5 h-5 mr-2 text-primary"/> Project Identity
                 </h3>
                 <div className="space-y-5">
                    <Dropdown label="Target Genre" name="genre" options={GENRE_OPTIONS} value={currentSettings.genre} onChange={handleInputChange} />
                    
                    <div className="space-y-3">
                        <div className="flex bg-slate-800 p-0.5 rounded-lg">
                            <button onClick={() => handleCanvasChange({ referenceUrl: undefined })} className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-tight transition-all ${!currentSettings.referenceUrl ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}>File</button>
                            <button onClick={() => handleCanvasChange({ referenceUrl: '', referenceTrackFile: null })} className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-tight transition-all ${currentSettings.referenceUrl !== undefined ? 'bg-indigo-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}>URL</button>
                        </div>

                        {currentSettings.referenceUrl === undefined ? (
                            <FileUpload
                                label="Sonic Reference"
                                onFileAccepted={handleReferenceFileAccepted}
                                onFileCleared={handleReferenceFileCleared}
                                existingFile={currentSettings.referenceTrackFile || null}
                                id="ref-track"
                            />
                        ) : (
                            <div className="animate-fadeIn">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Reference Link</label>
                                <input 
                                    type="text" 
                                    placeholder="YouTube or SoundCloud URL"
                                    value={currentSettings.referenceUrl}
                                    onChange={(e) => handleCanvasChange({ referenceUrl: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none placeholder:text-slate-700"
                                />
                                <p className="mt-2 text-[9px] text-slate-600 leading-relaxed italic">AI will analyze the metadata and known characteristics of this track.</p>
                            </div>
                        )}
                    </div>
                 </div>
            </div>
            
             {mainTrack.isStemMode && <StemMixer stems={mainTrack.stems || []} onGainChange={handleGainChange} />}

             <div className="bg-slate-800/40 border border-slate-700/30 p-6 rounded-2xl">
                 <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Chain Metadata</h4>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">EQ Matching</span>
                        <span className="text-indigo-400 font-mono">Active</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Summing Mode</span>
                        <span className="text-indigo-400 font-mono">{mainTrack.isStemMode ? 'High Headroom' : 'Single Pass'}</span>
                    </div>
                 </div>
             </div>
        </div>

        <div className="lg:col-span-8">
             <div className="bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-xl min-h-[500px] flex flex-col">
                {viewMode === 'simple' ? (
                    <div className="flex-grow flex flex-col">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center p-3 bg-indigo-500/20 rounded-full mb-4 ring-1 ring-indigo-500/50">
                                <IconSparkles className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{t('ai_assistant')}</h3>
                            <p className="text-slate-400">Afromaster is optimizing <span className="text-white font-semibold">{mainTrack.name}</span> for global distribution.</p>
                        </div>
                        
                        <div className="flex-grow">
                             {aiPresets.length === 0 && !isLoadingPresets ? (
                                 <div className="flex items-center justify-center h-full py-8">
                                     <Button onClick={handleGetAIPresets} size="lg" variant="primary" leftIcon={<IconSparkles className="w-5 h-5"/>}>Generate Mastering Options</Button>
                                 </div>
                             ) : isLoadingPresets ? (
                                 <div className="flex flex-col items-center justify-center h-64">
                                     <LoadingSpinner size="lg" text="Simulating signal path..." />
                                 </div>
                             ) : (
                                 <div className="grid gap-4">
                                     {aiPresets.map(preset => (
                                        <AIPresetCard key={preset.name} preset={preset} onApply={() => applyAIPreset(preset)} isSelected={selectedPresetName === preset.name} />
                                     ))}
                                 </div>
                             )}
                        </div>
                    </div>
                ) : (
                    <div className="animate-fadeIn space-y-8 flex-grow">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white flex items-center">
                                <IconCog className="w-5 h-5 mr-2 text-slate-400"/> DSP Visualizer
                            </h3>
                            <div className="flex bg-slate-800 rounded-lg p-0.5">
                                <button onClick={() => setCanvasMode('eq')} className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight transition-all ${canvasMode === 'eq' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}>EQ</button>
                                <button onClick={() => setCanvasMode('dynamics')} className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight transition-all ${canvasMode === 'dynamics' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}>Dynamics</button>
                            </div>
                        </div>

                        <InteractiveMasteringCanvas settings={currentSettings} mode={canvasMode} onChange={handleCanvasChange} />

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Sonic Saturation</h4>
                                <Dropdown label="Mode" name="saturationFlavor" options={['tape', 'tube', 'transformer', 'digital']} value={currentSettings.saturation.flavor} onChange={(e) => handleCanvasChange({ saturation: { ...currentSettings.saturation, flavor: e.target.value as any }})} />
                                <Slider label="Drive" name="saturationAmount" min={0} max={100} value={currentSettings.saturation.amount} onChange={(e) => handleCanvasChange({ saturation: { ...currentSettings.saturation, amount: parseFloat(e.target.value) }})} unit="%" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Loudness Control</h4>
                                <Dropdown label="Target" name="loudnessTarget" options={LOUDNESS_TARGET_OPTIONS} value={currentSettings.loudnessTarget as LoudnessTarget} onChange={handleInputChange} />
                                <Slider label="Ceiling" name="finalGain" min={0.5} max={2.0} step={0.01} value={currentSettings.finalGain} onChange={(e) => handleCanvasChange({ finalGain: parseFloat(e.target.value) })} unit="x" />
                            </div>
                        </div>

                        <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50">
                            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6 flex items-center">
                                <IconSparkles className="w-4 h-4 mr-2" /> Audio Archeology (Restoration)
                            </h4>
                            <div className="grid md:grid-cols-3 gap-8">
                                <Slider label="De-Noise" name="deNoise" min={0} max={100} value={currentSettings.restoration.deNoise} onChange={(e) => handleCanvasChange({ restoration: { ...currentSettings.restoration, deNoise: parseFloat(e.target.value) }})} unit="%" />
                                <Slider label="De-Clip" name="deClip" min={0} max={100} value={currentSettings.restoration.deClip} onChange={(e) => handleCanvasChange({ restoration: { ...currentSettings.restoration, deClip: parseFloat(e.target.value) }})} unit="%" />
                                <Slider label="De-Reverb" name="deReverb" min={0} max={100} value={currentSettings.restoration.deReverb} onChange={(e) => handleCanvasChange({ restoration: { ...currentSettings.restoration, deReverb: parseFloat(e.target.value) }})} unit="%" />
                            </div>
                            <p className="mt-4 text-[10px] text-slate-500 italic text-center">Corrective DSP applied before the mastering chain for cleaner results.</p>
                        </div>
                    </div>
                )}
                
                <div className="mt-auto pt-8 border-t border-slate-800 flex justify-between items-center">
                    <Button onClick={() => setCurrentPage(AppPage.UPLOAD)} variant="ghost" leftIcon={<IconArrowLeft className="w-4 h-4" />}>{t('back')}</Button>
                    <Button onClick={handleSubmit} size="lg" variant="primary" rightIcon={<IconArrowRight className="w-5 h-5"/>}>Start Mixdown & Master</Button>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default MasteringSettingsPage;