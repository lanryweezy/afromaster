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
        // Step 1: Validate input and prepare
        setStatusMessage("Initializing mastering engine...");
        setProgress(5);
        
        // Validate audio buffer
        if (!uploadedTrack.audioBuffer || uploadedTrack.audioBuffer.length === 0) {
          throw new Error("Invalid audio file. Please upload a valid audio track.");
        }
        
        // Check audio duration (prevent extremely long files)
        if (uploadedTrack.audioBuffer.duration > 600) { // 10 minutes max
          throw new Error("Audio file too long. Please use a track under 10 minutes.");
        }

        // Step 2: Prepare mastering settings with fallbacks
        setStatusMessage("Configuring mastering chain...");
        setProgress(15);
        
        let finalSettings = {
          ...masteringSettings,
          eq: { 
            bassFreq: masteringSettings.eq?.bassFreq ?? 200,
            trebleFreq: masteringSettings.eq?.trebleFreq ?? 5000,
            bassGain: masteringSettings.eq?.bassGain ?? 0,
            trebleGain: masteringSettings.eq?.trebleGain ?? 0,
          },
          crossover: { 
            lowPass: masteringSettings.crossover?.lowPass ?? 250,
            highPass: masteringSettings.crossover?.highPass ?? 4000,
          },
          bands: {
            low: { 
              threshold: masteringSettings.bands?.low?.threshold ?? -35,
              knee: masteringSettings.bands?.low?.knee ?? 15,
              ratio: masteringSettings.bands?.low?.ratio ?? 4,
              attack: masteringSettings.bands?.low?.attack ?? 0.05,
              release: masteringSettings.bands?.low?.release ?? 0.3,
              makeupGain: masteringSettings.bands?.low?.makeupGain ?? 2.0,
            },
            mid: { 
              threshold: masteringSettings.bands?.mid?.threshold ?? -30,
              knee: masteringSettings.bands?.mid?.knee ?? 10,
              ratio: masteringSettings.bands?.mid?.ratio ?? 3,
              attack: masteringSettings.bands?.mid?.attack ?? 0.01,
              release: masteringSettings.bands?.mid?.release ?? 0.25,
              makeupGain: masteringSettings.bands?.mid?.makeupGain ?? 2.0,
            },
            high: { 
              threshold: masteringSettings.bands?.high?.threshold ?? -25,
              knee: masteringSettings.bands?.high?.knee ?? 5,
              ratio: masteringSettings.bands?.high?.ratio ?? 3,
              attack: masteringSettings.bands?.high?.attack ?? 0.005,
              release: masteringSettings.bands?.high?.release ?? 0.15,
              makeupGain: masteringSettings.bands?.high?.makeupGain ?? 1.5,
            },
          },
          limiter: { 
            threshold: masteringSettings.limiter?.threshold ?? -1.5,
            attack: masteringSettings.limiter?.attack ?? 0.002,
            release: masteringSettings.limiter?.release ?? 0.05,
          },
          reverb: { 
            impulseResponse: masteringSettings.reverb?.impulseResponse ?? 'none',
            wetDryMix: masteringSettings.reverb?.wetDryMix ?? 0,
          },
          saturation: {
            flavor: masteringSettings.saturation?.flavor ?? 'tape',
            amount: masteringSettings.saturation?.amount ?? 0,
          },
        };

        if (cancelledRef.current) return;

        // Step 3: Process the audio with multiple fallback strategies
        setStatusMessage("Applying professional mastering...");
        setProgress(30);
        
        let masteredBuffer: AudioBuffer;
        
        try {
          // Primary processing
          masteredBuffer = await processAudio(uploadedTrack.audioBuffer, finalSettings);
        } catch (processingError) {
          console.warn("Primary processing failed, using fallback:", processingError);
          
          // Fallback: Use simplified settings
          const fallbackSettings = {
            ...finalSettings,
            eq: { bassFreq: 200, trebleFreq: 5000, bassGain: 0, trebleGain: 0 },
            saturation: { amount: 0, flavor: 'tape' },
            bands: {
              low: { threshold: -30, knee: 10, ratio: 3, attack: 0.01, release: 0.2, makeupGain: 1.5 },
              mid: { threshold: -25, knee: 8, ratio: 2, attack: 0.005, release: 0.15, makeupGain: 1.0 },
              high: { threshold: -20, knee: 5, ratio: 2, attack: 0.002, release: 0.1, makeupGain: 0.5 },
            },
            limiter: { threshold: -1.0, attack: 0.001, release: 0.01 },
          };
          
          masteredBuffer = await processAudio(uploadedTrack.audioBuffer, fallbackSettings);
        }
        
        // Validate processed audio
        if (!masteredBuffer || masteredBuffer.length === 0) {
          throw new Error("Audio processing failed. Please try again.");
        }
        
        setMasteredAudioBuffer(masteredBuffer);

        if (cancelledRef.current) return;

        // Step 4: Generate AI insights (non-blocking, only once)
        setStatusMessage("Generating mastering insights...");
        setProgress(60);
        
        if (apiKey && !cancelledRef.current && !masteringReportNotes) {
          setIsFetchingReport(true);
          generateMasteringReport(uploadedTrack.name, finalSettings, apiKey, () => {}, setErrorMessage)
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

        // Step 5: Create track info
        setStatusMessage("Finalizing your master...");
        setProgress(75);
        
        let trackInfo: MasteredTrackInfo = {
          id: `track_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
          originalName: uploadedTrack.name,
          masteredName: `mastered_${uploadedTrack.name.replace(/\.[^/.]+$/, '')}.wav`,
          dateProcessed: new Date().toISOString(),
          settings: finalSettings,
          downloadUrl: '',
          originalDuration: uploadedTrack.audioBuffer.duration,
          masteredDuration: masteredBuffer.duration,
        };

        // Step 6: Upload to cloud storage (bulletproof)
        setStatusMessage("Preparing download...");
        setProgress(85);
        
        let downloadURL = '';
        try {
          downloadURL = await uploadMasteredTrack(user, masteredBuffer, setIsLoading, setErrorMessage) || '';
        } catch (uploadError) {
          console.warn("Upload failed, continuing with local download:", uploadError);
          setErrorMessage("Cloud upload failed, but your mastered track is ready for local download.");
        }
        
        // Always save the project locally
        trackInfo.downloadUrl = downloadURL;
        addUserProject(trackInfo);
        
        // Try to save to database if upload succeeded (and it's a real URL)
        if (downloadURL && downloadURL !== 'local-download-available') {
          try {
            const savedProject = await saveUserProject(user, uploadedTrack.name, downloadURL, finalSettings, setIsLoading, setErrorMessage);
            if (savedProject) {
              trackInfo = { ...trackInfo, ...savedProject };
            }
          } catch (dbError) {
            console.warn("Database save failed:", dbError);
          }
        }

        // Step 7: Complete
        setMasteredTrackInfo(trackInfo);
        setProgress(100);
        
        if (downloadURL && downloadURL !== 'local-download-available') {
          setStatusMessage("Mastering complete! Your track is ready for download.");
        } else {
          setStatusMessage("Mastering complete! Download your track below.");
        }
        
        setTimeout(() => setCurrentPage(AppPage.PREVIEW), 2000);
        
      } catch (error: unknown) {
        if (!cancelledRef.current) {
          console.error("Mastering failed:", error);
          
          // Provide specific error messages
          let errorMessage = "Mastering failed. Please try again.";
          if (error instanceof Error) {
            if (error.message.includes("Invalid audio")) {
              errorMessage = "Please upload a valid audio file (WAV, MP3, etc.).";
            } else if (error.message.includes("too long")) {
              errorMessage = "Please use a shorter audio file (under 10 minutes).";
            } else if (error.message.includes("processing failed")) {
              errorMessage = "Audio processing failed. Please try with a different file.";
            } else {
              errorMessage = `Error: ${error.message}`;
            }
          }
          
          setErrorMessage(errorMessage);
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
