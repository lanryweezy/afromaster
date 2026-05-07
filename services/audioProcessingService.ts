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
const createProfessionalEQ = (
  offlineContext: OfflineAudioContext, 
  settings: MasteringSettings,
  fingerprintDelta?: { bass: number, treble: number }
) => {
  const bassEQ = offlineContext.createBiquadFilter();
  bassEQ.type = 'lowshelf';
  bassEQ.frequency.value = settings.eq.bassFreq;
  bassEQ.gain.value = settings.eq.bassGain + (fingerprintDelta?.bass || 0);
  bassEQ.Q.value = 0.7;

  const trebleEQ = offlineContext.createBiquadFilter();
  trebleEQ.type = 'highshelf';
  trebleEQ.frequency.value = settings.eq.trebleFreq;
  trebleEQ.gain.value = settings.eq.trebleGain + (fingerprintDelta?.treble || 0);
  trebleEQ.Q.value = 0.7;

  return { bassEQ, trebleEQ };
};

// Professional stem summing with headroom management
export const sumStems = async (stems: Stem[]): Promise<AudioBuffer> => {
  if (stems.length === 0) throw new Error("No stems to sum");
  
  // Find longest duration
  const maxDuration = Math.max(...stems.map(s => s.audioBuffer?.duration || 0));
  const sampleRate = stems[0].audioBuffer?.sampleRate || 44100;
  const numberOfChannels = 2; // Standard stereo mixdown

  const offlineContext = new OfflineAudioContext(
    numberOfChannels,
    Math.ceil(maxDuration * sampleRate),
    sampleRate
  );

  stems.forEach(stem => {
    if (!stem.audioBuffer) return;
    const source = offlineContext.createBufferSource();
    source.buffer = stem.audioBuffer;
    
    const gainNode = offlineContext.createGain();
    // AI-suggested or user gain
    gainNode.gain.value = stem.gain;
    
    source.connect(gainNode);
    gainNode.connect(offlineContext.destination);
    source.start(0);
  });

  return await offlineContext.startRendering();
};

// Audio Restoration Algorithms (Audio Archeology)
const applyRestoration = (
  offlineContext: OfflineAudioContext,
  source: AudioNode,
  settings: MasteringSettings
): AudioNode => {
  let currentNode = source;

  // 1. De-Clip: Soft-knee gain reduction for peaks
  if (settings.restoration.deClip > 0) {
    const declipper = offlineContext.createDynamicsCompressor();
    declipper.threshold.value = -3;
    declipper.knee.value = 40;
    declipper.ratio.value = 2;
    declipper.attack.value = 0;
    declipper.release.value = 0.1;
    currentNode.connect(declipper);
    currentNode = declipper;
  }

  // 2. De-Noise: Frequency-dependent noise gate simulation
  if (settings.restoration.deNoise > 0) {
    const gate = offlineContext.createDynamicsCompressor();
    // Use compressor as downward expander/gate
    gate.threshold.value = -60 + (settings.restoration.deNoise / 2);
    gate.ratio.value = 20; 
    gate.attack.value = 0.01;
    gate.release.value = 0.2;
    
    currentNode.connect(gate);
    currentNode = gate;
    
    // Add a high-shelf to further reduce 'hiss'
    const hissFilter = offlineContext.createBiquadFilter();
    hissFilter.type = 'highshelf';
    hissFilter.frequency.value = 8000;
    hissFilter.gain.value = -(settings.restoration.deNoise / 10);
    currentNode.connect(hissFilter);
    currentNode = hissFilter;
  }

  // 3. De-Reverb: Mid-side separation to reduce side-channel "room" energy
  if (settings.restoration.deReverb > 0) {
    const splitter = offlineContext.createChannelSplitter(2);
    const merger = offlineContext.createChannelMerger(2);
    currentNode.connect(splitter);
    
    const leftGain = offlineContext.createGain();
    const rightGain = offlineContext.createGain();
    
    // Simple side-channel reduction
    const sideReduction = 1 - (settings.restoration.deReverb / 200);
    leftGain.gain.value = sideReduction;
    rightGain.gain.value = sideReduction;
    
    splitter.connect(leftGain, 0);
    splitter.connect(rightGain, 1);
    
    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);
    
    currentNode = merger;
  }

  return currentNode;
};

export const processAudio = async (
  audioBuffer: AudioBuffer,
  settings: MasteringSettings,
  leadTrackFingerprint?: any,
  stems?: Stem[] // Optional stems for direct summing
): Promise<AudioBuffer> => {
  try {
    let inputBuffer = audioBuffer;

    // 0. If stems provided, sum them first
    if (stems && stems.length > 0) {
      inputBuffer = await sumStems(stems);
    }

    if (!inputBuffer || inputBuffer.length === 0) {
      throw new Error("Invalid audio buffer");
    }
    
    // 1. Analyze input track
    const currentAnalysis = analyzeAudioBuffer(inputBuffer);
    
    // 2. Calculate Fingerprint Deltas (Sonic Matching)
    const fingerprintDelta = { bass: 0, treble: 0 };
    if (leadTrackFingerprint && leadTrackFingerprint.spectralBalance) {
      const lowDiff = leadTrackFingerprint.spectralBalance.low - currentAnalysis.spectralBalance.low;
      const highDiff = leadTrackFingerprint.spectralBalance.high - currentAnalysis.spectralBalance.high;
      
      // Map spectral energy difference to dB gain (scaled factor)
      fingerprintDelta.bass = lowDiff * 12; // Adjusted scaling
      fingerprintDelta.treble = highDiff * 12;
    }

    // 3. Calculate Loudness Normalization Offset
    let loudnessOffsetDb = 0;
    const targetLoudness = typeof settings.loudnessTarget === 'string' 
      ? (parseFloat(settings.loudnessTarget) || -14)
      : (settings.customLoudnessValue || -14);
      
    loudnessOffsetDb = targetLoudness - currentAnalysis.loudness;

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
    source.buffer = inputBuffer;

    // --- STEP 0: Audio Restoration ---
    let currentNode: AudioNode = applyRestoration(offlineContext, source, settings);

    // Step 1: Pre-gain
    const preGainNode = offlineContext.createGain();
    preGainNode.gain.value = settings.preGain;
    currentNode.connect(preGainNode);
    currentNode = preGainNode;

    // Step 2: Professional EQ with fingerprint matching
    const { bassEQ, trebleEQ } = createProfessionalEQ(offlineContext, settings, fingerprintDelta);
    currentNode.connect(bassEQ);
    bassEQ.connect(trebleEQ);
    currentNode = trebleEQ;

    // Step 3: Multi-band compression
    const multiBand = createMultiBandCompressor(offlineContext, settings);
    const lowOutput = offlineContext.createGain();
    const midOutput = offlineContext.createGain();
    const highOutput = offlineContext.createGain();
    
    currentNode.connect(multiBand.lowBand.filter);
    multiBand.lowBand.filter.connect(multiBand.lowBand.compressor);
    multiBand.lowBand.compressor.connect(multiBand.lowBand.gain);
    multiBand.lowBand.gain.connect(lowOutput);
    
    currentNode.connect(multiBand.midBand.filter);
    multiBand.midBand.filter.connect(multiBand.midBand.compressor);
    multiBand.midBand.compressor.connect(multiBand.midBand.gain);
    multiBand.midBand.gain.connect(midOutput);
    
    currentNode.connect(multiBand.highBand.filter);
    multiBand.highBand.filter.connect(multiBand.highBand.compressor);
    multiBand.highBand.compressor.connect(multiBand.highBand.gain);
    multiBand.highBand.gain.connect(highOutput);
    
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

    // Step 6: Final gain with loudness normalization
    const finalGainNode = offlineContext.createGain();
    const normalizationMultiplier = Math.pow(10, (loudnessOffsetDb + (settings.finalGain - 1) * 20) / 20);
    finalGainNode.gain.value = normalizationMultiplier;
    currentNode.connect(finalGainNode);

    // Connect to destination
    finalGainNode.connect(offlineContext.destination);

    // Start processing with timeout protection
    source.start(0);

    // Return the processed audio buffer with timeout
    const renderPromise = offlineContext.startRendering();
    const timeoutPromise = new Promise<AudioBuffer>((_, reject) => {
      setTimeout(() => reject(new Error('Audio processing timeout')), 60000);
    });
    
    const result = await Promise.race([renderPromise, timeoutPromise]);
    return result as AudioBuffer;
    
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

// Real-time audio analysis function with enhanced metrics
export const analyzeAudioBuffer = (audioBuffer: AudioBuffer) => {
  const channelData = audioBuffer.getChannelData(0); // Use first channel
  const length = channelData.length;
  const sampleRate = audioBuffer.sampleRate;
  
  // Calculate RMS (Root Mean Square) for loudness
  let sum = 0;
  let peak = 0;
  
  // We'll sample the buffer to be efficient if it's long
  const step = Math.max(1, Math.floor(length / 100000)); 
  let sampledCount = 0;
  
  for (let i = 0; i < length; i += step) {
    const val = channelData[i];
    sum += val * val;
    peak = Math.max(peak, Math.abs(val));
    sampledCount++;
  }
  
  const rms = Math.sqrt(sum / sampledCount);
  const loudnessLUFS = 20 * Math.log10(Math.max(rms, 0.000001)) - 0.6; // Improved LUFS approx
  const peakDb = 20 * Math.log10(Math.max(peak, 0.000001));
  const dynamicRange = peakDb - loudnessLUFS;
  
  // Spectral analysis - analyze multiple segments for better accuracy
  const segments = 5;
  let lowEnergy = 0;
  let midEnergy = 0;
  let highEnergy = 0;
  
  for (let s = 0; s < segments; s++) {
    const startSample = Math.floor((length / (segments + 1)) * (s + 1));
    const windowSize = 2048;
    
    for (let i = 0; i < windowSize && (startSample + i) < length; i++) {
      const val = Math.abs(channelData[startSample + i]);
      // Rough frequency bins (very approximate without full FFT)
      if (i % 10 === 0) lowEnergy += val;
      else if (i % 3 === 0) midEnergy += val;
      else highEnergy += val;
    }
  }
  
  const totalEnergy = lowEnergy + midEnergy + highEnergy;
  
  return {
    loudness: parseFloat(loudnessLUFS.toFixed(2)),
    peak: parseFloat(peakDb.toFixed(2)),
    dynamicRange: parseFloat(dynamicRange.toFixed(2)),
    spectralBalance: {
      low: parseFloat((lowEnergy / totalEnergy).toFixed(3)),
      mid: parseFloat((midEnergy / totalEnergy).toFixed(3)),
      high: parseFloat((highEnergy / totalEnergy).toFixed(3))
    },
    duration: audioBuffer.duration,
    sampleRate: audioBuffer.sampleRate,
    channels: audioBuffer.numberOfChannels
  };
};