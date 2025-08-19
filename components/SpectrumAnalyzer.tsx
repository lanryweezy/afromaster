import React, { useRef, useEffect } from 'react';

interface SpectrumAnalyzerProps {
  audioContext: AudioContext;
  audioNode: AudioNode;
}

const SpectrumAnalyzer: React.FC<SpectrumAnalyzerProps> = ({ audioContext, audioNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!audioContext || !audioNode) return;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    audioNode.connect(analyser);
    analyserRef.current = analyser;

    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext('2d');
    let animationId: number | null = null;

    const draw = () => {
      if (!canvas || !canvasCtx || !analyserRef.current) return;
      const analyserNode = analyserRef.current;
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      animationId = requestAnimationFrame(draw);
      analyserNode.getByteFrequencyData(dataArray);
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`;
        canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationId !== null) cancelAnimationFrame(animationId);
      try { audioNode.disconnect(analyser); } catch {}
    };
  }, [audioContext, audioNode]);

  return <canvas ref={canvasRef} width="500" height="200" />;
};

export default SpectrumAnalyzer;