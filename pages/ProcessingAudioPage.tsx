import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage, MasteredTrackInfo, MasteringVariation, Stem } from '../types';
import ProgressBar from '../components/ProgressBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { processAudio } from '../services/audioProcessingService';
import { generateMasteringReport, fetchMasteringVariations } from '../services/geminiService';
import { IconMusicNote, IconSparkles, IconCheckCircle, IconCog } from '../constants';

interface ProcessingStep {
    id: string;
    label: string;
    icon: React.ReactNode;
}

const ProcessingAudioPage: React.FC = () => {
  const { 
    setCurrentPage, 
    projectTracks, 
    leadTrackId,
    masteringSettings, 
    setMasteredTrackInfo, 
    setMasteredAudioBuffer, 
    addUserProject, 
    apiKey,
    setMasteringVariations,
    setActiveVariationId
  } = useAppContext();
  
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [masteringReportNotes, setMasteringReportNotes] = useState<string | null>(null);
  const [isFetchingReport, setIsFetchingReport] = useState(false);

  const isMountedRef = useRef(true);
  const processingTimeoutIdRef = useRef<number | undefined>(undefined);

  const steps: ProcessingStep[] = [
      { id: 'analysis', label: 'Analyzing project fingerprint', icon: <IconMusicNote className="w-5 h-5"/> },
      { id: 'ai_plan', label: 'Generating cohesive AI variations', icon: <IconSparkles className="w-5 h-5"/> },
      { id: 'processing', label: 'Applying batch parallel processing', icon: <IconCog className="w-5 h-5"/> },
      { id: 'finalizing', label: 'Matching LUFS across project', icon: <IconCheckCircle className="w-5 h-5"/> },
  ];

  useEffect(() => {
    isMountedRef.current = true;
    if (projectTracks.length === 0 || !masteringSettings) {
      setCurrentPage(AppPage.UPLOAD); 
      return;
    }

    const leadTrack = projectTracks.find(t => t.id === leadTrackId) || projectTracks[0];

    const phases = [
      { duration: 2000, progressEnd: 20 }, // Fingerprint
      { duration: 3000, progressEnd: 40 }, // AI Variations
      { duration: 5000, progressEnd: 90 }, // Batch Processing
      { duration: 2000, progressEnd: 100 }, // Finalizing
    ];

    let phaseIdx = 0;
    
    if (apiKey && !masteringReportNotes) {
        setIsFetchingReport(true);
        generateMasteringReport(`Project: ${leadTrack.name} and ${projectTracks.length - 1} more`, masteringSettings, apiKey, (l)=>{}, (e)=>{})
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
        
        const startProgress = progress;
        const endProgress = phase.progressEnd;
        const startTime = Date.now();

        const animate = () => {
            if (!isMountedRef.current) return;
            const now = Date.now();
            const elapsed = now - startTime;
            const p = Math.min(elapsed / phase.duration, 1);
            
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
            if (!apiKey) throw new Error("API Key missing");
            const leadTrack = projectTracks.find(t => t.id === leadTrackId) || projectTracks[0];

            // 1. Fetch AI Variations based on Lead Track / Stems
            const variations = await fetchMasteringVariations(
                masteringSettings!.genre, 
                leadTrack.name, 
                apiKey, 
                leadTrack.analysis, 
                (l) => {}, 
                (e) => {},
                leadTrack.stems // Pass stems if available
            );

            if (!isMountedRef.current) return;

            // 2. Process ALL tracks for each variation
            const processedVariations = await Promise.all(variations.map(async (v) => {
                const projectBuffers: Record<string, AudioBuffer> = {};
                
                for (let i = 0; i < projectTracks.length; i++) {
                    const track = projectTracks[i];
                    setCurrentTrackIndex(i);
                    
                    // If track has stems and AI suggested gains for them, apply them
                    let trackStems = track.stems;
                    if (trackStems && (v as any).stemGains) {
                        trackStems = trackStems.map(s => ({
                            ...s,
                            gain: (v as any).stemGains[s.id] || s.gain
                        }));
                    }
                    
                    const fingerprint = track.id === leadTrack.id ? null : leadTrack.analysis;
                    
                    const buffer = await processAudio(
                        track.audioBuffer!, 
                        v.settings as any, 
                        fingerprint,
                        trackStems // Pass stems for summing
                    );
                    projectBuffers[track.id] = buffer;
                }
                
                return { ...v, projectBuffers, audioBuffer: projectBuffers[leadTrack.id] };
            }));

            if (!isMountedRef.current) return;
            
            setMasteringVariations(processedVariations);
            
            if (processedVariations.length > 0) {
                setMasteredAudioBuffer(processedVariations[0].audioBuffer!);
                setActiveVariationId(processedVariations[0].id);
                
                const newProject: MasteredTrackInfo = {
                    id: `proj_${Date.now()}`,
                    file: leadTrack.file,
                    name: leadTrack.name,
                    audioBuffer: leadTrack.audioBuffer,
                    masteredFileUrl: 'blob:mock',
                    settings: masteringSettings,
                    masteredDate: new Date(),
                    duration: processedVariations[0].audioBuffer!.duration,
                    masteringReportNotes: masteringReportNotes || undefined,
                };
                setMasteredTrackInfo(newProject);
                addUserProject(newProject);
            }
            
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
    <div className="max-w-4xl mx-auto animate-fadeIn">
        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Left: Project Status */}
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
                 <h2 className="text-2xl font-heading font-bold text-white mb-2">Batch Processing</h2>
                 <p className="text-slate-400 text-sm">
                    Track <span className="text-primary font-bold">{currentTrackIndex + 1}</span> of <span className="text-white font-bold">{projectTracks.length}</span>
                 </p>
                 <div className="mt-4 text-xs text-slate-500 italic truncate px-4">
                    Processing: {projectTracks[currentTrackIndex]?.name}
                 </div>
            </div>

            {/* Right: Steps */}
            <div className="w-full md:w-1/2 space-y-6">
                <div className="bg-slate-900/40 border border-slate-700/30 rounded-2xl p-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Project Log</h3>
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
                            <span className="text-xs font-bold text-indigo-300 uppercase">AI Strategy</span>
                        </div>
                        {isFetchingReport ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay:'0.1s'}}></div>
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay:'0.2s'}}></div>
                            </div>
                        ) : (
                            <p className="text-xs text-indigo-100 italic leading-relaxed">"{masteringReportNotes}"</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default ProcessingAudioPage;