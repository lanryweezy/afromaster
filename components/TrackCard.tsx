import React from 'react';
import { MasteredTrackInfo } from '../types';
import Button from './Button';
import { IconMusicNote, IconDownload, IconCog, IconPlay } from '../constants';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';


interface TrackCardProps {
  track: MasteredTrackInfo;
}

const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
  const { setCurrentPage, setMasteredTrackInfo, setUploadedTrack, setMasteringSettings } = useAppContext();
  const audioContext = new AudioContext();

  const handlePlay = async () => {
    const response = await fetch(track.masteredFileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  };

  const handleDownload = () => {
    // In a real app, this would trigger a download
    alert(`Simulating download of ${track.name}`);
  };

  const handleRevisit = () => {
    setUploadedTrack({ file: track.file, name: track.name, duration: track.duration, waveformUrl: track.waveformUrl });
    setMasteringSettings(track.settings);
    setMasteredTrackInfo(track);
    setCurrentPage(AppPage.PREVIEW); // Or settings if they want to re-adjust from there
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/50 p-5 rounded-xl shadow-lg hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group card-accent">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                <IconMusicNote className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-primary truncate font-heading" title={track.name}>{track.name}</h3>
          </div>
        </div>
        <div className="space-y-1.5 text-sm text-white mb-4 border-l-2 border-slate-700 pl-3">
          <p><strong>Genre:</strong> {track.settings.genre}</p>
          <p><strong>Loudness:</strong> {typeof track.settings.loudnessTarget === 'string' ? track.settings.loudnessTarget : `${track.settings.customLoudnessValue} LUFS`}</p>
          <p><strong>Tone:</strong> {track.settings.tonePreference}</p>
          <p><strong>Mastered:</strong> {new Date(track.masteredDate).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="mt-auto flex space-x-2">
        <Button onClick={handlePlay} variant="primary" size="sm" leftIcon={<IconPlay className="w-4 h-4"/>}>
          Play
        </Button>
        <Button onClick={handleDownload} variant="secondary" size="sm" leftIcon={<IconDownload className="w-4 h-4"/>}>
          Download
        </Button>
        <Button onClick={handleRevisit} variant="ghost" size="sm" leftIcon={<IconCog className="w-4 h-4"/>}>
          Revisit
        </Button>
      </div>
    </div>
  );
};

export default TrackCard;
