import React, { useRef, useEffect, useState } from 'react';

interface SpectrumAnalyzerProps {
  audioContext: AudioContext | null;
  audioNode: AudioNode | null;
  width?: number;
  height?: number;
  theme?: 'fire' | 'ocean' | 'neon' | 'aurora';
}

const SpectrumAnalyzer: React.FC<SpectrumAnalyzerProps> = ({ 
  audioContext, 
  audioNode, 
  width = 400, 
  height = 120,
  theme = 'fire'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();
  const [isActive, setIsActive] = useState(false);

  const themes = {
    fire: {
      colors: [
        [255, 94, 77],   // Red-orange
        [255, 154, 0],   // Orange
        [255, 206, 84],  // Yellow-orange
        [255, 235, 59]   // Yellow
      ],
      glow: 'rgba(255, 154, 0, 0.8)'
    },
    ocean: {
      colors: [
        [0, 150, 199],   // Ocean blue
        [0, 188, 212],   // Light blue
        [77, 208, 225],  // Cyan
        [129, 230, 217]  // Aqua
      ],
      glow: 'rgba(0, 188, 212, 0.8)'
    },
    neon: {
      colors: [
        [255, 20, 147],  // Deep pink
        [138, 43, 226],  // Blue violet
        [75, 0, 130],    // Indigo
        [148, 0, 211]    // Dark violet
      ],
      glow: 'rgba(255, 20, 147, 0.8)'
    },
    aurora: {
      colors: [
        [0, 255, 127],   // Spring green
        [127, 255, 212], // Aquamarine
        [173, 216, 230], // Light blue
        [221, 160, 221]  // Plum
      ],
      glow: 'rgba(0, 255, 127, 0.8)'
    }
  };

  useEffect(() => {
    if (!audioContext || !audioNode) {
      setIsActive(false);
      return;
    }

    // Create analyzer node with higher resolution
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 512; // Higher resolution
    analyzer.smoothingTimeConstant = 0.8;
    analyzerRef.current = analyzer;

    try {
      audioNode.connect(analyzer);
      setIsActive(true);
    } catch {
      console.warn('Could not connect to audio node for spectrum analysis');
      setIsActive(false);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (analyzerRef.current && audioNode) {
        try {
          audioNode.disconnect(analyzerRef.current);
        } catch {
          // Ignore disconnection errors
        }
      }
    };
  }, [audioContext, audioNode]);

  useEffect(() => {
    if (!isActive || !analyzerRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const themeColors = themes[theme];

    const draw = () => {
      if (!analyzerRef.current) return;

      analyzerRef.current.getByteFrequencyData(dataArray);

      // Create gradient background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      bgGradient.addColorStop(1, 'rgba(30, 41, 59, 0.95)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw frequency bars
      const barWidth = width / (bufferLength * 0.7); // Use only lower frequencies for better visual
      const spacing = 1;
      
      for (let i = 0; i < bufferLength * 0.7; i++) {
        const barHeight = (dataArray[i] / 255) * height * 0.9;
        const x = i * (barWidth + spacing);
        
        if (barHeight > 2) {
          // Create gradient for each bar
          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
          
          // Color based on frequency and amplitude
          const colorIndex = Math.floor((i / (bufferLength * 0.7)) * themeColors.colors.length);
          const baseColor = themeColors.colors[Math.min(colorIndex, themeColors.colors.length - 1)];
          const intensity = dataArray[i] / 255;
          
          gradient.addColorStop(0, `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${0.3 + intensity * 0.7})`);
          gradient.addColorStop(0.6, `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${0.8 + intensity * 0.2})`);
          gradient.addColorStop(1, `rgba(${Math.min(255, baseColor[0] + 50)}, ${Math.min(255, baseColor[1] + 30)}, ${Math.min(255, baseColor[2] + 20)}, 1)`);
          
          ctx.fillStyle = gradient;
          
          // Draw main bar
          ctx.fillRect(x, height - barHeight, barWidth, barHeight);
          
          // Add glow effect for high frequencies
          if (dataArray[i] > 100) {
            ctx.shadowColor = themeColors.glow;
            ctx.shadowBlur = 8;
            ctx.fillRect(x, height - barHeight, barWidth, barHeight);
            ctx.shadowBlur = 0;
          }
          
          // Add reflection effect
          const reflectionGradient = ctx.createLinearGradient(0, height, 0, height + barHeight * 0.3);
          reflectionGradient.addColorStop(0, `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0.2)`);
          reflectionGradient.addColorStop(1, `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0)`);
          ctx.fillStyle = reflectionGradient;
          ctx.fillRect(x, height, barWidth, barHeight * 0.3);
        }
      }

      // Add peak indicators
      for (let i = 0; i < bufferLength * 0.7; i++) {
        if (dataArray[i] > 200) {
          const x = i * (barWidth + spacing);
          const baseColor = themeColors.colors[Math.floor((i / (bufferLength * 0.7)) * themeColors.colors.length)];
          
          ctx.fillStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0.9)`;
          ctx.fillRect(x, 2, barWidth, 3);
          
          // Peak glow
          ctx.shadowColor = themeColors.glow;
          ctx.shadowBlur = 4;
          ctx.fillRect(x, 2, barWidth, 3);
          ctx.shadowBlur = 0;
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, width, height, theme]);

  if (!isActive) {
    return (
      <div 
        className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 flex items-center justify-center overflow-hidden group"
        style={{ width, height }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-red-500/5 opacity-50"></div>
        <div className="relative z-10 text-center">
          <div className="w-8 h-8 mx-auto mb-2 bg-slate-700 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.5 13.65A2 2 0 014 12V8a2 2 0 01.5-1.65l3.883-3.166z" />
              <path d="M11.5 9.5v-2a1 1 0 012 0v2a1 1 0 01-2 0zM13.5 12.5v-1a1 1 0 012 0v1a1 1 0 01-2 0z" />
            </svg>
          </div>
          <p className="text-slate-500 text-sm font-medium">Waiting for audio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 p-3 overflow-hidden shadow-xl group hover:shadow-2xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <canvas
        ref={canvasRef}
        className="relative z-10 w-full h-full rounded-lg"
        style={{ maxWidth: '100%' }}
      />
      <div className="absolute bottom-2 right-2 text-xs text-slate-500 font-medium">
        Live Spectrum
      </div>
    </div>
  );
};

export default SpectrumAnalyzer;