
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import Button from '../components/Button';
import { IconPlay, IconPause, IconCog, IconCheckCircle } from '../constants';
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
  const [isActuallyPlaying, setActuallyPlaying] = useState(false); // UI state
  const [isMastered, setIsMastered] = useState(true);

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

      if (audioCtx.state === 'suspended') {
          audioCtx.resume();
      }

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
          if (isPlayingRef.current) { // only if it ended naturally
              handleStop();
          }
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
    return <LoadingSpinner text="Missing track data, redirecting..." />;
  }
  if (!isReady) {
    return <LoadingSpinner text="Loading audio engine..." />;
  }
   if (!originalAudioBuffer || !masteredAudioBuffer) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-slate-800 rounded-xl shadow-2xl text-center">
        <p className="text-xl text-yellow-400">Audio data for preview is not available.</p>
        <Button onClick={() => setCurrentPage(AppPage.UPLOAD)} className="mt-4">Go to Upload</Button>
      </div>
    );
  }
  
  const trackName = uploadedTrack.name;
  
  const WaveformDisplay: React.FC<{ versionText: 'Original' | 'Mastered', isActive: boolean, buffer: AudioBuffer | null }> = ({ versionText, isActive, buffer }) => (
    <div className={`p-4 border rounded-lg transition-all duration-300 card-accent ${isActive ? 'border-primary/80 bg-slate-800/80 backdrop-blur-md shadow-lg shadow-primary/20' : 'border-slate-700/50 bg-slate-800/50 backdrop-blur-md'}`}>
        <h4 className="text-lg font-semibold mb-2 text-primary">{versionText} Version</h4>
        <div className={`h-24 bg-slate-900/50 rounded flex items-center justify-center transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
            <WaveformCanvas buffer={buffer} />
        </div>
        <div className="mt-2 text-xs text-slate-400 min-h-[40px]">
         {versionText === 'Mastered' ? (
          <>
            <p>Loudness: {typeof masteringSettings.loudnessTarget === 'string' ? masteringSettings.loudnessTarget : `${masteringSettings.customLoudnessValue} LUFS`}</p>
            <p>Tone: {masteringSettings.tonePreference}</p>
          </>
        ) : (<p>Unprocessed Audio</p>)}
        </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-2xl card-accent">
      <h2 className="text-3xl sm:text-4xl font-heading font-semibold mb-2 text-gradient-primary">Preview Your Master</h2>
      <p className="text-slate-300 mb-8">A/B test the Afromastered version of <span className="font-semibold text-primary-focus transition-colors">{trackName}</span>.</p>

      <div className="mb-8 flex flex-col items-center justify-center gap-6">
        <button onClick={playPause} className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white hover:bg-slate-700 hover:border-primary transition-all">
          {isActuallyPlaying ? <IconPause className="w-8 h-8"/> : <IconPlay className="w-8 h-8"/>}
        </button>
        <ToggleSwitch isEnabled={isMastered} onToggle={handleToggle} disabledLabel="Original" enabledLabel="Mastered" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <WaveformDisplay versionText="Original" isActive={!isMastered} buffer={originalAudioBuffer}/>
        <WaveformDisplay versionText="Mastered" isActive={isMastered} buffer={masteredAudioBuffer}/>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Button 
          onClick={() => { if(isActuallyPlaying) playPause(); setCurrentPage(AppPage.SETTINGS); }}
          variant="secondary" 
          size="lg"
          leftIcon={<IconCog className="w-5 h-5"/>}
        >
          Adjust Settings
        </Button>
        <Button 
          onClick={() => { if(isActuallyPlaying) playPause(); setCurrentPage(AppPage.DOWNLOAD); }} 
          size="lg"
          rightIcon={<IconCheckCircle className="w-5 h-5"/>}
        >
          Finalize & Download
        </Button>
      </div>
    </div>
  );
};

export default PreviewAndComparePage;
