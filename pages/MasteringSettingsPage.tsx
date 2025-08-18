
import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage, MasteringSettings } from '../types';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import LoadingSpinner from '../components/LoadingSpinner';
import FileUpload from '../components/FileUpload';
import Slider from '../components/Slider';
import { fetchAIChainSettings } from '../services/geminiService';
import { Genre, LoudnessTarget, TonePreference, StereoWidth, GENRE_OPTIONS, LOUDNESS_TARGET_OPTIONS, TONE_PREFERENCE_OPTIONS, STEREO_WIDTH_OPTIONS, IconArrowRight, IconSparkles, IconArrowLeft } from '../constants';
const MasteringSettingsPage: React.FC = () => {
  const {
    setCurrentPage,
    uploadedTrack,
    masteringSettings,
    setMasteringSettings,
    apiKey
  } = useAppContext();

  const [currentSettings, setCurrentSettings] = useState<MasteringSettings>(() => {
    const initialSettings = {
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
      crossover: { lowPass: 250, highPass: 4000 },
      eq: { bassFreq: 200, trebleFreq: 5000, bassGain: 0, trebleGain: 0 },
      saturation: { amount: 0, flavor: 'tape' },
      preGain: 1.0,
      bands: {
        low: { threshold: -35, knee: 15, ratio: 4, attack: 0.05, release: 0.3, makeupGain: 2.0 },
        mid: { threshold: -30, knee: 10, ratio: 3, attack: 0.01, release: 0.25, makeupGain: 2.0 },
        high: { threshold: -25, knee: 5, ratio: 3, attack: 0.005, release: 0.15, makeupGain: 1.5 },
      },
      limiter: { threshold: -1.5, attack: 0.002, release: 0.05 },
      finalGain: 1.0,
      reverb: { impulseResponse: 'none', wetDryMix: 0 },
    };
    return masteringSettings || initialSettings;
  });
  const [aiSettings, setAiSettings] = useState<Partial<MasteringSettings> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiStrength, setAiStrength] = useState(100);
  const [referenceAnalysis, setReferenceAnalysis] = useState(null);

  useEffect(() => {
    if (!uploadedTrack) {
      setCurrentPage(AppPage.UPLOAD);
    }
    if (masteringSettings) {
      setCurrentSettings(masteringSettings);
    }
  }, [uploadedTrack, setCurrentPage, masteringSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumberInput = type === 'number' || type === 'range';
    const [mainKey, subKey] = name.split('.');

    if (subKey) {
      setCurrentSettings(prev => ({
        ...prev,
        [mainKey]: {
          ...prev[mainKey],
          [subKey]: isNumberInput ? parseFloat(value) : value,
        },
      }));
    } else {
      setCurrentSettings(prev => ({ ...prev, [name]: isNumberInput ? parseFloat(value) : value }));
    }
  };

  const handleReferenceFileAccepted = async (file: File) => {
    setCurrentSettings(prev => ({ ...prev, referenceTrackFile: file }));
    const audioContext = new AudioContext();
    const reader = new FileReader();

    const cleanup = (worker?: Worker) => {
      try { worker?.terminate(); } catch {}
      try { audioContext.close(); } catch {}
    };

    reader.onload = async (e) => {
      try {
        if (e.target?.result instanceof ArrayBuffer) {
          const buffer = await audioContext.decodeAudioData(e.target.result);
          const worker = new Worker(new URL('../analysis.worker.ts', import.meta.url), { type: 'module' });
          worker.onmessage = (event) => {
            setReferenceAnalysis(event.data);
            cleanup(worker);
          };
          worker.onerror = () => cleanup(worker);
          worker.postMessage({ buffer });
        } else {
          cleanup();
        }
      } catch {
        cleanup();
      }
    };
    reader.onerror = () => cleanup();
    reader.readAsArrayBuffer(file);
  };

  const handleReferenceFileCleared = () => {
    setCurrentSettings(prev => ({ ...prev, referenceTrackFile: null }));
    setReferenceAnalysis(null);
  };

  const handleGetAISettings = useCallback(async () => {
    if (!uploadedTrack || !apiKey) {
      setError(apiKey ? "No track uploaded to analyze." : "API Key is not configured.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const settings = await fetchAIChainSettings(currentSettings.genre, uploadedTrack.name, apiKey, referenceAnalysis);
      setAiSettings(settings);
      setCurrentSettings(prev => ({ ...prev, aiSettingsApplied: true }));
    } catch (err: any) {
      setError(err.message || "Failed to fetch AI settings.");
    } finally {
      setIsLoading(false);
    }
  }, [uploadedTrack, currentSettings, apiKey, referenceAnalysis]);

  const applyAIStrength = useCallback((baseSettings: MasteringSettings, aiSettings: Partial<MasteringSettings> | null, strength: number): MasteringSettings => {
    if (!aiSettings) return baseSettings;

    const strengthRatio = strength / 100;
    const newSettings = { ...baseSettings };

    const blend = (base: number, ai: number) => base + (ai - base) * strengthRatio;

    if (aiSettings.bands) {
      newSettings.bands = {
        low: {
          threshold: blend(baseSettings.bands.low.threshold, aiSettings.bands.low.threshold),
          knee: blend(baseSettings.bands.low.knee, aiSettings.bands.low.knee),
          ratio: blend(baseSettings.bands.low.ratio, aiSettings.bands.low.ratio),
          attack: blend(baseSettings.bands.low.attack, aiSettings.bands.low.attack),
          release: blend(baseSettings.bands.low.release, aiSettings.bands.low.release),
          makeupGain: blend(baseSettings.bands.low.makeupGain, aiSettings.bands.low.makeupGain),
        },
        mid: {
          threshold: blend(baseSettings.bands.mid.threshold, aiSettings.bands.mid.threshold),
          knee: blend(baseSettings.bands.mid.knee, aiSettings.bands.mid.knee),
          ratio: blend(baseSettings.bands.mid.ratio, aiSettings.bands.mid.ratio),
          attack: blend(baseSettings.bands.mid.attack, aiSettings.bands.mid.attack),
          release: blend(baseSettings.bands.mid.release, aiSettings.bands.mid.release),
          makeupGain: blend(baseSettings.bands.mid.makeupGain, aiSettings.bands.mid.makeupGain),
        },
        high: {
          threshold: blend(baseSettings.bands.high.threshold, aiSettings.bands.high.threshold),
          knee: blend(baseSettings.bands.high.knee, aiSettings.bands.high.knee),
          ratio: blend(baseSettings.bands.high.ratio, aiSettings.bands.high.ratio),
          attack: blend(baseSettings.bands.high.attack, aiSettings.bands.high.attack),
          release: blend(baseSettings.bands.high.release, aiSettings.bands.high.release),
          makeupGain: blend(baseSettings.bands.high.makeupGain, aiSettings.bands.high.makeupGain),
        },
      };
    }

    if (aiSettings.eq) {
      newSettings.eq = {
        bassFreq: blend(baseSettings.eq.bassFreq, aiSettings.eq.bassFreq),
        trebleFreq: blend(baseSettings.eq.trebleFreq, aiSettings.eq.trebleFreq),
        bassGain: blend(baseSettings.eq.bassGain, aiSettings.eq.bassGain),
        trebleGain: blend(baseSettings.eq.trebleGain, aiSettings.eq.trebleGain),
      };
    }

    if (aiSettings.saturation) {
      newSettings.saturation = {
        amount: blend(baseSettings.saturation.amount, aiSettings.saturation.amount),
      };
    }

    if (aiSettings.limiter) {
      newSettings.limiter = {
        threshold: blend(baseSettings.limiter.threshold, aiSettings.limiter.threshold),
        attack: blend(baseSettings.limiter.attack, aiSettings.limiter.attack),
        release: blend(baseSettings.limiter.release, aiSettings.limiter.release),
      };
    }

    if (aiSettings.finalGain) {
      newSettings.finalGain = blend(baseSettings.finalGain, aiSettings.finalGain);
    }

    return newSettings;
  }, []);

  useEffect(() => {
    if (aiSettings) {
      const newSettings = applyAIStrength(currentSettings, aiSettings, aiStrength);
      setCurrentSettings(newSettings);
    }
  }, [aiStrength, aiSettings, applyAIStrength]);

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
              <Dropdown
                label="Saturation Flavor"
                name="saturation.flavor"
                options={[
                  { value: 'tape', label: 'Warm Tape' },
                  { value: 'tube', label: 'Tube' },
                  { value: 'fuzz', label: 'Fuzz' },
                ]}
                value={currentSettings.saturation.flavor}
                onChange={handleInputChange}
              />
              <Slider
                label="Analog Saturation"
                name="saturation.amount"
                min={0} max={100} step={1}
                value={currentSettings.saturation.amount}
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
              <h4 className="text-lg font-semibold text-primary-focus mb-2">Creative Effects</h4>
              <Dropdown
                label="Reverb"
                name="reverb.impulseResponse"
                options={[
                  { value: 'none', label: 'None' },
                  { value: 'small_drum_room.wav', label: 'Small Drum Room' },
                  { value: 'nice_drum_room.wav', label: 'Nice Drum Room' },
                  { value: 'large_long_echo_hall.wav', label: 'Large Hall' },
                  { value: 'masonic_lodge.wav', label: 'Masonic Lodge' },
                ]}
                value={currentSettings.reverb.impulseResponse}
                onChange={handleInputChange}
              />
              <Slider
                label="Reverb Mix"
                name="reverb.wetDryMix"
                min={0} max={1} step={0.01}
                value={currentSettings.reverb.wetDryMix}
                onChange={handleInputChange}
                unit="%"
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
            <Button onClick={handleGetAISettings} isLoading={isLoading} disabled={isLoading || !apiKey} leftIcon={<IconSparkles className="w-5 h-5" />}>
              {apiKey ? 'Generate AI Settings' : 'Configure API Key for AI'}
            </Button>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          {isLoading && <LoadingSpinner text="Generating AI Settings..." className="my-6" />}

          <div className="pt-4 space-y-6">
            <Slider
              label="AI Strength"
              name="aiStrength"
              min={0} max={100} step={1}
              value={aiStrength}
              onChange={(e) => setAiStrength(parseInt(e.target.value))}
              unit="%"
            />
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-slate-800 text-right">
        <Button onClick={handleSubmit} size="lg" rightIcon={<IconArrowRight className="w-5 h-5" />}>
          Start Mastering
        </Button>
      </div>
    </div>
  );
};

export default MasteringSettingsPage;
