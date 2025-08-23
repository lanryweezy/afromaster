import React, { useRef, useEffect } from 'react';

interface WaveformCanvasProps {
  buffer: AudioBuffer | null;
  width?: number;
  height?: number;
  color?: string;
}

const WaveformCanvas: React.FC<WaveformCanvasProps> = ({ 
  buffer, 
  width = 400, 
  height = 80, 
  color = '#f97316' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !buffer) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, height);

    // Get channel data
    const channelData = buffer.getChannelData(0);
    const step = Math.ceil(channelData.length / width);
    const amp = height / 2;

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let i = 0; i < width; i++) {
      const dataIndex = Math.floor(i * step);
      const sample = channelData[dataIndex] || 0;
      const y = (sample * amp) + amp;
      
      if (i === 0) {
        ctx.moveTo(i, y);
      } else {
        ctx.lineTo(i, y);
      }
    }

    ctx.stroke();
  }, [buffer, width, height, color]);

  if (!buffer) {
    return (
      <div 
        className="bg-slate-900 rounded flex items-center justify-center text-slate-500"
        style={{ width, height }}
      >
        No audio data
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-slate-900 rounded"
      style={{ maxWidth: '100%' }}
    />
  );
};

export default WaveformCanvas;