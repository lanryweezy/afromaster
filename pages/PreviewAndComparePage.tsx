import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import Button from '../components/Button';
import { IconPlay, IconPause, IconCog, IconCheckCircle, IconArrowLeft } from '../constants';
import LoadingSpinner from '../components/LoadingSpinner';
import WaveformCanvas from '../components/WaveformCanvas';
import ToggleSwitch from '../components/ToggleSwitch';

const PreviewAndComparePage: React.FC = () => {
  const { setCurrentPage, uploadedTrack, masteredTrackInfo, masteringSettings, originalAudioBuffer, masteredAudioBuffer } = useAppContext();

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const startTimeRef = useRef(0);
  const startedAtRef = useRef(0);
  
  const [isReady, setIsReady] = useState(false);
  const [isActuallyPlaying, setActuallyPlaying] = useState(false);
  const [isMastered, setIsMastered] = useState(true);

  // Keyboard shortcut for spacebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
            e.preventDefault();
            playPause();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActuallyPlaying]); // Re-bind isn't strictly necessary due to refs but safe

  useEffect(() => {
      const initAudio = async () => {
          if (originalAudioBuffer && masteredAudioBuffer && !audioCtxRef.current) {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
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
  }, [originalAudioBuffer, masteredAudioBuffer]);

  const playCurrentVersion = (offset = 0) => {
      const audioCtx = audioCtxRef.current;
      const gainNode = gainNodeRef.current;
      const bufferToPlay = isMastered ? masteredAudioBuffer : originalAudioBuffer;
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
      
      source.onended = () => {
          if (isPlayingRef.current) handleStop();
      };
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

  const handleToggle = () => {
      const newIsMastered = !isMastered;
      setIsMastered(newIsMastered);
      if (isPlayingRef.current && audioCtxRef.current) {
          const newStartTime = startTimeRef.current + (audioCtxRef.current.currentTime - startedAtRef.current);
          startTimeRef.current = newStartTime;
          playCurrentVersion(newStartTime);
      }
  };

  if (!uploadedTrack || !masteredTrackInfo || !masteringSettings) {
    setCurrentPage(AppPage.UPLOAD);
    return <LoadingSpinner text="Missing track data..." />;
  }
  if (!isReady) return <LoadingSpinner text="Initializing audio engine..." />;

  const WaveformDisplay: React.FC<{ versionText: 'Original' | 'Mastered', isActive: boolean, buffer: AudioBuffer | null }> = ({ versionText, isActive, buffer }) => (
    <div className={`relative p-1 rounded-2xl transition-all duration-500 ${isActive ? 'bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20 scale-[1.02] z-10' : 'bg-slate-800 border border-slate-700 opacity-60 scale-95 z-0 grayscale'}`}>
        <div className="bg-slate-900 rounded-xl p-4 h-full">
            <div className="flex justify-between items-center mb-4">
                <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${isActive ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-slate-500'}`}>
                    {versionText}
                </span>
                {isActive && <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="text-[10px] text-green-500 font-bold">ACTIVE</div>
                </div>}
            </div>
            <div className="h-32 rounded-lg bg-slate-950/50 flex items-center justify-center overflow-hidden relative">
                <WaveformCanvas buffer={buffer} />
                {isActive && isActuallyPlaying && (
                    <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-[scan_2s_linear_infinite]" style={{ animationDuration: `${buffer?.duration || 10}s` }}></div>
                )}
            </div>
        </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn">
      {/* Header Controls */}
      <div className="flex flex-col items-center justify-center py-10">
          <h2 className="text-3xl font-heading font-bold text-white mb-8">Compare Results</h2>
          
          <div className="flex items-center gap-10">
               <div className="text-right hidden sm:block">
                   <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Before</p>
                   <p className={`font-bold transition-colors ${!isMastered ? 'text-white' : 'text-slate-600'}`}>Original Mix</p>
               </div>

               <div className="flex flex-col items-center gap-6">
                    <button 
                        onClick={playPause} 
                        className={`w-24 h-24 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl ${isActuallyPlaying ? 'bg-slate-800 ring-4 ring-primary/50' : 'bg-gradient-to-br from-primary to-secondary shadow-primary/40'}`}
                    >
                        {isActuallyPlaying ? <IconPause className="w-10 h-10 fill-current"/> : <IconPlay className="w-10 h-10 fill-current ml-1"/>}
                    </button>
                    <ToggleSwitch isEnabled={isMastered} onToggle={handleToggle} disabledLabel="Original" enabledLabel="Mastered" />
               </div>

               <div className="text-left hidden sm:block">
                   <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">After</p>
                   <p className={`font-bold transition-colors ${isMastered ? 'text-primary' : 'text-slate-600'}`}>Afromaster</p>
               </div>
          </div>
          <p className="text-xs text-slate-500 mt-6 font-mono">Press SPACE to Play/Pause</p>
      </div>
      
      {/* Visualizers */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <WaveformDisplay versionText="Original" isActive={!isMastered} buffer={originalAudioBuffer}/>
        <WaveformDisplay versionText="Mastered" isActive={isMastered} buffer={masteredAudioBuffer}/>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 border-t border-slate-800 pt-8">
        <Button 
          onClick={() => { if(isActuallyPlaying) playPause(); setCurrentPage(AppPage.SETTINGS); }}
          variant="secondary" 
          size="lg"
          leftIcon={<IconArrowLeft className="w-5 h-5"/>}
        >
          Tweaks Settings
        </Button>
        <Button 
          onClick={() => { if(isActuallyPlaying) playPause(); setCurrentPage(AppPage.DOWNLOAD); }} 
          size="lg"
          variant="primary"
          rightIcon={<IconCheckCircle className="w-5 h-5"/>}
          className="w-full sm:w-auto px-12"
        >
          Keep This Master
        </Button>
      </div>
    </div>
  );
};

export default PreviewAndComparePage;