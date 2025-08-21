import { MasteringSettings } from '../types';

export const processAudio = async (
  audioBuffer: AudioBuffer,
  settings: MasteringSettings
): Promise<AudioBuffer> => {
  try {
    // Check if OfflineAudioContext is available
    if (typeof OfflineAudioContext === 'undefined') {
      console.warn('OfflineAudioContext not available, returning original buffer');
      return audioBuffer;
    }

    // Create an offline audio context for processing
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    
  // Create source from the input buffer
  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;

  let currentNode: AudioNode = source;

  // Apply EQ (Bass and Treble)
  if (settings.eq.bassGain !== 0) {
    const bassEQ = offlineContext.createBiquadFilter();
    bassEQ.type = 'lowshelf';
    bassEQ.frequency.value = settings.eq.bassFreq;
    bassEQ.gain.value = settings.eq.bassGain;
    currentNode.connect(bassEQ);
    currentNode = bassEQ;
  }

  if (settings.eq.trebleGain !== 0) {
    const trebleEQ = offlineContext.createBiquadFilter();
    trebleEQ.type = 'highshelf';
    trebleEQ.frequency.value = settings.eq.trebleFreq;
    trebleEQ.gain.value = settings.eq.trebleGain;
    currentNode.connect(trebleEQ);
    currentNode = trebleEQ;
  }

  // Apply Dynamic Range Compression for each band
  const createCompressor = (band: { threshold: number; ratio: number; attack: number; release: number; makeupGain: number }) => {
    const compressor = offlineContext.createDynamicsCompressor();
    compressor.threshold.value = band.threshold;
    compressor.ratio.value = band.ratio;
    compressor.attack.value = band.attack / 1000; // Convert ms to seconds
    compressor.release.value = band.release / 1000; // Convert ms to seconds
    
    // Apply makeup gain
    const gainNode = offlineContext.createGain();
    gainNode.gain.value = Math.pow(10, band.makeupGain / 20); // Convert dB to linear
    
    compressor.connect(gainNode);
    return { compressor, gainNode };
  };

  // Apply multiband compression (simplified - in reality you'd need crossovers)
  const { compressor: lowCompressor, gainNode: lowGain } = createCompressor(settings.bands.low);
  currentNode.connect(lowCompressor);
  currentNode = lowGain;

  // Apply saturation if enabled
  if (settings.saturation && settings.saturation.amount > 0) {
    const waveshaper = offlineContext.createWaveShaper();
    const amount = settings.saturation.amount;
    const samples = 44100;
    const curve = new Float32Array(samples);
    
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      switch (settings.saturation.flavor) {
        case 'tube':
          curve[i] = x - (x * x * x) / 3;
          break;
        case 'fuzz':
          curve[i] = Math.sign(x) * (1 - Math.exp(-Math.abs(x) * amount));
          break;
        case 'tape':
        default:
          curve[i] = Math.tanh(amount * x) / Math.tanh(amount);
          break;
      }
    }
    
    waveshaper.curve = curve;
    currentNode.connect(waveshaper);
    currentNode = waveshaper;
  }

  // Apply final limiter
  const limiter = offlineContext.createDynamicsCompressor();
  limiter.threshold.value = settings.limiter.threshold;
  limiter.ratio.value = 20; // Hard limiting
  limiter.attack.value = 0.001; // Very fast attack
  limiter.release.value = 0.1; // Fast release
  currentNode.connect(limiter);

  // Apply final gain
  const finalGain = offlineContext.createGain();
  finalGain.gain.value = Math.pow(10, settings.finalGain / 20);
  limiter.connect(finalGain);

  // Connect to destination
  finalGain.connect(offlineContext.destination);

  // Start processing
  source.start(0);

  // Return the processed audio buffer
  return offlineContext.startRendering();
  } catch (error) {
    console.error('Error in audio processing:', error);
    // Return original buffer if processing fails
    return audioBuffer;
  }
};

// Real-time audio analysis function
export const analyzeAudioBuffer = (audioBuffer: AudioBuffer) => {
  const channelData = audioBuffer.getChannelData(0); // Use first channel
  const length = channelData.length;
  
  // Calculate RMS (Root Mean Square) for loudness
  let sum = 0;
  for (let i = 0; i < length; i++) {
    sum += channelData[i] * channelData[i];
  }
  const rms = Math.sqrt(sum / length);
  const loudnessLUFS = 20 * Math.log10(rms) - 23; // Approximate LUFS conversion
  
  // Calculate peak level
  let peak = 0;
  for (let i = 0; i < length; i++) {
    peak = Math.max(peak, Math.abs(channelData[i]));
  }
  const peakDb = 20 * Math.log10(peak);
  
  // Calculate dynamic range (simplified)
  const dynamicRange = peakDb - loudnessLUFS;
  
  // Spectral analysis (simplified)
  const fftSize = 2048;
  const fftData = new Float32Array(fftSize);
  const nyquist = audioBuffer.sampleRate / 2;
  
  // Copy a section of audio for FFT analysis
  const startSample = Math.floor(length / 2); // Middle of the track
  for (let i = 0; i < fftSize && startSample + i < length; i++) {
    fftData[i] = channelData[startSample + i];
  }
  
  // Simple frequency analysis (you'd use FFT in a real implementation)
  let lowFreqEnergy = 0;
  let midFreqEnergy = 0;
  let highFreqEnergy = 0;
  
  const lowFreqBin = Math.floor((200 / nyquist) * fftSize);
  const midFreqBin = Math.floor((2000 / nyquist) * fftSize);
  const highFreqBin = Math.floor((8000 / nyquist) * fftSize);
  
  for (let i = 0; i < lowFreqBin; i++) {
    lowFreqEnergy += Math.abs(fftData[i]);
  }
  for (let i = lowFreqBin; i < midFreqBin; i++) {
    midFreqEnergy += Math.abs(fftData[i]);
  }
  for (let i = midFreqBin; i < highFreqBin; i++) {
    highFreqEnergy += Math.abs(fftData[i]);
  }
  
  return {
    loudness: loudnessLUFS,
    peak: peakDb,
    dynamicRange,
    spectralBalance: {
      low: lowFreqEnergy / lowFreqBin,
      mid: midFreqEnergy / (midFreqBin - lowFreqBin),
      high: highFreqEnergy / (highFreqBin - midFreqBin)
    },
    duration: audioBuffer.duration,
    sampleRate: audioBuffer.sampleRate,
    channels: audioBuffer.numberOfChannels
  };
};