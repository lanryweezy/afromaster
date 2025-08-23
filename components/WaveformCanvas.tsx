import React, { useRef, useEffect } from 'react';

interface WaveformCanvasProps {
  buffer: AudioBuffer | null;
  width?: number;
  height?: number;
  color?: 'fire' | 'ocean' | 'neon' | 'aurora';
  showProgress?: boolean;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
}

const WaveformCanvas: React.FC<WaveformCanvasProps> = ({ 
  buffer, 
  width = 400, 
  height = 120, 
  color = 'fire',
  showProgress = false,
  currentTime = 0,
  duration = 0,
  onSeek
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const colorSchemes = {
    fire: {
      gradient: ['rgba(255, 94, 77, 0.8)', 'rgba(255, 154, 0, 0.9)', 'rgba(255, 206, 84, 1)'],
      glow: 'rgba(255, 154, 0, 0.6)',
      progress: 'rgba(255, 235, 59, 0.9)'
    },
    ocean: {
      gradient: ['rgba(0, 150, 199, 0.8)', 'rgba(0, 188, 212, 0.9)', 'rgba(77, 208, 225, 1)'],
      glow: 'rgba(0, 188, 212, 0.6)',
      progress: 'rgba(129, 230, 217, 0.9)'
    },
    neon: {
      gradient: ['rgba(255, 20, 147, 0.8)', 'rgba(138, 43, 226, 0.9)', 'rgba(148, 0, 211, 1)'],
      glow: 'rgba(255, 20, 147, 0.6)',
      progress: 'rgba(221, 160, 221, 0.9)'
    },
    aurora: {
      gradient: ['rgba(0, 255, 127, 0.8)', 'rgba(127, 255, 212, 0.9)', 'rgba(173, 216, 230, 1)'],
      glow: 'rgba(0, 255, 127, 0.6)',
      progress: 'rgba(221, 160, 221, 0.9)'
    }
  };

  const handleCanvasClick = (event: React.MouseEvent) => {
    if (!onSeek || !duration) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const seekTime = (x / rect.width) * duration;
    onSeek(seekTime);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !buffer) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Clear with gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
    bgGradient.addColorStop(1, 'rgba(30, 41, 59, 0.95)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Get channel data (use both channels if stereo)
    const channelData = buffer.getChannelData(0);
    const channelData2 = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : null;
    
    const step = Math.ceil(channelData.length / width);
    const amp = height / 2;
    const centerY = height / 2;
    
    const scheme = colorSchemes[color];

    // Create main waveform gradient
    const waveGradient = ctx.createLinearGradient(0, 0, 0, height);
    scheme.gradient.forEach((color, index) => {
      waveGradient.addColorStop(index / (scheme.gradient.length - 1), color);
    });

    // Draw waveform path
    ctx.strokeStyle = waveGradient;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Add glow effect
    ctx.shadowColor = scheme.glow;
    ctx.shadowBlur = 8;
    
    ctx.beginPath();
    
    for (let i = 0; i < width; i++) {
      const dataIndex = Math.floor(i * step);
      const sample = channelData[dataIndex] || 0;
      const sample2 = channelData2 ? channelData2[dataIndex] || 0 : sample;
      
      // Average both channels for stereo
      const avgSample = (sample + sample2) / 2;
      const y = centerY + (avgSample * amp * 0.8);
      
      if (i === 0) {
        ctx.moveTo(i, y);
      } else {
        ctx.lineTo(i, y);
      }
    }
    
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow

    // Fill the waveform area with gradient
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    
    for (let i = 0; i < width; i++) {
      const dataIndex = Math.floor(i * step);
      const sample = channelData[dataIndex] || 0;
      const sample2 = channelData2 ? channelData2[dataIndex] || 0 : sample;
      const avgSample = (sample + sample2) / 2;
      const y = centerY + (avgSample * amp * 0.8);
      ctx.lineTo(i, y);
    }
    
    ctx.lineTo(width, centerY);
    ctx.closePath();
    ctx.fillStyle = waveGradient;
    ctx.fill();
    ctx.globalAlpha = 1; // Reset alpha

    // Draw progress indicator
    if (showProgress && duration > 0) {
      const progressX = (currentTime / duration) * width;
      
      // Progress line
      ctx.strokeStyle = scheme.progress;
      ctx.lineWidth = 3;
      ctx.shadowColor = scheme.progress;
      ctx.shadowBlur = 10;
      
      ctx.beginPath();
      ctx.moveTo(progressX, 0);
      ctx.lineTo(progressX, height);
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Progress indicator circle
      ctx.fillStyle = scheme.progress;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(progressX, centerY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Add frequency-based color variations (simulate spectrum in waveform)
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < width; i += 4) {
      const dataIndex = Math.floor(i * step);
      const sample = Math.abs(channelData[dataIndex] || 0);
      
      if (sample > 0.1) {
        const intensity = sample * 255;
        const hue = (i / width) * 360; // Color across spectrum
        ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${sample})`;
        ctx.fillRect(i, centerY - sample * amp * 0.8, 2, sample * amp * 1.6);
      }
    }
    ctx.globalAlpha = 1;

  }, [buffer, width, height, color, currentTime, duration, showProgress]);

  if (!buffer) {
    return (
      <div 
        ref={containerRef}
        className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 flex items-center justify-center overflow-hidden group"
        style={{ width, height }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-red-500/5 opacity-50"></div>
        <div className="relative z-10 text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-slate-700/50 rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <p className="text-slate-500 text-sm font-medium">Loading waveform...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 p-3 overflow-hidden shadow-xl group hover:shadow-2xl transition-all duration-300"
      style={{ width: width + 24, height: height + 24 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className={`relative z-10 w-full h-full rounded-lg ${onSeek ? 'cursor-pointer' : ''}`}
        style={{ maxWidth: '100%' }}
      />
      
      {/* Time indicators */}
      {showProgress && duration > 0 && (
        <div className="absolute bottom-1 left-3 right-3 flex justify-between text-xs text-slate-500 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      )}
      
      <div className="absolute top-2 right-3 text-xs text-slate-500 font-medium">
        Waveform
      </div>
    </div>
  );
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default WaveformCanvas;