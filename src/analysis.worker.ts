// This is the audio analysis worker file.
// The audio analysis logic will be moved here.

const calculateRMS = (buffer: AudioBuffer): number => {
  const data = buffer.getChannelData(0);
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i] * data[i];
  }
  const rms = Math.sqrt(sum / data.length);
  return 20 * Math.log10(rms);
};

const analyzeTrack = async (buffer: AudioBuffer) => {
  const loudness = calculateRMS(buffer);

  const offlineCtx = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  const source = offlineCtx.createBufferSource();
  source.buffer = buffer;
  const analyser = offlineCtx.createAnalyser();
  analyser.fftSize = 2048;
  source.connect(analyser);
<<<<<<< HEAD
  analyser.connect(offlineCtx.destination);
  source.start(0);
  const rendered = await offlineCtx.startRendering();

  // Extract frequency data from the rendered buffer via a new Analyser on an OnlineAudioContext substitute
  const tempCtx = new OfflineAudioContext(rendered.numberOfChannels, rendered.length, rendered.sampleRate);
  const tempSource = tempCtx.createBufferSource();
  tempSource.buffer = rendered;
  const tempAnalyser = tempCtx.createAnalyser();
  tempAnalyser.fftSize = 2048;
  tempSource.connect(tempAnalyser);
  tempAnalyser.connect(tempCtx.destination);
  tempSource.start(0);
  const renderedAgain = await tempCtx.startRendering();

  const freqAnalyser = tempCtx.createAnalyser();
  // Fallback: compute simple band energies directly from renderedAgain.getChannelData(...)
  const freqData = new Uint8Array(tempAnalyser.frequencyBinCount);
  tempAnalyser.getByteFrequencyData(freqData);
=======
  await offlineCtx.startRendering();

  const freqData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(freqData);
>>>>>>> main

  const bass = freqData.slice(0, 10).reduce((a, b) => a + b, 0);
  const mid = freqData.slice(10, 100).reduce((a, b) => a + b, 0);
  const treble = freqData.slice(100).reduce((a, b) => a + b, 0);
  const total = bass + mid + treble;
  const spectralBalance = {
    bass: bass / total,
    mid: mid / total,
    treble: treble / total,
  };

  let peak = 0;
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    const data = buffer.getChannelData(i);
    for (let j = 0; j < data.length; j++) {
      peak = Math.max(peak, Math.abs(data[j]));
    }
  }

  return { loudness, spectralBalance, peak };
};

self.onmessage = async (event) => {
  const { buffer } = event.data;
  const analysis = await analyzeTrack(buffer);
  self.postMessage(analysis);
};
