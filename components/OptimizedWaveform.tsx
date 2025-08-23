import React, { useRef, useEffect, useCallback, memo } from 'react';

interface OptimizedWaveformProps {
  audioData: Float32Array;
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
}

const OptimizedWaveform: React.FC<OptimizedWaveformProps> = memo(({
  audioData,
  width = 800,
  height = 200,
  color = '#f97316',
  backgroundColor = '#1e293b'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Draw waveform
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();

    const step = Math.ceil(audioData.length / width);
    const amp = height / 2;

    for (let i = 0; i < width; i++) {
      const dataIndex = Math.floor(i * step);
      const sample = audioData[dataIndex] || 0;
      const y = (sample * amp) + amp;
      
      if (i === 0) {
        ctx.moveTo(i, y);
      } else {
        ctx.lineTo(i, y);
      }
    }

    ctx.stroke();
  }, [audioData, width, height, color, backgroundColor]);

  useEffect(() => {
    drawWaveform();
  }, [drawWaveform]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full bg-slate-900 rounded"
      style={{ maxWidth: '100%' }}
    />
  );
});

OptimizedWaveform.displayName = 'OptimizedWaveform';

export default OptimizedWaveform;
