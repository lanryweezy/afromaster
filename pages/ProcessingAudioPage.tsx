import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage, MasteredTrackInfo } from '../types';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { processAudio } from '../services/audioProcessingService';
import { generateMasteringReport } from '../services/geminiService';
import { IconMusicNote, IconSparkles } from '../constants';

const ProcessingAudioPage: React.FC = () => {
  const { 
    setCurrentPage, 
    uploadedTrack, 
    masteringSettings, 
    setMasteredTrackInfo,
    setMasteredAudioBuffer,
    addUserProject,
    apiKey 
  } = useAppContext();
  
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Initializing mastering engine...");
  const [masteringReportNotes, setMasteringReportNotes] = useState<string | null>(null);
  const [isFetchingReport, setIsFetchingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const intervalIdRef = useRef<number | undefined>(undefined);
  const processingTimeoutIdRef = useRef<number | undefined>(undefined);
  const isMountedRef = useRef(true);


  useEffect(() => {
    isMountedRef.current = true;
    if (!uploadedTrack || !masteringSettings || !uploadedTrack.audioBuffer) {
      setCurrentPage(AppPage.UPLOAD); 
      return;
    }

    const phases = [
      { msg: "Analyzing audio structure...", duration: 1000, progressIncr: 15, key: "analysis" },
      { msg: "AI generating mastering plan...", duration: 1000, progressIncr: 25, key: "ai_plan_initiate" }, // Shorter, just to show message
      { msg: "Applying EQ and dynamics...", duration: 1500, progressIncr: 25, key: "eq_dynamics" },
      { msg: "Enhancing stereo image...", duration: 1000, progressIncr: 15, key: "stereo" },
      { msg: "Optimizing loudness & finalizing...", duration: 1000, progressIncr: 20, key: "finalize" },
    ];

    let currentPhaseIndex = 0;
    let cumulativeProgress = 0;

    const executePhase = async () => {
      if (currentPhaseIndex >= phases.length) {
        if (!isMountedRef.current) return;
        setProgress(100);
        setStatusMessage("Mastering complete!");
        processingTimeoutIdRef.current = window.setTimeout(async () => {
          if (!isMountedRef.current) return;
          try {
            // This is now the real processing call
            const masteredBuffer = await processAudio(uploadedTrack.audioBuffer!, masteringSettings);
            if (!isMountedRef.current) return;

            setMasteredAudioBuffer(masteredBuffer);

            const newMasteredTrack: MasteredTrackInfo = {
              file: uploadedTrack.file,
              name: uploadedTrack.name,
              audioBuffer: uploadedTrack.audioBuffer,
              id: `proj_${Date.now()}`,
              masteredFileUrl: 'processed_in_browser', // No longer a mock URL
              settings: masteringSettings,
              masteredDate: new Date(),
              duration: masteredBuffer.duration,
              masteringReportNotes: masteringReportNotes || undefined,
            };
            setMasteredTrackInfo(newMasteredTrack);
            addUserProject(newMasteredTrack);
            setCurrentPage(AppPage.PREVIEW);
          } catch (error) {
            console.error("Mastering failed:", error);
            setStatusMessage("Error during mastering. Please try again.");
            if (isMountedRef.current) setTimeout(() => setCurrentPage(AppPage.SETTINGS), 2000);
          }
        }, 500);
        return;
      }

      const currentPhase = phases[currentPhaseIndex];
      if (!isMountedRef.current) return;
      setStatusMessage(currentPhase.msg);

      if (currentPhase.key === "ai_plan_initiate") {
        if (apiKey && uploadedTrack && masteringSettings) {
          if (!isMountedRef.current) return;
          setIsFetchingReport(true);
          setReportError(null);
          try {
            const report = await generateMasteringReport(uploadedTrack.name, masteringSettings, apiKey);
            if (isMountedRef.current) setMasteringReportNotes(report);
          } catch (err: any) {
            if (isMountedRef.current) setReportError(err.message || "Failed to get AI insights.");
          } finally {
            if (isMountedRef.current) setIsFetchingReport(false);
          }
        } else if (!apiKey) {
            if (isMountedRef.current) setReportError("API Key not available for AI insights.");
        }
      }
      
      // Animate progress for the current phase
      const progressTarget = cumulativeProgress + currentPhase.progressIncr;
      const steps = 10;
      const stepDuration = currentPhase.duration / steps;
      const progressStep = currentPhase.progressIncr / steps;
      let currentStepProgress = cumulativeProgress;

      const animateProgress = () => {
        if (!isMountedRef.current) return;
        currentStepProgress += progressStep;
        setProgress(Math.min(progressTarget, currentStepProgress));

        if (currentStepProgress < progressTarget) {
          intervalIdRef.current = window.setTimeout(animateProgress, stepDuration);
        } else {
          cumulativeProgress = progressTarget;
          currentPhaseIndex++;
          // Ensure AI report fetching completes before moving if it was initiated
          if (currentPhase.key === "ai_plan_initiate" && isFetchingReport) {
             // Wait for fetching to complete by checking isFetchingReport in a loop or promise
             const waitForReport = async () => {
                while(isFetchingReport && isMountedRef.current) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                if(isMountedRef.current) executePhase();
             }
             waitForReport();
          } else {
            if(isMountedRef.current) executePhase();
          }
        }
      };
      animateProgress();
    };
    
    executePhase();

    return () => {
      isMountedRef.current = false;
      if (intervalIdRef.current !== undefined) {
        clearTimeout(intervalIdRef.current);
      }
      if (processingTimeoutIdRef.current !== undefined) {
        clearTimeout(processingTimeoutIdRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedTrack, masteringSettings, setCurrentPage, setMasteredTrackInfo, addUserProject, apiKey]); // masteringReportNotes removed, it's set internally


  if (!uploadedTrack || !masteringSettings) {
    return <LoadingSpinner text="Loading data..." />;
  }

  return (
    <div className="max-w-2xl mx-auto text-center p-6 md:p-8 bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-2xl card-accent">
      <h2 className="text-4xl font-heading font-semibold mb-6 text-gradient-primary">Afromastering Your Track</h2>
      <LoadingSpinner size="lg" className="mb-6" />
      <p className="text-slate-300 mb-2">Hang tight! <span className="font-semibold text-primary-focus transition-colors">{uploadedTrack.name}</span> is being polished.</p>
      <p className="text-slate-400 mb-6 text-sm min-h-[20px]">{statusMessage}</p>
      <ProgressBar progress={progress} />

      {(isFetchingReport || masteringReportNotes || reportError) && (
        <div className="mt-6 p-4 bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-lg text-left animate-fadeIn">
          <div className="flex items-center mb-2">
            <IconSparkles className="w-5 h-5 text-yellow-400 mr-2" />
            <h4 className="text-md font-semibold text-primary-focus transition-colors">AI Mastering Insights</h4>
          </div>
          {isFetchingReport && <LoadingSpinner size="sm" text="Generating insights..." />}
          {reportError && !isFetchingReport && <p className="text-red-400 text-sm">{reportError}</p>}
          {masteringReportNotes && !isFetchingReport && !reportError && (
            <p className="text-slate-300 text-sm whitespace-pre-wrap">{masteringReportNotes}</p>
          )}
        </div>
      )}

      {progress === 100 && statusMessage === "Mastering complete!" && (
        <p className="mt-6 text-green-400 animate-fadeIn">Processing finished! Preparing your preview...</p>
      )}
    </div>
  );
};

export default ProcessingAudioPage;
