import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import Button from '../components/Button';
import { useAppContext } from '../contexts/AppContext';
import { AppPage, UploadedTrack, StemType } from '../types';
import { IconArrowRight, IconMusicNote, IconSparkles, IconXCircle, IconCheckCircle, IconCog } from '../constants';
import LoadingSpinner from '../components/LoadingSpinner';
import { analyzeAudioBuffer } from '../services/audioProcessingService';
import { useTranslation } from 'react-i18next';

const UploadAudioPage: React.FC = () => {
  const { setCurrentPage, projectTracks, setProjectTracks, leadTrackId, setLeadTrackId } = useAppContext();
  const [isDecoding, setIsDecoding] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isStemMode, setIsStemMode] = useState(false);
  const { t } = useTranslation();

  const handleFileAccepted = async (file: File) => {
    setIsDecoding(true);
    setUploadError(null);

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = await audioContext.decodeAudioData(arrayBuffer);
      const analysis = analyzeAudioBuffer(buffer);

      if (isStemMode && projectTracks.length > 0) {
          // Add to the existing project as a stem
          const updatedTracks = [...projectTracks];
          const mainTrack = updatedTracks[0];
          if (!mainTrack.stems) mainTrack.stems = [];
          
          const stemType: StemType = file.name.toLowerCase().includes('vocal') ? 'vocals' :
                                   file.name.toLowerCase().includes('drum') ? 'drums' :
                                   file.name.toLowerCase().includes('bass') ? 'bass' : 'instruments';

          mainTrack.stems.push({
            id: `stem_${Date.now()}`,
            file: file,
            name: file.name,
            type: stemType,
            audioBuffer: buffer,
            gain: 1.0,
            analysis: analysis
          });
          
          mainTrack.isStemMode = true;
          mainTrack.name = `Stem Project: ${projectTracks[0].stems?.[0]?.name || 'Untitled'}`;
          setProjectTracks(updatedTracks);
      } else {
          const newTrack: UploadedTrack = {
            id: `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            file: file,
            name: file.name,
            duration: buffer.duration,
            audioBuffer: buffer,
            analysis: analysis,
            stems: isStemMode ? [{
                id: `stem_${Date.now()}`,
                file: file,
                name: file.name,
                type: 'other',
                audioBuffer: buffer,
                gain: 1.0,
                analysis: analysis
            }] : [],
            isStemMode: isStemMode
          };

          setProjectTracks([...projectTracks, newTrack]);
          if (projectTracks.length === 0) setLeadTrackId(newTrack.id);
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      setUploadError(`Failed to process ${file.name}.`);
    } finally {
      setIsDecoding(false);
      audioContext.close();
    }
  };

  const removeTrack = (id: string) => {
    const updatedTracks = projectTracks.filter(t => t.id !== id);
    setProjectTracks(updatedTracks);
    if (leadTrackId === id) setLeadTrackId(updatedTracks.length > 0 ? updatedTracks[0].id : null);
  };

  const removeStem = (trackId: string, stemId: string) => {
    const updatedTracks = projectTracks.map(t => {
        if (t.id === trackId) {
            return { ...t, stems: t.stems?.filter(s => s.id !== stemId) };
        }
        return t;
    });
    setProjectTracks(updatedTracks);
  };

  const updateStemType = (trackId: string, stemId: string, type: StemType) => {
    const updatedTracks = projectTracks.map(t => {
        if (t.id === trackId) {
            return { ...t, stems: t.stems?.map(s => s.id === stemId ? { ...s, type } : s) };
        }
        return t;
    });
    setProjectTracks(updatedTracks);
  };

  const handleNext = () => {
    if (projectTracks.length > 0) setCurrentPage(AppPage.SETTINGS);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white mb-4">{t('project_studio')}</h2>
        
        <div className="inline-flex bg-slate-800 p-1 rounded-xl mb-6 shadow-inner border border-slate-700">
             <button onClick={() => { setIsStemMode(false); setProjectTracks([]); }} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${!isStemMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>ALBUM/EP MODE</button>
             <button onClick={() => { setIsStemMode(true); setProjectTracks([]); }} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${isStemMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>{t('stems').toUpperCase()} MODE</button>
        </div>
        
        <p className="text-slate-400 text-sm">
            {isStemMode ? "Upload individual elements (Vocals, Drums, etc.) for a precision AI balance." : "Upload multiple full mixes for project-wide consistency."}
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 p-6 rounded-2xl shadow-xl card-accent">
                <FileUpload 
                    onFileAccepted={handleFileAccepted}
                    multiple={true}
                    label={isStemMode ? "Add Stems (Vocals, Drums, etc.)" : "Add Project Tracks"}
                    id="lab-upload"
                />
                {isDecoding && <div className="mt-4"><LoadingSpinner text="Analyzing components..." /></div>}
                {uploadError && <p className="text-red-400 text-xs mt-3 bg-red-400/10 p-2 rounded-lg text-center">{uploadError}</p>}
            </div>

            <div className="bg-indigo-900/20 border border-indigo-500/30 p-5 rounded-2xl">
                <div className="flex items-center mb-3">
                    {isStemMode ? <IconCog className="w-5 h-5 text-indigo-400 mr-2" /> : <IconSparkles className="w-5 h-5 text-indigo-400 mr-2" />}
                    <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-widest">{isStemMode ? "Stem Balancing" : "Consistency Engine"}</h4>
                </div>
                <p className="text-xs text-indigo-100/70 leading-relaxed">
                    {isStemMode 
                        ? "Our AI will analyze the spectral weight of each stem and suggest a balanced mixdown before applying the final master." 
                        : "Designate a Lead Track to serve as the sonic fingerprint for the rest of your project."}
                </p>
            </div>
        </div>

        <div className="lg:col-span-7">
            <div className="bg-slate-900/40 border border-slate-700/30 rounded-2xl overflow-hidden shadow-xl min-h-[350px]">
                <div className="bg-slate-800/50 p-4 border-b border-slate-700/50 flex justify-between items-center">
                    <h3 className="font-bold text-white flex items-center">
                        <IconMusicNote className="w-4 h-4 mr-2 text-primary"/>
                        {isStemMode ? "Stem Components" : "Project Tracks"} ({isStemMode ? projectTracks[0]?.stems?.length || 0 : projectTracks.length})
                    </h3>
                </div>
                
                {projectTracks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                        <IconMusicNote className="w-12 h-12 mb-4 opacity-10" />
                        <p className="text-sm">Ready for your files...</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-800">
                        {!isStemMode ? (
                            projectTracks.map((track) => (
                                <div key={track.id} className={`p-4 flex items-center gap-4 transition-colors ${leadTrackId === track.id ? 'bg-indigo-500/5' : 'hover:bg-slate-800/30'}`}>
                                    <div onClick={() => setLeadTrackId(track.id)} className={`cursor-pointer p-2 rounded-full transition-all ${leadTrackId === track.id ? 'bg-primary text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`} title="Set as Lead Track"><IconSparkles className="w-5 h-5" /></div>
                                    <div className="flex-grow min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{track.name}</p>
                                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-mono">
                                            <span>{Math.floor(track.duration! / 60)}:{(track.duration! % 60).toFixed(0).padStart(2, '0')}</span>
                                            <span>•</span>
                                            <span className="text-indigo-400">{track.analysis?.loudness} LUFS</span>
                                        </div>
                                    </div>
                                    <button onClick={() => removeTrack(track.id)} className="p-2 text-slate-600 hover:text-red-400"><IconXCircle className="w-5 h-5" /></button>
                                </div>
                            ))
                        ) : (
                            projectTracks[0].stems?.map((stem) => (
                                <div key={stem.id} className="p-4 flex items-center gap-4 hover:bg-slate-800/30 transition-colors">
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-white truncate">{stem.name}</p>
                                            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[9px] font-bold text-indigo-400 uppercase tracking-tighter">{stem.type}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            {['vocals', 'drums', 'bass', 'instruments', 'other'].map((type) => (
                                                <button key={type} onClick={() => updateStemType(projectTracks[0].id, stem.id, type as StemType)} className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded transition-all ${stem.type === type ? 'bg-indigo-500 text-white' : 'text-slate-600 hover:text-slate-400'}`}>{type}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={() => removeStem(projectTracks[0].id, stem.id)} className="p-2 text-slate-600 hover:text-red-400"><IconXCircle className="w-5 h-5" /></button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {projectTracks.length > 0 && (
                <div className="mt-8 flex justify-end">
                    <Button onClick={handleNext} size="lg" variant="primary" rightIcon={<IconArrowRight className="w-5 h-5"/>}>
                        Next: {isStemMode ? "Balance & Master" : "Define Project Sound"}
                    </Button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default UploadAudioPage;