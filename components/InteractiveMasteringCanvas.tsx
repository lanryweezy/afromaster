import React, { useRef, useEffect, useState } from 'react';
import { MasteringSettings } from '../types';

interface InteractiveMasteringCanvasProps {
  settings: MasteringSettings;
  onChange: (updates: Partial<MasteringSettings>) => void;
  mode: 'eq' | 'dynamics';
}

const InteractiveMasteringCanvas: React.FC<InteractiveMasteringCanvasProps> = ({ settings, onChange, mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState<string | null>(null);

  const padding = 40;
  const width = 800;
  const height = 400;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background grid
    drawGrid(ctx);

    if (mode === 'eq') {
      drawEQCurve(ctx);
    } else {
      drawDynamicsGraph(ctx);
    }
  }, [settings, mode]);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    // Vertical lines (log scale for EQ, linear for dynamics)
    for (let i = 1; i < 10; i++) {
      const x = (i / 10) * width;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    
    // Horizontal lines
    for (let i = 1; i < 5; i++) {
      const y = (i / 5) * height;
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();
  };

  const drawEQCurve = (ctx: CanvasRenderingContext2D) => {
    const { eq } = settings;
    
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    // Simple approximation of the EQ curve
    for (let x = 0; x <= width; x++) {
      const freq = Math.pow(10, (x / width) * 3 + 1.3); // 20Hz to 20kHz
      
      let gain = 0;
      // Low shelf approx
      if (freq < eq.bassFreq) {
        gain += eq.bassGain;
      } else if (freq < eq.bassFreq * 2) {
        const t = (freq - eq.bassFreq) / eq.bassFreq;
        gain += eq.bassGain * (1 - t);
      }
      
      // High shelf approx
      if (freq > eq.trebleFreq) {
        gain += eq.trebleGain;
      } else if (freq > eq.trebleFreq / 2) {
        const t = (eq.trebleFreq - freq) / (eq.trebleFreq / 2);
        gain += eq.trebleGain * (1 - t);
      }
      
      const y = height / 2 - (gain * 10);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw handles
    drawHandle(ctx, getXFromFreq(eq.bassFreq), height / 2 - (eq.bassGain * 10), 'Bass');
    drawHandle(ctx, getXFromFreq(eq.trebleFreq), height / 2 - (eq.trebleGain * 10), 'Treble');
  };

  const drawDynamicsGraph = (ctx: CanvasRenderingContext2D) => {
    const { limiter } = settings;
    const threshold = limiter.threshold; // -60 to 0
    const ratio = 20; // Fixed for limiter
    
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const threshX = ((threshold + 60) / 60) * width;
    const threshY = height - ((threshold + 60) / 60) * height;
    
    ctx.moveTo(0, height);
    ctx.lineTo(threshX, threshY);
    
    // After threshold, the slope is 1/ratio
    const endX = width;
    const endY = threshY - (width - threshX) / ratio;
    ctx.lineTo(endX, endY);
    
    ctx.stroke();
    
    // Draw threshold handle
    drawHandle(ctx, threshX, threshY, 'Thresh');
  };

  const drawHandle = (ctx: CanvasRenderingContext2D, x: number, y: number, label: string) => {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Inter';
    ctx.fillText(label, x - 15, y - 15);
  };

  const getXFromFreq = (freq: number) => {
    return ((Math.log10(freq) - 1.3) / 3) * width;
  };

  const getFreqFromX = (x: number) => {
    return Math.pow(10, (x / width) * 3 + 1.3);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === 'eq') {
      if (Math.abs(x - getXFromFreq(settings.eq.bassFreq)) < 20) setIsDragging('bass');
      else if (Math.abs(x - getXFromFreq(settings.eq.trebleFreq)) < 20) setIsDragging('treble');
    } else {
      const threshX = ((settings.limiter.threshold + 60) / 60) * width;
      if (Math.abs(x - threshX) < 20) setIsDragging('thresh');
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(height, e.clientY - rect.top));

    if (isDragging === 'bass') {
      onChange({
        eq: {
          ...settings.eq,
          bassFreq: Math.min(1000, Math.max(20, getFreqFromX(x))),
          bassGain: Math.min(12, Math.max(-12, (height / 2 - y) / 10))
        },
        bassBoost: (height / 2 - y) / 10
      });
    } else if (isDragging === 'treble') {
      onChange({
        eq: {
          ...settings.eq,
          trebleFreq: Math.min(20000, Math.max(2000, getFreqFromX(x))),
          trebleGain: Math.min(12, Math.max(-12, (height / 2 - y) / 10))
        },
        trebleBoost: (height / 2 - y) / 10
      });
    } else if (isDragging === 'thresh') {
      onChange({
        limiter: {
          ...settings.limiter,
          threshold: (x / width) * 60 - 60
        }
      });
    }
  };

  const handleMouseUp = () => setIsDragging(null);

  return (
    <div className="relative bg-slate-950 rounded-xl border border-slate-800 p-4 shadow-inner overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          {mode === 'eq' ? 'Parametric EQ Visualizer' : 'Dynamics Response'}
        </h4>
        <div className="flex gap-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           <span className="text-[10px] text-slate-400">Real-time DSP</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-auto cursor-crosshair touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div className="mt-4 flex justify-between text-[10px] text-slate-600 font-mono">
        {mode === 'eq' ? (
          <>
            <span>20Hz</span>
            <span>100Hz</span>
            <span>1kHz</span>
            <span>10kHz</span>
            <span>20kHz</span>
          </>
        ) : (
          <>
            <span>-60dB</span>
            <span>-45dB</span>
            <span>-30dB</span>
            <span>-15dB</span>
            <span>0dB</span>
          </>
        )}
      </div>
    </div>
  );
};

export default InteractiveMasteringCanvas;