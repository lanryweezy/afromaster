import React, { useState, useEffect, useRef } from 'react';
import { MasteringSettings } from '../types';
import { Genre, LoudnessTarget, StereoWidth, TonePreference, BACKGROUND_MUSIC_URL, IconPlay, IconPause } from '../constants';
import LoadingSpinner from './LoadingSpinner';
import WaveformCanvas from './WaveformCanvas';
import ToggleSwitch from './ToggleSwitch';

const DemoAudioPlayer: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const audioCtxRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const originalBufferRef = useRef<AudioBuffer | null>(null);
    const isMountedRef = useRef(true);
    
    useEffect(() => {
        isMountedRef.current = true;
        
        const dataUriToArrayBuffer = (dataUri: string): ArrayBuffer => {
            const byteString = atob(dataUri.split(',')[1]);
            const len = byteString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = byteString.charCodeAt(i);
            }
            return bytes.buffer;
        };

        const setupAudio = async () => {
            try {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                const arrayBuffer = dataUriToArrayBuffer(BACKGROUND_MUSIC_URL);
                const decodedBuffer = await audioCtxRef.current.decodeAudioData(arrayBuffer);
                if (!isMountedRef.current) return;
                originalBufferRef.current = decodedBuffer;

            } catch (err) {
                console.error("Failed to set up demo audio:", err);
                if(isMountedRef.current) setError("Could not load demo audio. It might be a network issue or an unsupported format.");
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
        }
    }, []);

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
            playBuffer(originalBufferRef.current);
        }
    };
    
    if (isLoading) {
        return <div className="bg-slate-800/50 p-8 rounded-2xl flex justify-center items-center"><LoadingSpinner text="Loading Audio Demo..." /></div>;
    }

    if (error) {
         return <div className="bg-slate-800/50 p-8 rounded-2xl text-center text-red-400">{error}</div>;
    }

    return (
        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/20 card-accent">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                <div>
                    <p className="font-bold text-white">"Future Funk" - Demo Track</p>
                    <p className="text-sm text-white">Electronic Pop</p>
                </div>
            </div>
            <div className="h-24 bg-slate-900/50 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                <WaveformCanvas buffer={originalBufferRef.current} />
            </div>
             <div className="flex items-center space-x-4">
                <button onClick={handlePlayPause} className="text-white hover:text-primary-focus transition-colors">
                    {isPlaying ? <IconPause className="w-10 h-10"/> : <IconPlay className="w-10 h-10"/>}
                </button>
            </div>
        </div>
    );
};

export default DemoAudioPlayer;