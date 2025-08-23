import React, { useRef, useEffect, useCallback, memo } from 'react';

interface OptimizedWaveformProps {
  audioData: Float32Array;
  width?: number;
  height?: number;
  theme?: 'fire' | 'ocean' | 'neon' | 'aurora';
  animated?: boolean;
  showPeaks?: boolean;
}

const OptimizedWaveform: React.FC<OptimizedWaveformProps> = memo(({
  audioData,
  width = 800,
  height = 200,
  theme = 'fire',
  animated = true,
  showPeaks = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const themes = {
    fire: {
      gradient: ['#ff5e4d', '#ff9a00', '#ffce54', '#ffeb3b'],
      glow: 'rgba(255, 154, 0, 0.8)',
      bg: ['rgba(15, 23, 42, 0.95)', 'rgba(30, 41, 59, 0.95)']
    },
    ocean: {
      gradient: ['#0096c7', '#00bccc', '#4dd0e1', '#81e6d9'],
      glow: 'rgba(0, 188, 212, 0.8)',
      bg: ['rgba(15, 23, 42, 0.95)', 'rgba(30, 41, 59, 0.95)']
    },
    neon: {
      gradient: ['#ff1493', '#8a2be2', '#4b0082', '#9400d3'],
      glow: 'rgba(255, 20, 147, 0.8)',
      bg: ['rgba(15, 23, 42, 0.95)', 'rgba(30, 41, 59, 0.95)']
    },
    aurora: {
      gradient: ['#00ff7f', '#7fffd4', '#add8e6', '#dda0dd'],
      glow: 'rgba(0, 255, 127, 0.8)',
      bg: ['rgba(15, 23, 42, 0.95)', 'rgba(30, 41, 59, 0.95)']
    }
  };

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !audioData.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions with device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const currentTheme = themes[theme];
    const centerY = height / 2;
    const amplitude = height * 0.4;

    // Clear with gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, currentTheme.bg[0]);
    bgGradient.addColorStop(1, currentTheme.bg[1]);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Create waveform gradient
    const waveGradient = ctx.createLinearGradient(0, 0, 0, height);
    currentTheme.gradient.forEach((color, index) => {
      waveGradient.addColorStop(index / (currentTheme.gradient.length - 1), color);
    });

    // Calculate step and draw main waveform
    const step = Math.ceil(audioData.length / width);
    
    // Draw filled waveform area
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    
    for (let i = 0; i < width; i++) {
      const dataIndex = Math.floor(i * step);
      const sample = audioData[dataIndex] || 0;
      const y = centerY + (sample * amplitude);
      ctx.lineTo(i, y);
    }
    
    ctx.lineTo(width, centerY);
    ctx.closePath();
    ctx.fillStyle = waveGradient;
    ctx.globalAlpha = 0.6;
    ctx.fill();
    ctx.globalAlpha = 1;

    // Draw waveform outline with glow
    ctx.strokeStyle = waveGradient;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = currentTheme.glow;
    ctx.shadowBlur = 8;
    
    ctx.beginPath();
    for (let i = 0; i < width; i++) {
      const dataIndex = Math.floor(i * step);
      const sample = audioData[dataIndex] || 0;
      const y = centerY + (sample * amplitude);
      
      if (i === 0) {
        ctx.moveTo(i, y);
      } else {
        ctx.lineTo(i, y);
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw reflection
    ctx.globalAlpha = 0.3;
    ctx.scale(1, -1);
    ctx.translate(0, -height);
    ctx.beginPath();
    for (let i = 0; i < width; i++) {
      const dataIndex = Math.floor(i * step);
      const sample = audioData[dataIndex] || 0;
      const y = centerY + (sample * amplitude * 0.5);
      
      if (i === 0) {
        ctx.moveTo(i, y);
      } else {
        ctx.lineTo(i, y);
      }
    }
    ctx.stroke();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // Reset transform
    ctx.globalAlpha = 1;

    // Draw peak indicators
    if (showPeaks) {
      ctx.fillStyle = currentTheme.gradient[currentTheme.gradient.length - 1];
      for (let i = 0; i < width; i += 8) {
        const dataIndex = Math.floor(i * step);
        const sample = Math.abs(audioData[dataIndex] || 0);
        
        if (sample > 0.7) {
          ctx.shadowColor = currentTheme.glow;
          ctx.shadowBlur = 6;
          ctx.fillRect(i - 1, 4, 2, 6);
          ctx.shadowBlur = 0;
        }
      }
    }

  }, [audioData, width, height, theme, showPeaks]);

  useEffect(() => {
    if (animated) {
      const animate = () => {
        drawWaveform();
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      drawWaveform();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawWaveform, animated]);

  if (!audioData.length) {
    return (
      <div 
        className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 flex items-center justify-center overflow-hidden"
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 bg-slate-700/50 rounded-full flex items-center justify-center animate-pulse">
            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <p className="text-slate-500 text-sm font-medium">No audio data</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 p-3 overflow-hidden shadow-xl group hover:shadow-2xl transition-all duration-300"
      style={{ width: width + 24, height: height + 24 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <canvas
        ref={canvasRef}
        className="relative z-10 w-full h-full rounded-lg"
        style={{ maxWidth: '100%' }}
      />
      <div className="absolute top-2 right-3 text-xs text-slate-500 font-medium">
        HD Waveform
      </div>
    </div>
  );
});

OptimizedWaveform.displayName = 'OptimizedWaveform';

export default OptimizedWaveform;
