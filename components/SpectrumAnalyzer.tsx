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
        canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`;
        canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 1;
      }
    };

    draw();

    return () => {

    };
  }, [audioContext, audioNode]);

  return <canvas ref={canvasRef} width="500" height="200" />;
};

export default SpectrumAnalyzer;
