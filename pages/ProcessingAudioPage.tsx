import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage, MasteredTrackInfo } from '../types';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { processAudio } from '../services/audioProcessingService';
import { generateMasteringReport } from '../services/geminiService';
import { IconMusicNote, IconSparkles, IconCheckCircle, IconCog } from '../constants';

interface ProcessingStep {
    id: string;
    label: string;
    icon: React.ReactNode;
}

const ProcessingAudioPage: React.FC = () => {
  const { setCurrentPage, uploadedTrack, masteringSettings, setMasteredTrackInfo, setMasteredAudioBuffer, addUserProject, apiKey } = useAppContext();
  
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [masteringReportNotes, setMasteringReportNotes] = useState<string | null>(null);
  const [isFetchingReport, setIsFetchingReport] = useState(false);

  const isMountedRef = useRef(true);
  const processingTimeoutIdRef = useRef<number | undefined>(undefined);

  const steps: ProcessingStep[] = [
      { id: 'analysis', label: 'Analyzing spectral balance', icon: <IconMusicNote className="w-5 h-5"/> },
      { id: 'ai_plan', label: 'Generating AI mastering chain', icon: <IconSparkles className="w-5 h-5"/> },
      { id: 'processing', label: 'Applying EQ, Compression & Saturation', icon: <IconCog className="w-5 h-5"/> },
      { id: 'finalizing', label: 'Maximizing loudness & dithering', icon: <IconCheckCircle className="w-5 h-5"/> },
  ];

  useEffect(() => {
    isMountedRef.current = true;
    if (!uploadedTrack || !masteringSettings || !uploadedTrack.audioBuffer) {
      setCurrentPage(AppPage.UPLOAD); 
      return;
    }

    const phases = [
      { duration: 1500, progressEnd: 30 },
      { duration: 1500, progressEnd: 50 },
      { duration: 2500, progressEnd: 85 },
      { duration: 1000, progressEnd: 100 },
    ];

    let phaseIdx = 0;
    
    // Trigger AI Report in background
    if (apiKey && !masteringReportNotes) {
        setIsFetchingReport(true);
        generateMasteringReport(uploadedTrack.name, masteringSettings, apiKey)
            .then(report => { if(isMountedRef.current) setMasteringReportNotes(report); })
            .catch(err => console.error(err))
            .finally(() => { if(isMountedRef.current) setIsFetchingReport(false); });
    }

    const runPhase = () => {
        if (!isMountedRef.current) return;
        if (phaseIdx >= phases.length) {
            finishProcessing();
            return;
        }

        const phase = phases[phaseIdx];
        setCurrentStepIndex(phaseIdx);
        
        // Mock progress animation for the phase
        const startProgress = progress;
        const endProgress = phase.progressEnd;
        const startTime = Date.now();

        const animate = () => {
            if (!isMountedRef.current) return;
            const now = Date.now();
            const elapsed = now - startTime;
            const p = Math.min(elapsed / phase.duration, 1);
            
            // Interpolate progress
            const currentP = startProgress + (endProgress - startProgress) * p;
            setProgress(currentP);

            if (p < 1) {
                requestAnimationFrame(animate);
            } else {
                phaseIdx++;
                runPhase();
            }
        };
        requestAnimationFrame(animate);
    };

    const finishProcessing = async () => {
        try {
            // Real processing
            const masteredBuffer = await processAudio(uploadedTrack.audioBuffer!, masteringSettings);
            if (!isMountedRef.current) return;
            
            setMasteredAudioBuffer(masteredBuffer);
            
            const newProject: MasteredTrackInfo = {
                file: uploadedTrack.file,
                name: uploadedTrack.name,
                audioBuffer: uploadedTrack.audioBuffer,
                id: `proj_${Date.now()}`,
                masteredFileUrl: 'blob:mock',
                settings: masteringSettings,
                masteredDate: new Date(),
                duration: masteredBuffer.duration,
                masteringReportNotes: masteringReportNotes || undefined,
            };
            setMasteredTrackInfo(newProject);
            addUserProject(newProject);
            
            processingTimeoutIdRef.current = window.setTimeout(() => {
                if(isMountedRef.current) setCurrentPage(AppPage.PREVIEW);
            }, 800);
        } catch (e) {
            console.error(e);
            setCurrentPage(AppPage.SETTINGS);
        }
    };

    runPhase();

    return () => {
      isMountedRef.current = false;
      if (processingTimeoutIdRef.current) clearTimeout(processingTimeoutIdRef.current);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-start animate-fadeIn">
        {/* Left: Visualization */}
        <div className="w-full md:w-1/2 bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 p-8 rounded-2xl shadow-xl card-accent text-center">
             <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                     <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                     <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-primary transition-all duration-300 ease-out" strokeDasharray={377} strokeDashoffset={377 - (377 * progress) / 100} />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center flex-col">
                     <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
                 </div>
             </div>
             <h2 className="text-2xl font-heading font-bold text-white mb-2">Mastering in Progress</h2>
             <p className="text-slate-400">Polishing <span className="text-primary">{uploadedTrack?.name}</span></p>
        </div>

        {/* Right: Steps & Console */}
        <div className="w-full md:w-1/2 space-y-6">
            <div className="bg-slate-900/40 border border-slate-700/30 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Process Log</h3>
                <div className="space-y-4">
                    {steps.map((step, idx) => {
                        const isActive = idx === currentStepIndex;
                        const isCompleted = idx < currentStepIndex;
                        return (
                            <div key={step.id} className={`flex items-center space-x-3 transition-all duration-300 ${isActive ? 'scale-105' : 'opacity-70'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isCompleted ? 'bg-green-500 border-green-500 text-white' : isActive ? 'border-primary text-primary animate-pulse' : 'border-slate-600 text-slate-600'}`}>
                                    {isCompleted ? <IconCheckCircle className="w-5 h-5"/> : step.icon}
                                </div>
                                <span className={`text-sm font-medium ${isActive ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>{step.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* AI Insight Bubble */}
            {(isFetchingReport || masteringReportNotes) && (
                <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 p-4 rounded-xl animate-slideInUp">
                    <div className="flex items-center mb-2">
                        <IconSparkles className="w-4 h-4 text-indigo-400 mr-2"/>
                        <span className="text-xs font-bold text-indigo-300 uppercase">AI Insight</span>
                    </div>
                     {isFetchingReport ? (
                         <div className="flex items-center space-x-2">
                             <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                             <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay:'0.1s'}}></div>
                             <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></div>
                         </div>
                     ) : (
                         <p className="text-sm text-indigo-100 italic leading-relaxed">"{masteringReportNotes}"</p>
                     )}
                </div>
            )}
        </div>
    </div>
  );
};

export default ProcessingAudioPage;