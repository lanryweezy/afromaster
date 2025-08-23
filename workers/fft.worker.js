// FFT Web Worker for non-blocking audio analysis
self.onmessage = function(e) {
  const { audioData, fftSize } = e.data;
  
  // Perform FFT calculation
  const fft = performFFT(audioData, fftSize);
  
  // Send result back to main thread
  self.postMessage({ result: fft });
};

function performFFT(audioData, fftSize) {
  const result = new Float32Array(fftSize);
  
  for (let i = 0; i < fftSize; i++) {
    let real = 0;
    let imag = 0;
    
    for (let j = 0; j < fftSize; j++) {
      const sample = audioData[j] || 0;
      const angle = -2 * Math.PI * i * j / fftSize;
      real += sample * Math.cos(angle);
      imag += sample * Math.sin(angle);
    }
    
    result[i] = Math.sqrt(real * real + imag * imag);
  }
  
  return result;
}
