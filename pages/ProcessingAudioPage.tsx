import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage, MasteredTrackInfo } from '../types';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchAIChainSettings, generateMasteringReport } from '../services/geminiService';
import { saveUserProject, checkAndDeductCredits } from '../services/firebaseService';
import { bulletproofUploadService } from '../services/bulletproofUploadService';
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

        // Step 2: Optimize settings based on genre
        setStatusMessage("Optimizing mastering settings...");
        setProgress(15);
        
        // Use genre-based optimization
        let finalSettings = { ...masteringSettings };
        
        // Apply genre-specific optimizations
        switch (masteringSettings.genre) {
          case 'Hip Hop':
            finalSettings.eq.bassGain = Math.max(finalSettings.eq.bassGain, 2);
            finalSettings.loudnessTarget = 'STREAMING_LOUD';
            break;
          case 'Afrobeats':
            finalSettings.eq.trebleGain = Math.max(finalSettings.eq.trebleGain, 1);
            finalSettings.saturation.amount = Math.min(finalSettings.saturation.amount + 0.1, 0.8);
            break;
          case 'EDM':
            finalSettings.eq.bassGain = Math.max(finalSettings.eq.bassGain, 3);
            finalSettings.loudnessTarget = 'CLUB';
            break;
          default:
            // Keep default settings
            break;
        }

        if (cancelledRef.current) return;

        // Step 3: Process the audio with automated mastering
        setStatusMessage("Applying intelligent mastering chain...");
        setProgress(30);
        
        let masteredBuffer: AudioBuffer;
        
        try {
          // Use the main audio processing service with optimized settings
          setStatusMessage("Processing audio with professional mastering chain...");
          setProgress(50);
          
          masteredBuffer = await processAudio(uploadedTrack.audioBuffer, finalSettings);
          
          if (!masteredBuffer || masteredBuffer.length === 0) {
            throw new Error("Audio processing failed to produce valid output");
          }
          
          setProgress(70);
          
        } catch (processingError) {
          console.warn("Advanced processing failed, using fallback:", processingError);
          
          // Fallback to basic processing
          setStatusMessage("Using fallback processing...");
          setProgress(50);
          
          masteredBuffer = await processAudio(uploadedTrack.audioBuffer, masteringSettings);
          
          if (!masteredBuffer || masteredBuffer.length === 0) {
            throw new Error("Audio processing failed. Please try again.");
          }
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
        setStatusMessage("Securing your track in the cloud...");
        setProgress(85);
        
        let downloadURL = '';
        let uploadSuccess = false;
        
        try {
          const uploadResult = await bulletproofUploadService.uploadMasteredTrack(
            user, 
            masteredBuffer, 
            setIsLoading, 
            setErrorMessage
          );
          
          if (uploadResult.success) {
            downloadURL = uploadResult.url || '';
            uploadSuccess = uploadResult.method !== 'local';
            console.log(`${uploadResult.method} upload successful:`, downloadURL);
          } else {
            throw new Error(uploadResult.error || 'Upload failed');
          }
        } catch (uploadError) {
          console.warn("Upload failed, continuing with local download:", uploadError);
          setErrorMessage("Cloud upload failed, but your mastered track is ready for local download.");
        }
        
        // Always save the project locally
        trackInfo.downloadUrl = downloadURL;
        addUserProject(trackInfo);
        
        // Try to save to database if upload succeeded
        if (uploadSuccess) {
          try {
            const savedProject = await saveUserProject(user, uploadedTrack.name, downloadURL, finalSettings, setIsLoading, setErrorMessage);
            if (savedProject) {
              trackInfo = { ...trackInfo, ...savedProject };
            }
          } catch (dbError) {
            console.warn("Database save failed:", dbError);
            // Even if database save fails, user still has cloud backup
          }
        }

        // Step 7: Complete
        setMasteredTrackInfo(trackInfo);
        setProgress(100);
        
        if (uploadSuccess) {
          setStatusMessage("🎉 Automated mastering complete! Your track is professionally mastered and safely stored.");
        } else {
          setStatusMessage("🎉 Automated mastering complete! Download your professionally mastered track below.");
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
