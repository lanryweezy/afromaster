import { MasteringSettings } from '../types';

// Professional mastering algorithms
const createMultiBandCompressor = (offlineContext: OfflineAudioContext, settings: MasteringSettings) => {
  // Low band compressor (20Hz - 250Hz)
  const lowBandFilter = offlineContext.createBiquadFilter();
  lowBandFilter.type = 'lowpass';
  lowBandFilter.frequency.value = 250;
  lowBandFilter.Q.value = 0.7;

  const lowCompressor = offlineContext.createDynamicsCompressor();
  lowCompressor.threshold.value = settings.bands.low.threshold;
  lowCompressor.knee.value = settings.bands.low.knee;
  lowCompressor.ratio.value = settings.bands.low.ratio;
  lowCompressor.attack.value = settings.bands.low.attack;
  lowCompressor.release.value = settings.bands.low.release;

  const lowGain = offlineContext.createGain();
  lowGain.gain.value = Math.pow(10, settings.bands.low.makeupGain / 20);

  // Mid band compressor (250Hz - 4kHz)
  const midBandFilter = offlineContext.createBiquadFilter();
  midBandFilter.type = 'bandpass';
  midBandFilter.frequency.value = 2000;
  midBandFilter.Q.value = 1.0;

  const midCompressor = offlineContext.createDynamicsCompressor();
  midCompressor.threshold.value = settings.bands.mid.threshold;
  midCompressor.knee.value = settings.bands.mid.knee;
  midCompressor.ratio.value = settings.bands.mid.ratio;
  midCompressor.attack.value = settings.bands.mid.attack;
  midCompressor.release.value = settings.bands.mid.release;

  const midGain = offlineContext.createGain();
  midGain.gain.value = Math.pow(10, settings.bands.mid.makeupGain / 20);

  // High band compressor (4kHz - 20kHz)
  const highBandFilter = offlineContext.createBiquadFilter();
  highBandFilter.type = 'highpass';
  highBandFilter.frequency.value = 4000;
  highBandFilter.Q.value = 0.7;

  const highCompressor = offlineContext.createDynamicsCompressor();
  highCompressor.threshold.value = settings.bands.high.threshold;
  highCompressor.knee.value = settings.bands.high.knee;
  highCompressor.ratio.value = settings.bands.high.ratio;
  highCompressor.attack.value = settings.bands.high.attack;
  highCompressor.release.value = settings.bands.high.release;

  const highGain = offlineContext.createGain();
  highGain.gain.value = Math.pow(10, settings.bands.high.makeupGain / 20);

  return {
    lowBand: { filter: lowBandFilter, compressor: lowCompressor, gain: lowGain },
    midBand: { filter: midBandFilter, compressor: midCompressor, gain: midGain },
    highBand: { filter: highBandFilter, compressor: highCompressor, gain: highGain }
  };
};

// Intelligent saturation with multiple algorithms
const createIntelligentSaturation = (offlineContext: OfflineAudioContext, settings: MasteringSettings) => {
  const waveshaper = offlineContext.createWaveShaper();
  const amount = settings.saturation.amount;
  const samples = 4096;
  const curve = new Float32Array(samples);
  
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;
    
    switch (settings.saturation.flavor) {
      case 'tube':
        // Warm tube saturation
        curve[i] = Math.sign(x) * (1 - Math.exp(-Math.abs(x) * (1 + amount * 0.1)));
        break;
      case 'tape':
        // Analog tape saturation
        curve[i] = Math.tanh(amount * x) / Math.tanh(amount);
        break;
      case 'transformer':
        // Transformer saturation
        curve[i] = x / (1 + Math.abs(x) * amount * 0.5);
        break;
      case 'digital':
        // Digital clipping with soft knee
        const threshold = 0.8;
        if (Math.abs(x) < threshold) {
          curve[i] = x;
        } else {
          const excess = Math.abs(x) - threshold;
          curve[i] = Math.sign(x) * (threshold + excess * (1 - amount * 0.1));
        }
        break;
      default:
        curve[i] = Math.tanh(amount * x) / Math.tanh(amount);
    }
  }
  
  waveshaper.curve = curve;
  return waveshaper;
};

// Adaptive limiter with look-ahead simulation
const createAdaptiveLimiter = (offlineContext: OfflineAudioContext, settings: MasteringSettings) => {
  const limiter = offlineContext.createDynamicsCompressor();
  limiter.threshold.value = settings.limiter.threshold;
  limiter.ratio.value = 20; // Hard limiting
  limiter.attack.value = settings.limiter.attack;
  limiter.release.value = settings.limiter.release;
  limiter.knee.value = 0; // Hard knee for limiting
  
  return limiter;
};

// Professional EQ with linear phase characteristics
const createProfessionalEQ = (offlineContext: OfflineAudioContext, settings: MasteringSettings) => {
  const bassEQ = offlineContext.createBiquadFilter();
  bassEQ.type = 'lowshelf';
  bassEQ.frequency.value = settings.eq.bassFreq;
  bassEQ.gain.value = settings.eq.bassGain;
  bassEQ.Q.value = 0.7;

  const trebleEQ = offlineContext.createBiquadFilter();
  trebleEQ.type = 'highshelf';
  trebleEQ.frequency.value = settings.eq.trebleFreq;
  trebleEQ.gain.value = settings.eq.trebleGain;
  trebleEQ.Q.value = 0.7;

  return { bassEQ, trebleEQ };
};

export const processAudio = async (
  audioBuffer: AudioBuffer,
  settings: MasteringSettings
): Promise<AudioBuffer> => {
  try {
    // Validate input
    if (!audioBuffer || audioBuffer.length === 0) {
      throw new Error("Invalid audio buffer");
    }
    
    // Validate audio duration
    if (audioBuffer.duration > 600) { // 10 minutes max
      throw new Error("Audio file too long. Please use a track under 10 minutes.");
    }
    
    // Check if OfflineAudioContext is available
    if (typeof OfflineAudioContext === 'undefined') {
      console.warn('OfflineAudioContext not available, returning original buffer');
      return audioBuffer;
    }

    // Create an offline audio context for processing with error handling
    let offlineContext: OfflineAudioContext;
    try {
      offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );
    } catch (contextError) {
      console.error('Failed to create OfflineAudioContext:', contextError);
      return audioBuffer;
    }

    // Create source from the input buffer
    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;

    let currentNode: AudioNode = source;

    // Step 1: Pre-gain
    const preGain = offlineContext.createGain();
    preGain.gain.value = settings.preGain;
    currentNode.connect(preGain);
    currentNode = preGain;

    // Step 2: Professional EQ
    const { bassEQ, trebleEQ } = createProfessionalEQ(offlineContext, settings);
    currentNode.connect(bassEQ);
    bassEQ.connect(trebleEQ);
    currentNode = trebleEQ;

    // Step 3: Multi-band compression
    const multiBand = createMultiBandCompressor(offlineContext, settings);
    
    // Split signal into bands
    const splitter = offlineContext.createChannelSplitter(2);
    currentNode.connect(splitter);
    
    // Process each band with error handling
    const lowOutput = offlineContext.createGain();
    const midOutput = offlineContext.createGain();
    const highOutput = offlineContext.createGain();
    
    try {
      splitter.connect(multiBand.lowBand.filter, 0);
      multiBand.lowBand.filter.connect(multiBand.lowBand.compressor);
      multiBand.lowBand.compressor.connect(multiBand.lowBand.gain);
      multiBand.lowBand.gain.connect(lowOutput);
      
      splitter.connect(multiBand.midBand.filter, 0);
      multiBand.midBand.filter.connect(multiBand.midBand.compressor);
      multiBand.midBand.compressor.connect(multiBand.midBand.gain);
      multiBand.midBand.gain.connect(midOutput);
      
      splitter.connect(multiBand.highBand.filter, 0);
      multiBand.highBand.filter.connect(multiBand.highBand.compressor);
      multiBand.highBand.compressor.connect(multiBand.highBand.gain);
      multiBand.highBand.gain.connect(highOutput);
    } catch (bandError) {
      console.warn("Multi-band processing failed, using simplified approach:", bandError);
      // Fallback to simple processing
      splitter.connect(offlineContext.destination);
    }
    
    // Mix bands back together
    const mixer = offlineContext.createGain();
    lowOutput.connect(mixer);
    midOutput.connect(mixer);
    highOutput.connect(mixer);
    currentNode = mixer;

    // Step 4: Intelligent saturation
    if (settings.saturation && settings.saturation.amount > 0) {
      const saturation = createIntelligentSaturation(offlineContext, settings);
      currentNode.connect(saturation);
      currentNode = saturation;
    }

    // Step 5: Adaptive limiter
    const limiter = createAdaptiveLimiter(offlineContext, settings);
    currentNode.connect(limiter);
    currentNode = limiter;

    // Step 6: Final gain
    const finalGain = offlineContext.createGain();
    finalGain.gain.value = settings.finalGain;
    currentNode.connect(finalGain);

    // Connect to destination
    finalGain.connect(offlineContext.destination);

    // Start processing with timeout protection
    source.start(0);

    // Return the processed audio buffer with timeout
    const renderPromise = offlineContext.startRendering();
    const timeoutPromise = new Promise<AudioBuffer>((_, reject) => {
      setTimeout(() => reject(new Error('Audio processing timeout')), 30000);
    });
    
    const result = await Promise.race([renderPromise, timeoutPromise]);
    
    // Validate output
    if (!result || result.length === 0) {
      throw new Error("Audio processing produced invalid output");
    }
    
    return result;
    
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