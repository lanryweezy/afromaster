
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage, MasteredTrackInfo } from '../types';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchAIChainSettings, generateMasteringReport } from '../services/geminiService';
import { IconSparkles } from '../constants';
import { db, storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import toWav from 'audiobuffer-to-wav';

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
    const worker = new Worker(new URL('../audio.worker.ts', import.meta.url), { type: 'module' });

    let cancelled = false;
    worker.onmessage = async (event) => {
      if (cancelled) return;
      const { masteredBuffer } = event.data;
      setMasteredAudioBuffer(masteredBuffer);

      if (user) {
        setStatusMessage("Uploading files to cloud...");
        const wavBlob = new Blob([toWav(masteredBuffer)], { type: 'audio/wav' });
        const storageRef = ref(storage, `users/${user.uid}/tracks/${Date.now()}_mastered.wav`);
        await uploadBytes(storageRef, wavBlob);
        const downloadURL = await getDownloadURL(storageRef);

        const projectData = {
          userId: user.uid,
          trackName: uploadedTrack.name,
          masteredFileUrl: downloadURL,
          settings: masteringSettings,
          createdAt: new Date(),
        };
        };
        await addDoc(collection(db, "projects"), projectData);
      }

      setProgress(100);
      setStatusMessage("Mastering complete!");
      setTimeout(() => setCurrentPage(AppPage.PREVIEW), 1000);
    };

    const performMastering = async () => {
      try {
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          if (!userDoc.exists() || userDoc.data().credits < 1) {
            setStatusMessage("You don't have enough credits to master a track.");
            setTimeout(() => setCurrentPage(AppPage.BUY_CREDITS), 3000);
            return;
          }
          await updateDoc(userRef, {
            credits: userDoc.data().credits - 1,
          });
        }

        let finalSettings = { ...masteringSettings };

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
            finalSettings = { ...finalSettings, ...aiSettings };
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
  }, [uploadedTrack, masteringSettings, apiKey, setCurrentPage, setMasteredAudioBuffer]);

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
