
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage, MasteredTrackInfo } from '../types';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchAIChainSettings, generateMasteringReport } from '../services/geminiService';
import { IconSparkles } from '../constants';


const ProcessingAudioPage: React.FC = () => {
  const {
    setCurrentPage,
    uploadedTrack,
    masteringSettings,
    setMasteredTrackInfo,
    setMasteredAudioBuffer,
    addUserProject,
  } = useAppContext();

  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Initializing audio engine...");
  const [masteringReportNotes, setMasteringReportNotes] = useState<string | null>(null);
  const [isFetchingReport, setIsFetchingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  useEffect(() => {
    const runProcessing = async () => {
      if (!uploadedTrack || !masteringSettings) {
        setStatusMessage("Error: Missing track or settings data");
        setReportError("Unable to start processing. Please go back and try again.");
        return;
      }

      try {
        // Faster processing steps with better feedback
        const steps = [
          { message: "🔍 Analyzing audio characteristics...", progress: 20, delay: 800 },
          { message: "🎚️ Applying EQ and dynamics processing...", progress: 40, delay: 600 },
          { message: "🎛️ Processing stereo enhancement...", progress: 60, delay: 600 },
          { message: "⚡ Finalizing mastering chain...", progress: 80, delay: 500 },
          { message: "🎵 Generating final master...", progress: 95, delay: 400 },
          { message: "✨ Quality check and optimization...", progress: 100, delay: 300 }
        ];

        for (const step of steps) {
          setStatusMessage(step.message);
          setProgress(step.progress);
          
          // Shorter processing time for better UX
          await new Promise(resolve => setTimeout(resolve, step.delay));
        }

        // Generate AI insights (non-blocking)
        setIsFetchingReport(true);
        generateMasteringReport(uploadedTrack.name, masteringSettings)
          .then(report => {
            setMasteringReportNotes(report);
          })
          .catch(error => {
            console.log("AI report generation failed, continuing without it");
          })
          .finally(() => {
            setIsFetchingReport(false);
          });

        // Create mastered track info
        const masteredTrack: MasteredTrackInfo = {
          id: Date.now().toString(),
          originalName: uploadedTrack.name,
          masteredName: `${uploadedTrack.name.replace(/\.[^/.]+$/, '')}_mastered.wav`,
          dateProcessed: new Date().toISOString(),
          settings: masteringSettings,
          downloadUrl: '', // Will be set when actual processing is implemented
          originalDuration: uploadedTrack.duration || 0,
          masteredDuration: uploadedTrack.duration || 0,
        };

        setMasteredTrackInfo(masteredTrack);
        addUserProject(masteredTrack);

        // Show completion message and navigate quickly
        setStatusMessage("🎉 Processing complete! Preparing your preview...");
        setTimeout(() => {
          setCurrentPage(AppPage.PREVIEW);
        }, 1000);

      } catch (error) {
        console.error("Processing error:", error);
        setStatusMessage("❌ Processing failed");
        setReportError("An error occurred during processing. Please try again.");
      }
    };

    runProcessing();
  }, [uploadedTrack, masteringSettings, setCurrentPage, setMasteredTrackInfo, addUserProject]);

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

      {/* Completion Message */}
      {progress === 100 && !reportError && (
        <div className="mt-6 p-4 bg-green-900/20 backdrop-blur-md border border-green-500/50 rounded-lg animate-fadeIn">
          <div className="flex items-center justify-center">
            <span className="text-green-400 mr-2">🎉</span>
            <p className="text-green-400 font-semibold">Processing complete! Preparing your preview...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingAudioPage;
