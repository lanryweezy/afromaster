import React, { useRef, useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

interface WaveformCanvasProps {
  buffer: AudioBuffer | null;
}

const WaveformCanvas: React.FC<WaveformCanvasProps> = ({ buffer }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useAppContext(); // Depend on theme to trigger redraw
  const [waveformData, setWaveformData] = useState<Float32Array | null>(null);

  useEffect(() => {
    if (buffer && canvasRef.current) {
      const canvas = canvasRef.current;
      const worker = new Worker(new URL('../src/waveform.worker.ts', import.meta.url), { type: 'module' });
      worker.onmessage = (event) => {
        setWaveformData(event.data.waveformData);
        worker.terminate();
      };
      worker.postMessage({ buffer, width: canvas.clientWidth });
    }
  }, [buffer]);

  useEffect(() => {
    if (waveformData && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-focus').trim() || '#60a5fa';
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const amp = height / 2;

      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = primaryColor;
      
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      ctx.beginPath();
      for (let i = 0; i < width; i++) {
        const min = waveformData[i * 2];
        const max = waveformData[i * 2 + 1];
        ctx.moveTo(i, (1 + min) * amp);
        ctx.lineTo(i, (1 + max) * amp);
      }
      ctx.stroke();
    }
  }, [waveformData, theme]);

  return (
    <canvas 
        ref={canvasRef} 
        className="w-full h-full"
    ></canvas>
  );
};

export default WaveformCanvas;