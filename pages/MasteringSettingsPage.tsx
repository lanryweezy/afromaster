import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage, MasteringSettings } from '../types';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchAIChainSettings } from '../services/geminiService';
import { IconArrowRight, IconArrowLeft } from '../constants';
import ManualMasteringControls from '../components/ManualMasteringControls';
import AIMasteringSuggestions from '../components/AIMasteringSuggestions';
import Card from '../components/Card';

const MasteringSettingsPage: React.FC = () => {
  const {
    setCurrentPage,
    uploadedTrack,
    masteringSettings,
    setMasteringSettings,
    apiKey,
    isLoading, // Get global isLoading
    setIsLoading, // Get global setIsLoading
    setErrorMessage, // Get global setErrorMessage
    // updateMasteringSettings will be used in future updates
  } = useAppContext();

  const [currentSettings, setCurrentSettings] = useState<MasteringSettings>(() => {
    const initialSettings: MasteringSettings = {
      genre: 'Pop',
      loudnessTarget: 'Streaming Standard',
      tonePreference: 'Balanced',
      stereoWidth: 'Standard',
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
      aiSettingsApplied: false, // Add this default
      useDynamicEQ: false, // Add this default
    };

    const base = masteringSettings || initialSettings;
    return {
      ...initialSettings, // Start with all defaults
      ...base,
      crossover: { ...initialSettings.crossover, ...base.crossover },
      eq: { ...initialSettings.eq, ...base.eq },
      saturation: {
        ...initialSettings.saturation,
        ...base.saturation,
      },
      bands: {
        low: { ...initialSettings.bands.low, ...base.bands?.low },
        mid: { ...initialSettings.bands.mid, ...base.bands?.mid },
        high: { ...initialSettings.bands.high, ...base.bands?.high },
      },
      limiter: { ...initialSettings.limiter, ...base.limiter },
      reverb: { ...initialSettings.reverb, ...base.reverb },
    } as MasteringSettings;
  });

  const [aiSettings, setAiSettings] = useState<Partial<MasteringSettings> | null>(null);
  // Removed local isLoading and error states
  const [aiStrength, setAiStrength] = useState(100);
  const [referenceAnalysis, setReferenceAnalysis] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!uploadedTrack) {
      setCurrentPage(AppPage.UPLOAD);
    }
    if (masteringSettings) {
      setCurrentSettings(prev => ({
        ...prev,
        ...masteringSettings,
        saturation: {
          flavor: masteringSettings.saturation?.flavor ?? prev.saturation.flavor ?? 'tape',
          amount: masteringSettings.saturation?.amount ?? prev.saturation.amount ?? 0,
        },
      }));
    }
  }, [uploadedTrack, setCurrentPage, masteringSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumberInput = type === 'number' || type === 'range';
    const [mainKey, subKey] = name.split('.') as [keyof MasteringSettings, string | undefined];

    if (subKey) {
      setCurrentSettings(prev => {
        const existing = typeof prev[mainKey] === 'object' && prev[mainKey] !== null ? prev[mainKey] : {};
        return {
          ...prev,
          [mainKey]: {
            ...existing,
            [subKey]: isNumberInput ? parseFloat(value) : value,
          },
        } as MasteringSettings;
      });
    } else {
      setCurrentSettings(prev => ({ ...prev, [name]: isNumberInput ? parseFloat(value) : value } as MasteringSettings));
    }
  };

  const handleReferenceFileAccepted = useCallback(async (file: File) => {
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
          const worker = new Worker(new URL('../src/analysis.worker.ts', import.meta.url), { type: 'module' });
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
  }, []);

  const handleReferenceFileCleared = useCallback(() => {
    setCurrentSettings(prev => ({ ...prev, referenceTrackFile: null }));
    setReferenceAnalysis(null);
  }, []);

  const handleGetAISettings = useCallback(async () => {
    if (!uploadedTrack || !apiKey) {
      // Use global error message here
      setErrorMessage(apiKey ? "No track uploaded to analyze." : "API Key is not configured.");
      return;
    }
    // Use global loading and error states
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const settings = await fetchAIChainSettings(
        currentSettings.genre,
        uploadedTrack.name,
        apiKey,
        referenceAnalysis,
        setIsLoading, // Pass global setIsLoading
        setErrorMessage // Pass global setErrorMessage
      );
      setAiSettings(settings);
      setCurrentSettings(prev => ({ ...prev, aiSettingsApplied: true }));
    } catch (err: unknown) { // Catch any type of error
      console.error("Failed to fetch AI settings:", err);
      // The fetchAIChainSettings already sets the error message, so no need to set it again here
      // setErrorMessage(err.message || "Failed to fetch AI settings.");
    } finally {
      setIsLoading(false);
    }
  }, [uploadedTrack, currentSettings, apiKey, referenceAnalysis, setIsLoading, setErrorMessage]); // Add to dependencies

  const applyAIStrength = useCallback((baseSettings: MasteringSettings, aiSettings: Partial<MasteringSettings> | null, strength: number): MasteringSettings => {
    if (!aiSettings) return baseSettings;

    const strengthRatio = strength / 100;
    const newSettings = { ...baseSettings };

    const blend = (base: number, ai: number) => base + (ai - base) * strengthRatio;

    if (aiSettings.bands) {
      newSettings.bands = {
        low: {
          threshold: blend(baseSettings.bands.low.threshold, aiSettings.bands.low.threshold || 0),
          knee: blend(baseSettings.bands.low.knee, aiSettings.bands.low.knee || 0),
          ratio: blend(baseSettings.bands.low.ratio, aiSettings.bands.low.ratio || 0),
          attack: blend(baseSettings.bands.low.attack, aiSettings.bands.low.attack || 0),
          release: blend(baseSettings.bands.low.release, aiSettings.bands.low.release || 0),
          makeupGain: blend(baseSettings.bands.low.makeupGain, aiSettings.bands.low.makeupGain || 0),
        },
        mid: {
          threshold: blend(baseSettings.bands.mid.threshold, aiSettings.bands.mid.threshold || 0),
          knee: blend(baseSettings.bands.mid.knee, aiSettings.bands.mid.knee || 0),
          ratio: blend(baseSettings.bands.mid.ratio, aiSettings.bands.mid.ratio || 0),
          attack: blend(baseSettings.bands.mid.attack, aiSettings.bands.mid.attack || 0),
          release: blend(baseSettings.bands.mid.release, aiSettings.bands.mid.release || 0),
          makeupGain: blend(baseSettings.bands.mid.makeupGain, aiSettings.bands.mid.makeupGain || 0),
        },
        high: {
          threshold: blend(baseSettings.bands.high.threshold, aiSettings.bands.high.threshold || 0),
          knee: blend(baseSettings.bands.high.knee, aiSettings.bands.high.knee || 0),
          ratio: blend(baseSettings.bands.high.ratio, aiSettings.bands.high.ratio || 0),
          attack: blend(baseSettings.bands.high.attack, aiSettings.bands.high.attack || 0),
          release: blend(baseSettings.bands.high.release, aiSettings.bands.high.release || 0),
          makeupGain: blend(baseSettings.bands.high.makeupGain, aiSettings.bands.high.makeupGain || 0),
        },
      };
    }

    if (aiSettings.eq) {
      newSettings.eq = {
        bassFreq: blend(baseSettings.eq.bassFreq, aiSettings.eq.bassFreq || 0),
        trebleFreq: blend(baseSettings.eq.trebleFreq, aiSettings.eq.trebleFreq || 0),
        bassGain: blend(baseSettings.eq.bassGain, aiSettings.eq.bassGain || 0),
        trebleGain: blend(baseSettings.eq.trebleGain, aiSettings.eq.trebleGain || 0),
      };
    }

    if (aiSettings.saturation) {
      newSettings.saturation = {
        ...newSettings.saturation,
        amount: blend(baseSettings.saturation.amount, aiSettings.saturation.amount || 0),
      };
    }

    if (aiSettings.limiter) {
      newSettings.limiter = {
        threshold: blend(baseSettings.limiter.threshold, aiSettings.limiter.threshold || 0),
        attack: blend(baseSettings.limiter.attack, aiSettings.limiter.attack || 0),
        release: blend(baseSettings.limiter.release, aiSettings.limiter.release || 0),
      };
    }

    if (aiSettings.finalGain) {
      newSettings.finalGain = blend(baseSettings.finalGain, aiSettings.finalGain || 0);
    }

    return newSettings;
  }, []);

  useEffect(() => {
    if (aiSettings) {
      const newSettings = applyAIStrength(currentSettings, aiSettings, aiStrength);
      setCurrentSettings(newSettings);
    }
  }, [aiStrength, aiSettings, applyAIStrength, currentSettings]);

  const handleSubmit = useCallback(() => {
    setMasteringSettings(currentSettings);
    setCurrentPage(AppPage.PROCESSING);
  }, [currentSettings, setMasteringSettings, setCurrentPage]);

  // Memoize components to prevent unnecessary re-renders
  const manualControls = useMemo(() => (
    <ManualMasteringControls
      currentSettings={currentSettings}
      handleInputChange={handleInputChange}
      handleReferenceFileAccepted={handleReferenceFileAccepted}
      handleReferenceFileCleared={handleReferenceFileCleared}
    />
  ), [currentSettings, handleInputChange, handleReferenceFileAccepted, handleReferenceFileCleared]);

  const aiSuggestions = useMemo(() => (
    <AIMasteringSuggestions
      isLoading={isLoading}
      apiKey={apiKey}
      // error={error}
      handleGetAISettings={handleGetAISettings}
      aiStrength={aiStrength}
      setAiStrength={setAiStrength}
    />
  ), [isLoading, apiKey, handleGetAISettings, aiStrength, setAiStrength]);

  if (!uploadedTrack) return <LoadingSpinner text="Loading track data..." />;

  return (
    <Card maxWidth="max-w-5xl">
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
        {manualControls}
        {aiSuggestions}
      </div>

      <div className="mt-10 pt-6 border-t border-slate-800 text-right">
        <Button onClick={handleSubmit} size="lg" rightIcon={<IconArrowRight className="w-5 h-5" />}>
          Start Mastering
        </Button>
      </div>
    </Card>
  );
};

export default MasteringSettingsPage;