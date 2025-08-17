import React, { useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { BACKGROUND_MUSIC_URL, IconVolumeUp, IconVolumeOff } from '../constants';

const BackgroundMusicPlayer: React.FC = () => {
  const { isMusicPlaying, setIsMusicPlaying } = useAppContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and clean up the Audio object
  useEffect(() => {
    // Create the audio object only on the client side
    if (typeof window !== 'undefined' && !audioRef.current) {
        const audio = new Audio(BACKGROUND_MUSIC_URL);
        audio.loop = true;
        audio.volume = 0.3;
        audioRef.current = audio;
    }
    
    // Cleanup function to run when the component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []); // Empty array ensures this runs only on mount and unmount

  // Effect to control play/pause based on global state
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isMusicPlaying) {
        // play() returns a promise which can be rejected if autoplay is disallowed
        audio.play().catch(error => {
          console.error("Audio play failed:", error);
          // If play fails (e.g., autoplay blocked), reset the state to reflect that
          setIsMusicPlaying(false);
        });
      } else {
        audio.pause();
      }
    }
  }, [isMusicPlaying, setIsMusicPlaying]);

  const togglePlay = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  return (
    <div className="flex items-center space-x-2">
      {/* The audio element is now managed programmatically and not rendered in JSX */}
      <button
        onClick={togglePlay}
        className="text-slate-500 hover:text-sky-400 transition-colors p-2 rounded-full hover:bg-slate-800"
        aria-label={isMusicPlaying ? "Pause background music" : "Play background music"}
      >
        {isMusicPlaying ? <IconVolumeUp className="w-5 h-5" /> : <IconVolumeOff className="w-5 h-5" />}
      </button>
      <span className="text-xs text-slate-600 hidden sm:inline">Ambient Music</span>
    </div>
  );
};

export default BackgroundMusicPlayer;
