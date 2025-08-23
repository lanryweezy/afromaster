import React from 'react';
import { MasteredTrackInfo } from '../types';
import Button from './Button';
import { IconMusicNote, IconDownload, IconCog, IconPlay, IconPause, IconCog as IconCalendar, IconMusicNote as IconWaveform } from '../constants';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';


interface TrackCardProps {
  track: MasteredTrackInfo;
}

const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
  const { setCurrentPage, setMasteredTrackInfo, setUploadedTrack, setMasteringSettings } = useAppContext();
  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const sourceRef = React.useRef<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePlay = async () => {
    if (isPlaying) {
      // Stop playback
      try { 
        sourceRef.current?.stop(); 
        sourceRef.current?.disconnect(); 
        setIsPlaying(false);
      } catch {}
      return;
    }

    setIsLoading(true);
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      
      // Stop previous playback if any
      try { sourceRef.current?.stop(); sourceRef.current?.disconnect(); } catch {}
      
      const response = await fetch(track.masteredFileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      source.onended = () => setIsPlaying(false);
      source.start();
      sourceRef.current = source;
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      try { sourceRef.current?.stop(); sourceRef.current?.disconnect(); } catch {}
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  const handleDownload = () => {
    // In a real app, this would trigger a download
    const link = document.createElement('a');
    link.href = track.masteredFileUrl;
    link.download = `${track.name}_mastered.wav`;
    link.click();
  };

  const handleRevisit = () => {
    setUploadedTrack({ file: track.file, name: track.name, duration: track.duration, waveformUrl: track.waveformUrl });
    setMasteringSettings(track.settings);
    setMasteredTrackInfo(track);
    setCurrentPage(AppPage.PREVIEW); // Or settings if they want to re-adjust from there
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between group overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      {/* Status indicator */}
      <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50 animate-pulse"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <IconMusicNote className="w-7 h-7 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-white truncate font-heading group-hover:text-orange-400 transition-colors duration-300" title={track.name}>
                {track.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <IconCalendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">{formatDate(track.masteredDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Track details */}
        <div className="bg-slate-800/30 rounded-xl p-4 mb-6 border border-slate-700/30">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400 block text-xs uppercase tracking-wide font-medium mb-1">Genre</span>
              <span className="text-white font-medium">{track.settings.genre}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs uppercase tracking-wide font-medium mb-1">Loudness</span>
              <span className="text-white font-medium">
                {typeof track.settings.loudnessTarget === 'string' 
                  ? track.settings.loudnessTarget 
                  : `${track.settings.customLoudnessValue} LUFS`
                }
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block text-xs uppercase tracking-wide font-medium mb-1">Tone Preference</span>
              <span className="text-white font-medium">{track.settings.tonePreference}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={handlePlay} 
            variant="primary" 
            size="sm" 
            leftIcon={isLoading ? 
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> :
              (isPlaying ? <IconPause className="w-4 h-4"/> : <IconPlay className="w-4 h-4"/>)
            }
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            {isLoading ? 'Loading...' : (isPlaying ? 'Pause' : 'Play')}
          </Button>
          
          <Button 
            onClick={handleDownload} 
            variant="secondary" 
            size="sm" 
            leftIcon={<IconDownload className="w-4 h-4"/>}
            className="flex-1 sm:flex-none"
          >
            Download
          </Button>
          
          <Button 
            onClick={handleRevisit} 
            variant="ghost" 
            size="sm" 
            leftIcon={<IconWaveform className="w-4 h-4"/>}
            className="flex-1 sm:flex-none"
          >
            Revisit
          </Button>
        </div>
      </div>

      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500/50 to-red-500/50 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

export default TrackCard;