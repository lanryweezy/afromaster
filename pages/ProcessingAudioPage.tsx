
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
  const [statusMessage, setStatusMessage] = useState("Initializing...");
  const [masteringReportNotes, setMasteringReportNotes] = useState<string | null>(null);
  const [isFetchingReport, setIsFetchingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  useEffect(() => {
    const runProcessing = async () => {
      if (!uploadedTrack || !masteringSettings) return;

      // Simulate processing steps
      const steps = [
        { message: "Analyzing audio characteristics...", progress: 20 },
        { message: "Applying EQ and dynamics...", progress: 40 },
        { message: "Processing stereo enhancement...", progress: 60 },
        { message: "Finalizing mastering chain...", progress: 80 },
        { message: "Generating master...", progress: 100 }
      ];

      for (const step of steps) {
        setStatusMessage(step.message);
        setProgress(step.progress);
        
        // Wait for 1.5 seconds between steps
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Create mock mastered track info
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

      // Navigate to preview page after processing
      setTimeout(() => {
        setCurrentPage(AppPage.PREVIEW);
      }, 1000);
    };

    runProcessing();
  }, [uploadedTrack, masteringSettings, setCurrentPage, setMasteredTrackInfo, addUserProject]);

  if (!uploadedTrack || !masteringSettings) {
    return <LoadingSpinner text="Loading data..." />;
  }

  return (
    <div className="max-w-2xl mx-auto text-center p-6 md:p-8 bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-2xl card-accent">
      <h2 className="text-3xl sm:text-4xl font-heading font-semibold mb-6 text-gradient-primary">Afromastering Your Track</h2>
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

      {progress === 100 && (
        <p className="mt-6 text-green-400 animate-fadeIn">Processing finished! Preparing your preview...</p>
      )}
    </div>
  );
};

export default ProcessingAudioPage;
