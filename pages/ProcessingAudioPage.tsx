import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage, MasteredTrackInfo } from '../types';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchAIChainSettings, generateMasteringReport } from '../services/geminiService';
import { uploadMasteredTrack, saveUserProject, checkAndDeductCredits } from '../services/firebaseService';

const ProcessingAudioPage: React.FC = () => {
  const {
    setCurrentPage,
    uploadedTrack,
    masteringSettings,
    setMasteredTrackInfo,
    setMasteredAudioBuffer,
    addUserProject,
    apiKey,
    user
  } = useAppContext();

  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Initializing...");
  const [masteringReportNotes, setMasteringReportNotes] = useState<string | null>(null);
  const [isFetchingReport, setIsFetchingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  useEffect(() => {
    if (!uploadedTrack || !masteringSettings || !uploadedTrack.audioBuffer) {
      setCurrentPage(AppPage.UPLOAD);
      return;
    }
    const worker = new Worker(new URL('../src/audio.worker.ts', import.meta.url), { type: 'module' });

    let cancelled = false;
    worker.onmessage = async (event) => {
      if (cancelled) return;
      const { masteredBuffer } = event.data;
      setMasteredAudioBuffer(masteredBuffer);

      // Create masteredTrackInfo to ensure preview page has all required data
      let trackInfo: MasteredTrackInfo = {
        id: `track_${Date.now()}`,
        trackName: uploadedTrack.name,
        masteredFileUrl: '', // Will be set after upload
        settings: masteringSettings,
        createdAt: new Date(),
        userId: user?.uid || 'anonymous'
      };

      if (user) {
        try {
          setStatusMessage("Uploading files to cloud...");
          const downloadURL = await uploadMasteredTrack(user, masteredBuffer, uploadedTrack.name);
          trackInfo.masteredFileUrl = downloadURL;
          
          const savedProject = await saveUserProject(user, uploadedTrack.name, downloadURL, masteringSettings);
          trackInfo = { ...trackInfo, ...savedProject }; // Update trackInfo with ID from Firestore
          addUserProject(trackInfo);
        } catch (e) {
          console.error("Cloud upload failed:", e);
          setStatusMessage("Upload failed, continuing to preview...");
        }
      }

      // Set the track info regardless of upload status
      setMasteredTrackInfo(trackInfo);

      setProgress(100);
      setStatusMessage("Mastering complete!");
      setTimeout(() => setCurrentPage(AppPage.PREVIEW), 1000);
    };

    const performMastering = async () => {
      try {
        if (user) {
          const hasCredits = await checkAndDeductCredits(user);
          if (!hasCredits) {
            setStatusMessage("You don't have enough credits to master a track.");
            setTimeout(() => setCurrentPage(AppPage.BUY_CREDITS), 3000);
            return;
          }
        }

        // Deep-ish clone with defaults to avoid undefined nested props
        let finalSettings = {
          ...masteringSettings,
          eq: { ...masteringSettings.eq },
          crossover: { ...masteringSettings.crossover },
          bands: {
            low: { ...masteringSettings.bands.low },
            mid: { ...masteringSettings.bands.mid },
            high: { ...masteringSettings.bands.high },
          },
          limiter: { ...masteringSettings.limiter },
          reverb: { ...masteringSettings.reverb },
          saturation: {
            flavor: masteringSettings.saturation?.flavor ?? 'tape',
            amount: masteringSettings.saturation?.amount ?? 0,
          },
        };

        if (finalSettings.aiSettingsApplied) {
          if (!apiKey) {
            setStatusMessage("AI plan skipped: missing API key.");
          } else {
            setStatusMessage("Generating AI mastering plan...");
            setProgress(25);
            const aiSettings = await fetchAIChainSettings(
              finalSettings.genre,
              uploadedTrack.name,
              apiKey,
              finalSettings.referenceTrackFile?.name
            );
            // Deep merge AI settings while preserving nested defaults
            finalSettings = {
              ...finalSettings,
              ...aiSettings,
              eq: { ...finalSettings.eq, ...aiSettings.eq },
              crossover: { ...finalSettings.crossover, ...aiSettings.crossover },
              bands: {
                low: { ...finalSettings.bands.low, ...aiSettings.bands?.low },
                mid: { ...finalSettings.bands.mid, ...aiSettings.bands?.mid },
                high: { ...finalSettings.bands.high, ...aiSettings.bands?.high },
              },
              limiter: { ...finalSettings.limiter, ...aiSettings.limiter },
              reverb: { ...finalSettings.reverb, ...aiSettings.reverb },
              saturation: {
                flavor: finalSettings.saturation.flavor,
                amount: aiSettings.saturation?.amount ?? finalSettings.saturation.amount,
              },
            };
            setIsFetchingReport(true);
            generateMasteringReport(uploadedTrack.name, finalSettings, apiKey)
              .then(report => !cancelled && setMasteringReportNotes(report))
              .catch(err => !cancelled && setReportError(err.message))
              .finally(() => !cancelled && setIsFetchingReport(false));
          }
        }

        setStatusMessage("Applying advanced audio processing...");
        setProgress(75);
        worker.postMessage({ originalBuffer: uploadedTrack.audioBuffer, settings: finalSettings });
      } catch (error) {
        console.error("Mastering failed:", error);
        setStatusMessage(`Error during mastering: ${error instanceof Error ? (error as Error).message : 'Unknown error'}`);
        setTimeout(() => setCurrentPage(AppPage.SETTINGS), 3000);
      }
    };

    performMastering();

    return () => {
      cancelled = true;
      worker.terminate();
    };
  }, [uploadedTrack, masteringSettings, apiKey, setCurrentPage, setMasteredAudioBuffer, addUserProject, user]);

  if (!uploadedTrack || !masteringSettings) {
    return <LoadingSpinner text="Loading data..." />;
  }

  return (
    <div className="max-w-2xl mx-auto text-center p-6 md:p-8 bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-2xl card-accent">
      <h2 className="text-3xl sm:text-4xl font-heading font-semibold mb-6 text-gradient-primary">Afromastering Your Track</h2>
      
      {/* Processing Status */}
      <div className="mb-8">
        <LoadingSpinner size="lg" className="mb-6" />
        <p className="text-slate-300 mb-2">
          Hang tight! <span className="font-semibold text-primary-focus transition-colors">{uploadedTrack.name}</span> is being polished.
        </p>
        <p className="text-slate-400 mb-6 text-sm min-h-[20px] font-mono">{statusMessage}</p>
        
        {/* Progress Bar with Percentage */}
        <div className="mb-4">
          <ProgressBar progress={progress} />
          <p className="text-primary-focus font-bold text-lg mt-2">{progress}%</p>
        </div>
      </div>

      {/* Error Display */}
      {reportError && (
        <div className="mt-6 p-4 bg-red-900/20 backdrop-blur-md border border-red-500/50 rounded-lg text-left animate-fadeIn">
          <div className="flex items-center mb-2">
            <span className="text-red-400 mr-2">❌</span>
            <h4 className="text-md font-semibold text-red-400">Processing Error</h4>
          </div>
          <p className="text-red-300 text-sm">{reportError}</p>
          <button 
            onClick={() => setCurrentPage(AppPage.SETTINGS)}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
          >
            Go Back & Try Again
          </button>
        </div>
      )}

      {/* AI Insights */}
      {(isFetchingReport || masteringReportNotes) && !reportError && (
        <div className="mt-6 p-4 bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-lg text-left animate-fadeIn">
          <div className="flex items-center mb-2">
            <span className="text-primary-focus mr-2">💡</span>
            <h4 className="text-md font-semibold text-primary-focus">AI Mastering Insights</h4>
          </div>
          {isFetchingReport && <LoadingSpinner size="sm" text="Generating insights..." />}
          {masteringReportNotes && !isFetchingReport && (
            <p className="text-slate-300 text-sm whitespace-pre-wrap">{masteringReportNotes}</p>
          )}
        </div>
      )}

      {progress === 100 && (
        <p className="mt-6 text-green-400 animate-fadeIn">Processing finished! Preparing your preview...</p>
      )}
    </div>
  );
};

export default ProcessingAudioPage;