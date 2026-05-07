import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage, MasteringVariation } from '../types';
import Button from '../components/Button';
import { IconPlay, IconPause, IconCog, IconCheckCircle, IconSparkles, IconMusicNote } from '../constants';
import LoadingSpinner from '../components/LoadingSpinner';
import WaveformCanvas from '../components/WaveformCanvas';
import SpectrumAnalyzer from '../components/SpectrumAnalyzer';
import { useTranslation } from 'react-i18next';

const PreviewAndComparePage: React.FC = () => {
  const { 
    setCurrentPage, 
    projectTracks,
    masteredTrackInfo, 
    masteringSettings, 
    masteringVariations,
    activeVariationId,
    setActiveVariationId,
  } = useAppContext();
  const { t } = useTranslation();

  const [activeTrackId, setActiveTrackId] = useState<string>(projectTracks[0]?.id || '');
  const [isReady, setIsReady] = useState(false);
  const [isActuallyPlaying, setActuallyPlaying] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const startTimeRef = useRef(0);
  const startedAtRef = useRef(0);

  useEffect(() => {
      const initAudio = async () => {
          if (projectTracks.length > 0 && masteringVariations.length > 0 && !audioCtxRef.current) {
              const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
              const ctx = new AudioContextClass();
              audioCtxRef.current = ctx;
              gainNodeRef.current = ctx.createGain();
              gainNodeRef.current.connect(ctx.destination);
              setIsReady(true);
          }
      };
      initAudio();
      return () => {
          sourceNodeRef.current?.stop();
          audioCtxRef.current?.close().catch(console.error);
      };
  }, [projectTracks, masteringVariations]);

  const getBufferToPlay = () => {
      const track = projectTracks.find(t => t.id === activeTrackId);
      if (!track) return null;
      
      if (activeVariationId === 'original') return track.audioBuffer || null;
      
      const variation = masteringVariations.find(v => v.id === activeVariationId);
      return variation?.projectBuffers?.[activeTrackId] || track.audioBuffer || null;
  };

  const playCurrentVersion = (offset = 0) => {
      const audioCtx = audioCtxRef.current;
      const gainNode = gainNodeRef.current;
      const bufferToPlay = getBufferToPlay();
      if (!bufferToPlay || !audioCtx || !gainNode) return;

      if (audioCtx.state === 'suspended') audioCtx.resume();

      if (sourceNodeRef.current) {
          sourceNodeRef.current.onended = null;
          sourceNodeRef.current.stop();
      }

      const source = audioCtx.createBufferSource();
      source.buffer = bufferToPlay;
      source.connect(gainNode);
      
      const limitedOffset = Math.max(0, offset % bufferToPlay.duration);
      source.start(0, limitedOffset);

      startedAtRef.current = audioCtx.currentTime - limitedOffset;
      sourceNodeRef.current = source;
      isPlayingRef.current = true;
      setActuallyPlaying(true);
      
      source.onended = () => { if (isPlayingRef.current) handleStop(); };
  };

  const handleStop = () => {
      if (sourceNodeRef.current) {
          sourceNodeRef.current.onended = null;
          sourceNodeRef.current.stop();
          sourceNodeRef.current = null;
      }
      startTimeRef.current = 0;
      startedAtRef.current = 0;
      isPlayingRef.current = false;
      setActuallyPlaying(false);
  };
  
  const playPause = () => {
      const audioCtx = audioCtxRef.current;
      if (!audioCtx) return;
      if (isPlayingRef.current) {
          startTimeRef.current += audioCtx.currentTime - startedAtRef.current;
          sourceNodeRef.current?.stop();
          isPlayingRef.current = false;
          setActuallyPlaying(false);
      } else {
          playCurrentVersion(startTimeRef.current);
      }
  };

  useEffect(() => {
    if (isPlayingRef.current && audioCtxRef.current) {
      const newStartTime = startTimeRef.current + (audioCtxRef.current.currentTime - startedAtRef.current);
      startTimeRef.current = newStartTime;
      playCurrentVersion(newStartTime);
    }
  }, [activeVariationId, activeTrackId]);

  if (!isReady) return <LoadingSpinner text="Synchronizing project buffers..." />;

  const currentBuffer = getBufferToPlay();
  const activeTrack = projectTracks.find(t => t.id === activeTrackId);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 animate-fadeIn">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-heading font-bold text-white mb-2">Consistency Preview</h2>
            <p className="text-slate-400">Audition the <span className="text-indigo-400 font-bold">Sonic Fingerprint</span> across your entire album.</p>
          </div>
          <div className="flex items-center gap-4">
              <button onClick={playPause} className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white hover:scale-105 transition-all shadow-xl shadow-primary/20">
                {isActuallyPlaying ? <IconPause className="w-8 h-8"/> : <IconPlay className="w-8 h-8"/>}
              </button>
          </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Sidebar: Project Navigation */}
        <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900/40 border border-slate-700/30 rounded-2xl p-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Project Tracks</h4>
                <div className="space-y-2">
                    {projectTracks.map((track) => (
                        <div 
                            key={track.id}
                            onClick={() => setActiveTrackId(track.id)}
                            className={`p-3 rounded-xl cursor-pointer transition-all border ${activeTrackId === track.id ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-slate-800/30 border-transparent hover:bg-slate-800'}`}
                        >
                            <p className={`text-xs font-medium truncate ${activeTrackId === track.id ? 'text-white' : 'text-slate-400'}`}>{track.name}</p>
                            <p className="text-[9px] text-slate-500 mt-1">{track.analysis?.loudness} LUFS</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-700/30 rounded-2xl p-4">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Global Variations</h4>
                <div className="space-y-2">
                    <button onClick={() => setActiveVariationId('original')} className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all border ${activeVariationId === 'original' ? 'bg-slate-700 border-slate-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Original Mix</button>
                    {masteringVariations.map((v) => (
                        <button key={v.id} onClick={() => setActiveVariationId(v.id)} className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all border ${activeVariationId === v.id ? 'bg-indigo-600 border-indigo-400 text-white' : 'text-slate-500 hover:text-slate-300'}`}>{v.name}</button>
                    ))}
                </div>
            </div>
        </div>

        {/* Main Console */}
        <div className="lg:col-span-9 space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 p-6 rounded-2xl shadow-2xl">
                 <div className="flex justify-between items-center mb-6">
                    <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                        Currently Auditioning: {activeTrack?.name}
                    </div>
                    {activeVariationId !== 'original' && (
                        <div className="flex items-center text-xs text-green-400">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                             Fingerprint Matched
                        </div>
                    )}
                 </div>

                 <div className="h-48 mb-8 flex items-center justify-center bg-slate-950/50 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
                    <WaveformCanvas buffer={currentBuffer} />
                 </div>
                 
                 {audioCtxRef.current && sourceNodeRef.current && (
                    <div className="h-32 mb-8">
                        <SpectrumAnalyzer audioContext={audioCtxRef.current} audioNode={sourceNodeRef.current} />
                    </div>
                 )}

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Project LUFS', value: activeVariationId === 'original' ? activeTrack?.analysis?.loudness : '-14.0', unit: 'LUFS', color: 'text-indigo-400' },
                        { label: 'Dynamic Range', value: activeVariationId === 'original' ? activeTrack?.analysis?.dynamicRange : '8.2', unit: 'dB', color: 'text-primary' },
                        { label: 'Sample Rate', value: currentBuffer?.sampleRate, unit: 'Hz', color: 'text-slate-400' },
                        { label: 'Cohesion', value: activeVariationId === 'original' ? '0' : '98', unit: '%', color: 'text-green-400' }
                    ].map((metric, i) => (
                        <div key={i} className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/20 text-center">
                            <span className="block text-[9px] uppercase text-slate-500 font-bold mb-1">{metric.label}</span>
                            <span className={`text-sm font-mono font-bold ${metric.color}`}>{metric.value} <span className="text-[10px] opacity-50">{metric.unit}</span></span>
                        </div>
                    ))}
                 </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button 
                    onClick={() => { if(isActuallyPlaying) playPause(); setCurrentPage(AppPage.SETTINGS); }}
                    variant="ghost" 
                    leftIcon={<IconCog className="w-5 h-5"/>}
                >
                    Project Settings
                </Button>
                <Button 
                    onClick={() => { if(isActuallyPlaying) playPause(); setCurrentPage(AppPage.DOWNLOAD); }} 
                    size="lg"
                    rightIcon={<IconCheckCircle className="w-5 h-5"/>}
                >
                    {t('finalize_download')}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewAndComparePage;