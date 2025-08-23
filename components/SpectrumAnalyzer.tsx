import React, { useRef, useEffect, useState } from 'react';

interface SpectrumAnalyzerProps {
  audioContext: AudioContext | null;
  audioNode: AudioNode | null;
  width?: number;
  height?: number;
}

const SpectrumAnalyzer: React.FC<SpectrumAnalyzerProps> = ({ 
  audioContext, 
  audioNode, 
  width = 400, 
  height = 100 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!audioContext || !audioNode) {
      setIsActive(false);
      return;
    }

    // Create analyzer node
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;
    analyzerRef.current = analyzer;

    try {
      audioNode.connect(analyzer);
      setIsActive(true);
    } catch {
      console.warn('Could not connect to audio node for spectrum analysis');
      setIsActive(false);
    }

    return () => {
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
    if (!isActive || !analyzerRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!analyzerRef.current) return;

      analyzerRef.current.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * height;

        const r = barHeight + 25 * (i / bufferLength);
        const g = 250 * (i / bufferLength);
        const b = 50;

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      requestAnimationFrame(draw);
    };

    draw();
  }, [isActive, width, height]);

  if (!isActive) {
    return (
      <div 
        className="bg-slate-900 rounded flex items-center justify-center text-slate-500"
        style={{ width, height }}
      >
        No audio signal
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded p-2">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ maxWidth: '100%' }}
      />
    </div>
  );
};

export default SpectrumAnalyzer;