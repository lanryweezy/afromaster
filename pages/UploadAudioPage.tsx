import React, { useState, useRef, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import Button from '../components/Button';
import { useAppContext } from '../contexts/AppContext';
import { AppPage, UploadedTrack } from '../types';
import { 
  IconArrowRight, 
  IconUpload, 
  IconMusicNote, 
  IconSparkles,
  IconPlay,
  IconGlobe,
  IconTrendingUp,
  IconAward,
  IconBolt
} from '../constants';
import useAudioFileProcessor from '../hooks/useAudioFileProcessor';

// Floating Music Particles Component
const MusicParticles: React.FC = () => {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createParticle = () => {
      if (!particlesRef.current) return;

      const particle = document.createElement('div');
      particle.className = 'absolute w-2 h-2 bg-gradient-hero rounded-full opacity-60 animate-float';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 2 + 's';
      particle.style.animationDuration = (Math.random() * 3 + 2) + 's';

      particlesRef.current.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 5000);
    };

    const interval = setInterval(createParticle, 300);
    return () => clearInterval(interval);
  }, []);

  return <div ref={particlesRef} className="absolute inset-0 pointer-events-none overflow-hidden" />;
};

// Genre Showcase Component
const GenreShowcase: React.FC = () => {
  const genres = [
    { name: 'Afrobeats', flag: '🇳🇬', color: 'from-green-500 to-green-600' },
    { name: 'Amapiano', flag: '🇿🇦', color: 'from-yellow-500 to-orange-500' },
    { name: 'Trap', flag: '🇺🇸', color: 'from-purple-500 to-pink-500' },
    { name: 'Hip Hop', flag: '🌍', color: 'from-blue-500 to-cyan-500' },
    { name: 'Drill', flag: '🇬🇧', color: 'from-red-500 to-rose-500' },
    { name: 'Reggaeton', flag: '🇵🇷', color: 'from-emerald-500 to-teal-500' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      {genres.map((genre, index) => (
        <div 
          key={genre.name} 
          className="card-studio p-4 text-center group cursor-pointer hover-glow animate-on-scroll"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="text-2xl mb-2">{genre.flag}</div>
          <div className="text-sm font-semibold text-white">{genre.name}</div>
          <div className={`w-full h-1 bg-gradient-to-r ${genre.color} rounded-full mt-2 opacity-80 group-hover:opacity-100 transition-opacity`}></div>
        </div>
      ))}
    </div>
  );
};

// File Format Support Component
const FileFormatSupport: React.FC = () => {
  const formats = ['WAV', 'MP3', 'FLAC', 'AIFF', 'M4A', 'OGG'];

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-6">
      <span className="text-gray-400 text-sm">Supported formats:</span>
      {formats.map((format) => (
        <span 
          key={format} 
          className="px-3 py-1 bg-glass-bg border border-glass-border rounded-full text-xs font-mono text-console-glow"
        >
          {format}
        </span>
      ))}
    </div>
  );
};

// Global Stats Component
const GlobalStats: React.FC = () => {
  const stats = [
    { value: '195+', label: 'Countries Served', icon: <IconGlobe /> },
    { value: '50+', label: 'Languages', icon: <IconTrendingUp /> },
    { value: '1M+', label: 'Artists Worldwide', icon: <IconAward /> },
    { value: '24/7', label: 'Global Support', icon: <IconBolt /> }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-2xl mb-1 text-primary">{stat.icon}</div>
          <div className="text-lg font-bold gradient-text-spectrum">{stat.value}</div>
          <div className="text-xs text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

const UploadAudioPage: React.FC = () => {
  const { setCurrentPage, uploadedTrack, setUploadedTrack, setOriginalAudioBuffer, isLoading } = useAppContext();
  const { processFile, reset } = useAudioFileProcessor();
  const [dragActive, setDragActive] = useState(false);

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
    <div className="min-h-screen bg-studio-dark relative overflow-hidden">
      {/* Animated Background */}
      <MusicParticles />
      <div className="absolute inset-0 bg-gradient-glow opacity-10 animate-pulse-glow"></div>
      
      <div className="container max-w-6xl mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-6 gradient-text-hero animate-fade-in-up">
            Upload Your Next Global Hit
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-4xl mx-auto leading-relaxed animate-fade-in-up">
            Professional AI mastering for <span className="gradient-text-spectrum font-semibold">artists worldwide</span>.
            Specially trained on <span className="text-primary font-semibold">Afrobeats, Amapiano & Trap</span> but perfected for every genre.
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-gray-400 mb-8 animate-fade-in-up">
            <IconGlobe className="w-5 h-5 text-primary" />
            <span>Trusted by artists in 195+ countries</span>
          </div>
        </div>

        {/* Global Stats */}
        <GlobalStats />

        {/* Genre Showcase */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            Specialized Training • Universal Excellence
          </h2>
          <GenreShowcase />
        </div>

        {/* Upload Section */}
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 text-center relative overflow-hidden group">
            {/* Upload Area Background Effect */}
            <div className="absolute inset-0 bg-gradient-spectrum opacity-5 group-hover:opacity-10 transition-opacity"></div>
            
            <div className="relative z-10">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-hero rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
                  <IconUpload className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Drop Your Track Here
                </h3>
                <p className="text-gray-300 mb-4">
                  Upload your mix and let our AI work its magic
                </p>
              </div>

              <FileUpload
                onFileAccepted={handleFileAccepted}
                onFileCleared={handleFileCleared}
                existingFile={uploadedTrack ? { 
                  name: uploadedTrack.name, 
                  size: uploadedTrack.file.size, 
                  duration: uploadedTrack.duration 
                } : null}
                id="main-track-upload"
              />

              <FileFormatSupport />

              {uploadedTrack && !isLoading && (
                <div className="mt-8 animate-scale-in">
                  <div className="card-studio p-6 mb-6">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center">
                        <IconMusicNote className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-white">{uploadedTrack.name}</div>
                        <div className="text-sm text-gray-400">
                          Duration: {Math.floor(uploadedTrack.duration / 60)}:{Math.floor(uploadedTrack.duration % 60).toString().padStart(2, '0')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-primary">✓</div>
                        <div className="text-xs text-gray-400">File Analyzed</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-secondary">✓</div>
                        <div className="text-xs text-gray-400">Quality Verified</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-accent">✓</div>
                        <div className="text-xs text-gray-400">Ready to Master</div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleNext} 
                    className="btn btn-primary btn-lg group w-full"
                  >
                    <IconSparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Start AI Mastering
                    <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 gradient-text-hero">
            What Makes Our AI Special?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card-spectrum text-center p-6">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-spectrum-1 to-spectrum-2 rounded-full flex items-center justify-center mb-4">
                <IconBolt className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">Genre Intelligence</h3>
              <p className="text-gray-300 text-sm">
                Trained on millions of Afrobeats, Amapiano & Trap tracks to understand cultural nuances
              </p>
            </div>

            <div className="card text-center p-6">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-spectrum-3 to-spectrum-4 rounded-full flex items-center justify-center mb-4">
                <IconGlobe className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">Global Standards</h3>
              <p className="text-gray-300 text-sm">
                Meets international streaming platform requirements while preserving your unique sound
              </p>
            </div>

            <div className="card text-center p-6">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-spectrum-5 to-spectrum-1 rounded-full flex items-center justify-center mb-4">
                <IconTrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white mb-2">Chart-Ready</h3>
              <p className="text-gray-300 text-sm">
                Optimized for radio play, streaming success, and global chart performance
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">Trusted by artists from:</p>
          <div className="flex justify-center items-center space-x-8 text-2xl">
            <span title="Nigeria">🇳🇬</span>
            <span title="South Africa">🇿🇦</span>
            <span title="Ghana">🇬🇭</span>
            <span title="Kenya">🇰🇪</span>
            <span title="United States">🇺🇸</span>
            <span title="United Kingdom">🇬🇧</span>
            <span title="Canada">🇨🇦</span>
            <span title="Brazil">🇧🇷</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadAudioPage;