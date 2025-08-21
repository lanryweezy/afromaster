import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage, MasteredTrackInfo } from '../types';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchAIChainSettings, generateMasteringReport } from '../services/geminiService';
import { uploadMasteredTrack, saveUserProject, checkAndDeductCredits } from '../services/firebaseService';
import { processAudio } from '../services/audioProcessingService';
import StatusMessage from '../components/StatusMessage';

const ProcessingAudioPage: React.FC = () => {
  const {
    setCurrentPage,
    uploadedTrack,
    masteringSettings,
    setMasteredTrackInfo,
    setMasteredAudioBuffer,
    addUserProject,
    apiKey,
    user,
    // isLoading is not used directly but is part of the context
    setIsLoading,
    setErrorMessage,
  } = useAppContext();

  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Initializing...");
  const [masteringReportNotes, setMasteringReportNotes] = useState<string | null>(null);
  const [isFetchingReport, setIsFetchingReport] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!uploadedTrack || !masteringSettings || !uploadedTrack.audioBuffer) {
      setCurrentPage(AppPage.UPLOAD);
      return;
    }
    
    cancelledRef.current = false;

    const performMastering = async () => {
      if (!user) {
        setErrorMessage("You must be logged in to process audio.");
        setCurrentPage(AppPage.AUTH);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);
      
      try {
        // Step 1: Check and deduct credits
        setStatusMessage("Checking credits...");
        setProgress(10);
        
        const creditsDeducted = await checkAndDeductCredits(user, setIsLoading, setErrorMessage);
        if (!creditsDeducted) {
          setErrorMessage("Insufficient credits. Please purchase more credits to continue.");
          setTimeout(() => setCurrentPage(AppPage.BUY_CREDITS), 3000);
          return;
        }

        // Step 2: Prepare mastering settings
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

        // Step 3: Apply AI settings if enabled
        if (finalSettings.aiSettingsApplied && apiKey) {
          setStatusMessage("Generating AI mastering plan...");
          setProgress(25);
          
          try {
            const aiSettings = await fetchAIChainSettings(
              finalSettings.genre,
              uploadedTrack.name,
              apiKey,
              finalSettings.referenceTrackFile ? { name: finalSettings.referenceTrackFile.name } : null,
              setIsLoading,
              setErrorMessage
            );
            
            if (aiSettings && !cancelledRef.current) {
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
            }
          } catch (err) {
            console.warn("AI settings failed, using manual settings:", err);
          }
        }

        if (cancelledRef.current) return;
        
        // Step 4: Process the audio
        setStatusMessage("Applying advanced audio processing...");
        setProgress(50);

        const masteredBuffer = await processAudio(uploadedTrack.audioBuffer, finalSettings);
        setMasteredAudioBuffer(masteredBuffer);

        if (cancelledRef.current) return;

        // Step 5: Generate AI report (non-blocking)
        if (apiKey && !cancelledRef.current) {
          setIsFetchingReport(true);
          generateMasteringReport(uploadedTrack.name, finalSettings, apiKey, setIsLoading, setErrorMessage)
            .then((report) => {
              if (!cancelledRef.current) {
                setMasteringReportNotes(report);
              }
            })
            .catch((err) => {
              console.warn("AI report generation failed:", err);
            })
            .finally(() => {
              if (!cancelledRef.current) {
                setIsFetchingReport(false);
              }
            });
        }

        // Step 6: Create track info
        let trackInfo: MasteredTrackInfo = {
          id: `track_${Date.now()}`,
          originalName: uploadedTrack.name,
          masteredName: `mastered_${uploadedTrack.name}`,
          dateProcessed: new Date().toISOString(),
          settings: finalSettings,
          downloadUrl: '',
          originalDuration: uploadedTrack.audioBuffer.duration,
          masteredDuration: masteredBuffer.duration,
        };

        // Step 7: Upload to cloud storage
        setStatusMessage("Uploading files to cloud...");
        setProgress(80);
        
        const downloadURL = await uploadMasteredTrack(user, masteredBuffer, setIsLoading, setErrorMessage);
        if (downloadURL) {
          trackInfo.downloadUrl = downloadURL;
          
          // Step 8: Save project to database
          const savedProject = await saveUserProject(user, uploadedTrack.name, downloadURL, finalSettings, setIsLoading, setErrorMessage);
          if (savedProject) {
            trackInfo = { ...trackInfo, ...savedProject };
            addUserProject(trackInfo);
          }
        }

        setMasteredTrackInfo(trackInfo);
        setProgress(100);
        setStatusMessage("Mastering complete!");
        
        setTimeout(() => setCurrentPage(AppPage.PREVIEW), 2000);
      } catch (error: unknown) {
        if (!cancelledRef.current) {
          console.error("Mastering failed:", error);
          if (error instanceof Error) {
            setErrorMessage(`Error during mastering: ${error.message}`);
          } else {
            setErrorMessage("Error during mastering: Unknown error");
          }
          setTimeout(() => setCurrentPage(AppPage.SETTINGS), 3000);
        }
      } finally {
        if (!cancelledRef.current) {
          setIsLoading(false);
        }
      }
    };

    performMastering();

    return () => {
      cancelledRef.current = true;
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [uploadedTrack, masteringSettings, apiKey, setCurrentPage, setMasteredAudioBuffer, addUserProject, user, setIsLoading, setErrorMessage]);

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
        <StatusMessage type="info" message={statusMessage} className="mb-6" />

        {/* Progress Bar with Percentage */}
        <div className="mb-4">
          <ProgressBar progress={progress} />
          <p className="text-primary-focus font-bold text-lg mt-2">{progress}%</p>
        </div>
      </div>

      {/* AI Insights */}
      {(isFetchingReport || masteringReportNotes) && (
        <StatusMessage type="info" message={masteringReportNotes || "Generating insights..."} className="mt-6">
          {isFetchingReport && <LoadingSpinner size="sm" text="Generating insights..." />}
        </StatusMessage>
      )}

      {progress === 100 && (
        <p className="mt-6 text-green-400 animate-fadeIn">Processing finished! Preparing your preview...</p>
      )}
    </div>
  );
};

export default ProcessingAudioPage;
