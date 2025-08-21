import React, { useState, useEffect, useRef } from 'react';
import { IconPlay, IconPause } from '../constants';
import LoadingSpinner from './LoadingSpinner';
import WaveformCanvas from './WaveformCanvas';
import ToggleSwitch from './ToggleSwitch';

interface RealDemoAudioPlayerProps {
  unmasteredUrl: string;
  masteredUrl: string;
  trackName: string;
  genre: string;
}

const RealDemoAudioPlayer: React.FC<RealDemoAudioPlayerProps> = ({ unmasteredUrl, masteredUrl, trackName, genre }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMastered, setIsMastered] = useState(false); // true for mastered, false for original
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const originalBufferRef = useRef<AudioBuffer | null>(null);
  const masteredBufferRef = useRef<AudioBuffer | null>(null);
  const isMountedRef = useRef(true); // To prevent state updates on unmounted component

  useEffect(() => {
    isMountedRef.current = true;

    const setupAudio = async () => {
      try {
        audioCtxRef.current = new (window.AudioContext || (window as typeof window.webkitAudioContext)).webkitAudioContext();

        // Fetch and decode unmastered track
        const originalResponse = await fetch(unmasteredUrl);
        const originalArrayBuffer = await originalResponse.arrayBuffer();
        const decodedOriginal = await audioCtxRef.current.decodeAudioData(originalArrayBuffer);
        if (!isMountedRef.current) return;
        originalBufferRef.current = decodedOriginal;

        // Fetch and decode mastered track
        const masteredResponse = await fetch(masteredUrl);
        const masteredArrayBuffer = await masteredResponse.arrayBuffer();
        const decodedMastered = await audioCtxRef.current.decodeAudioData(masteredArrayBuffer);
        if (!isMountedRef.current) return;
        masteredBufferRef.current = decodedMastered;

      } catch (err) {
        console.error("Failed to set up demo audio:", err);
        if(isMountedRef.current) setError("Could not load demo audio. Please check the audio URLs or network connection.");
      } finally {
        if(isMountedRef.current) setIsLoading(false);
      }
    };

    setupAudio();

    return () => {
      isMountedRef.current = false;
      sourceNodeRef.current?.stop();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(console.error);
      }
    };
  }, [unmasteredUrl, masteredUrl]); // Re-run if URLs change

  const playBuffer = (buffer: AudioBuffer | null) => {
    const audioCtx = audioCtxRef.current;
    if (!buffer || !audioCtx) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (sourceNodeRef.current) {
      sourceNodeRef.current.onended = null;
      sourceNodeRef.current.stop();
    }

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start(0);

    sourceNodeRef.current = source;
    setIsPlaying(true);
    
    source.onended = () => {
      if (isMountedRef.current) {
        setIsPlaying(false);
        sourceNodeRef.current = null;
      }
    };
  };
  
  const handlePlayPause = () => {
    if (isPlaying) {
      sourceNodeRef.current?.stop();
    } else {
      const bufferToPlay = isMastered ? masteredBufferRef.current : originalBufferRef.current;
      playBuffer(bufferToPlay);
    }
  };
  
  const handleToggle = () => {
    const newIsMastered = !isMastered;
    setIsMastered(newIsMastered);
    if (isPlaying) {
      const bufferToPlay = newIsMastered ? masteredBufferRef.current : originalBufferRef.current;
      playBuffer(bufferToPlay);
    }
  };

  if (isLoading) {
    return <div className="bg-slate-800/50 p-8 rounded-2xl flex justify-center items-center"><LoadingSpinner text="Loading Demo Tracks..." /></div>;
  }

  if (error) {
    return <div className="bg-slate-800/50 p-8 rounded-2xl text-center text-red-400">{error}</div>;
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/20 card-accent">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
        <div>
          <p className="font-bold text-white">{trackName}</p>
          <p className="text-sm text-white">{genre}</p>
        </div>
        <ToggleSwitch isEnabled={isMastered} onToggle={handleToggle} disabledLabel="Original" enabledLabel="Mastered" />
      </div>
      <div className="h-24 bg-slate-900/50 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
        <WaveformCanvas buffer={isMastered ? masteredBufferRef.current : originalBufferRef.current} />
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={handlePlayPause} className="text-white hover:text-primary-focus transition-colors">
          {isPlaying ? <IconPause className="w-10 h-10"/> : <IconPlay className="w-10 h-10"/>}
        </button>
      </div>
    </div>
  );
};

export default RealDemoAudioPlayer;
