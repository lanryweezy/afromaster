import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import Button from '../components/Button';
import { IconPlay, IconPause, IconCog, IconCheckCircle } from '../constants';
import LoadingSpinner from '../components/LoadingSpinner';
import ToggleSwitch from '../components/ToggleSwitch';

const PreviewAndComparePage: React.FC = () => {
  const { 
    setCurrentPage, 
    uploadedTrack, 
    masteredTrackInfo, 
    masteringSettings, 
    originalAudioBuffer, 
    masteredAudioBuffer,
    audioBuffersAvailable,
    setOriginalAudioBuffer
  } = useAppContext();

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const startTimeRef = useRef(0);
  const startedAtRef = useRef(0);
  
  const [isReady, setIsReady] = useState(false);
  const [isActuallyPlaying, setActuallyPlaying] = useState(false); // UI state
  const [isMastered, setIsMastered] = useState(true);
  const [isRecoveringAudio, setIsRecoveringAudio] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  // Audio recovery mechanism
  const attemptAudioRecovery = async () => {
    if (!uploadedTrack || isRecoveringAudio) return;
    
    setIsRecoveringAudio(true);
    setRecoveryError(null);
    
    try {
      // Try to recover original audio buffer from uploaded file
      if (!originalAudioBuffer && uploadedTrack.file) {
        const audioContext = new AudioContext();
        const reader = new FileReader();
        
        const recoverOriginal = new Promise<AudioBuffer>((resolve, reject) => {
          reader.onload = async (e) => {
            if (e.target?.result instanceof ArrayBuffer) {
              try {
                const buffer = await audioContext.decodeAudioData(e.target.result);
                resolve(buffer);
              } catch (error) {
                reject(error);
              }
            } else {
              reject(new Error('Failed to read file'));
            }
          };
          reader.onerror = () => reject(new Error('FileReader error'));
          reader.readAsArrayBuffer(uploadedTrack.file);
        });
        
        const recoveredBuffer = await recoverOriginal;
        setOriginalAudioBuffer(recoveredBuffer);
        
        if (audioContext.state !== 'closed') {
          audioContext.close();
        }
      }
      
      // If we still don't have the mastered buffer, we need to re-process
      if (!masteredAudioBuffer && originalAudioBuffer) {
        setRecoveryError("Mastered audio is missing. Please re-process your track.");
        setTimeout(() => {
          setCurrentPage(AppPage.SETTINGS);
        }, 3000);
        return;
      }
      
    } catch (error) {
      console.error('Audio recovery failed:', error);
      setRecoveryError('Failed to recover audio data. Please re-upload your track.');
    } finally {
      setIsRecoveringAudio(false);
    }
  };

  // Attempt recovery if audio buffers are missing but we have track data
  useEffect(() => {
    if (uploadedTrack && masteredTrackInfo && masteringSettings && !audioBuffersAvailable) {
      attemptAudioRecovery();
    }
  }, [uploadedTrack, masteredTrackInfo, masteringSettings, audioBuffersAvailable]);

  useEffect(() => {
      const initAudio = async () => {
          if (originalAudioBuffer && masteredAudioBuffer && !audioCtxRef.current) {
              const AudioContext = window.AudioContext || window.webkitAudioContext;
              const ctx = new AudioContext();
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

  useEffect(() => {
    if (isPlayingRef.current && audioCtxRef.current) {
      const newStartTime = startTimeRef.current + (audioCtxRef.current.currentTime - startedAtRef.current);
      startTimeRef.current = newStartTime;
      playCurrentVersion(newStartTime);
    }
  }, [isMastered]);

  const handleToggle = () => {
    setIsMastered(!isMastered);
  };

  // Show recovery UI if we're trying to recover audio
  if (isRecoveringAudio) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-2xl text-center">
        <LoadingSpinner text="Recovering audio data..." />
        <p className="text-slate-300 mt-4">Attempting to restore your audio files...</p>
      </div>
    );
  }

  // Show recovery error
  if (recoveryError) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-slate-900/60 backdrop-blur-lg border border-red-500/50 rounded-xl shadow-2xl text-center">
        <div className="text-red-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-red-400 mb-2">Audio Recovery Failed</h3>
        <p className="text-slate-300 mb-6">{recoveryError}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => setCurrentPage(AppPage.UPLOAD)} variant="secondary">
            Re-upload Track
          </Button>
          <Button onClick={() => setCurrentPage(AppPage.SETTINGS)}>
            Try Re-processing
          </Button>
        </div>
      </div>
    );
  }

  if (!uploadedTrack || !masteredTrackInfo || !masteringSettings) {
    setCurrentPage(AppPage.UPLOAD);
    return <LoadingSpinner text="Missing track data, redirecting..." />;
  }
  
  if (!audioBuffersAvailable) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-slate-900/60 backdrop-blur-lg border border-yellow-500/50 rounded-xl shadow-2xl text-center">
        <div className="text-yellow-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-yellow-400 mb-2">Audio Data Missing</h3>
        <p className="text-slate-300 mb-6">The processed audio is not available for preview. This might happen if you refreshed the page or navigated away during processing.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => setCurrentPage(AppPage.SETTINGS)}>
            Re-process Track
          </Button>
          <Button onClick={() => setCurrentPage(AppPage.UPLOAD)} variant="secondary">
            Start Over
          </Button>
        </div>
      </div>
    );
  }
  
  if (!isReady) {
    return <LoadingSpinner text="Loading audio engine..." />;
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

      <div className="mb-8">
        {audioCtxRef.current && sourceNodeRef.current && (
          <SpectrumAnalyzer audioContext={audioCtxRef.current} audioNode={sourceNodeRef.current} />
        )}
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