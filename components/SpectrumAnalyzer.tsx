import React, { useRef, useEffect } from 'react';

interface SpectrumAnalyzerProps {
  audioContext: AudioContext;
  audioNode: AudioNode;
}

const SpectrumAnalyzer: React.FC<SpectrumAnalyzerProps> = ({ audioContext, audioNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioContext || !audioNode) return;

    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;
    audioNode.connect(analyzer);
    analyzerRef.current = analyzer;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyzer.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height;

        // Create gradient
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#4f46e5'); // Primary
        gradient.addColorStop(1, '#818cf8'); // Lighter primary

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (analyzerRef.current) audioNode.disconnect(analyzerRef.current);
    };
  }, [audioContext, audioNode]);

  return (
    <div className="w-full h-full bg-slate-900/40 rounded-lg overflow-hidden border border-slate-800 shadow-inner">
      <canvas ref={canvasRef} width={600} height={150} className="w-full h-full opacity-80" />
    </div>
  );
};

export default SpectrumAnalyzer;