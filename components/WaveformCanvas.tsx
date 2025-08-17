import React, { useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';

interface WaveformCanvasProps {
  buffer: AudioBuffer | null;
}

const WaveformCanvas: React.FC<WaveformCanvasProps> = ({ buffer }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useAppContext(); // Depend on theme to trigger redraw

  useEffect(() => {
    if (buffer && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Ensure we get the latest color after a theme change
      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-focus').trim() || '#60a5fa';

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const data = buffer.getChannelData(0); // Use the first channel
      const step = Math.ceil(data.length / width);
      const amp = height / 2;

      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = primaryColor;
      
      // Draw center line
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.globalAlpha = 1.0;


      ctx.beginPath();
      for (let i = 0; i < width; i++) {
        let min = 1.0;
        let max = -1.0;
        for (let j = 0; j < step; j++) {
          const datum = data[(i * step) + j];
          if (datum < min) min = datum;
          if (datum > max) max = datum;
        }
        ctx.moveTo(i, (1 + min) * amp);
        ctx.lineTo(i, (1 + max) * amp);
      }
      ctx.stroke();
    }
  }, [buffer, theme]); // Redraw when buffer or theme changes

  return (
    <canvas 
        ref={canvasRef} 
        className="w-full h-full"
    ></canvas>
  );
};

export default WaveformCanvas;
