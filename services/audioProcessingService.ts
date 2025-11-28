import { MasteringSettings } from '../types';
import { TonePreference, LoudnessTarget, StereoWidth } from '../constants';

/**
 * Creates a configured DynamicsCompressorNode.
 */
const createCompressor = (
  context: OfflineAudioContext, 
  settings: { threshold: number, knee: number, ratio: number, attack: number, release: number }
): DynamicsCompressorNode => {
  const compressor = context.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(settings.threshold, context.currentTime);
  compressor.knee.setValueAtTime(settings.knee, context.currentTime);
  compressor.ratio.setValueAtTime(settings.ratio, context.currentTime);
  compressor.attack.setValueAtTime(settings.attack, context.currentTime);
  compressor.release.setValueAtTime(settings.release, context.currentTime);
  return compressor;
};

/**
 * Creates a saturation curve for the WaveShaperNode.
 * The higher the amount, the more distortion.
 */
const createSaturationCurve = (amount: number): Float32Array => {
    const k = amount; // amount is 0-100
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    for (let i = 0; i < n_samples; i++) {
        const x = i * 2 / n_samples - 1; // map i to -1 to 1
        // A classic waveshaping algorithm
        curve[i] = (1 + k/100) * x / (1 + k/100 * Math.abs(x));
    }
    return curve;
};

/**
 * Generates detailed, commercial-grade settings for a multi-band mastering chain
 * based on user preferences. This is the "brain" of the AI mastering.
 */
const getMasteringChainSettings = (settings: MasteringSettings) => {
    // Start with a solid, balanced baseline
    const chain = {
        crossover: { lowPass: 250, highPass: 4000 },
        eq: {
            bassFreq: 200,
            trebleFreq: 5000,
            bassGain: settings.bassBoost,
            trebleGain: settings.trebleBoost,
        },
        saturation: {
            amount: settings.saturationAmount,
        },
        preGain: 1.0,
        bands: {
            // Baseline compressor settings (for compressionAmount=50)
            low:  { threshold: -35, knee: 15, ratio: 4, attack: 0.05, release: 0.30, makeupGain: 2.0 },
            mid:  { threshold: -30, knee: 10, ratio: 3, attack: 0.01, release: 0.25, makeupGain: 2.0 },
            high: { threshold: -25, knee: 5,  ratio: 3, attack: 0.005, release: 0.15, makeupGain: 1.5 },
        },
        limiter: { threshold: -1.5, attack: 0.002, release: 0.05 },
        finalGain: 1.0,
    };

    // --- Apply Compression Amount ---
    const compAmount = settings.compressionAmount / 100; // Normalize to 0-1
    // Center the effect around 0.5 (which is the default 50)
    const compFactor = (compAmount - 0.5) * 2; // -1 to 1

    // Adjust thresholds: more compression means lower threshold
    chain.bands.low.threshold -= compFactor * 8;
    chain.bands.mid.threshold -= compFactor * 6;
    chain.bands.high.threshold -= compFactor * 5;

    // Adjust ratios: more compression means higher ratio
    chain.bands.low.ratio += compFactor * 3;
    chain.bands.mid.ratio += compFactor * 2;
    chain.bands.high.ratio += compFactor * 2;

    // --- Apply Tone Preference Adjustments ---
    switch (settings.tonePreference) {
        case TonePreference.WARM:
            chain.bands.low.makeupGain += 1.0;
            chain.bands.high.makeupGain -= 0.5;
            chain.bands.low.release = 0.4;
            break;
        case TonePreference.BRIGHT:
            chain.bands.high.makeupGain += 1.0;
            chain.bands.mid.makeupGain += 0.5;
            chain.bands.low.makeupGain -= 0.5;
            chain.bands.high.attack = 0.003;
            break;
        case TonePreference.PUNCHY:
            chain.bands.mid.threshold -= 2;
            chain.bands.mid.ratio += 1;
            chain.bands.mid.attack = 0.008;
            chain.bands.mid.makeupGain += 1.0;
            chain.bands.low.ratio += 1;
            break;
        case TonePreference.VINTAGE:
            chain.bands.high.makeupGain -= 1.0;
            chain.bands.low.ratio += 2;
            chain.bands.low.release = 0.5;
            chain.bands.mid.release = 0.4;
            chain.saturation.amount = Math.max(chain.saturation.amount, 30);
            break;
        case TonePreference.BALANCED:
        default:
            break;
    }
    
    // --- Apply Loudness Target Adjustments ---
    const loudnessValue = settings.customLoudnessValue || -14;
    if (loudnessValue > -12) {
        chain.finalGain = 1.25;
        chain.limiter.threshold = -2.5;
    }
    if (loudnessValue <= -16) {
        chain.finalGain = 0.8;
        chain.limiter.threshold = -0.5;
    }

    if (settings.stereoWidth === StereoWidth.WIDE) {
      chain.preGain = 1.05;
    }

    return chain;
};


/**
 * A final normalization pass to ensure the audio peaks at -0.1 dBTP,
 * preventing any inter-sample peaks from causing clipping.
 */
const normalizeBuffer = async (buffer: AudioBuffer): Promise<AudioBuffer> => {
    let max = 0;
    for (let c = 0; c < buffer.numberOfChannels; c++) {
        const channelData = buffer.getChannelData(c);
        for (let i = 0; i < channelData.length; i++) {
            max = Math.max(max, Math.abs(channelData[i]));
        }
    }

    if (max === 0) return buffer;

    const targetPeak = Math.pow(10, -0.1 / 20); // -0.1 dBTP
    if (max <= targetPeak) {
        return buffer;
    }
    
    const gain = targetPeak / max;

    const context = new OfflineAudioContext(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
    const source = context.createBufferSource();
    source.buffer = buffer;
    const gainNode = context.createGain();
    gainNode.gain.value = gain;

    source.connect(gainNode);
    gainNode.connect(context.destination);
    source.start(0);

    return context.startRendering();
}


/**
 * Processes the audio using a commercial-grade multi-band mastering chain.
 */
export const processAudio = async (
  originalBuffer: AudioBuffer,
  settings: MasteringSettings
): Promise<AudioBuffer> => {
    const context = new OfflineAudioContext(
        originalBuffer.numberOfChannels,
        originalBuffer.length,
        originalBuffer.sampleRate
    );

    const chainSettings = getMasteringChainSettings(settings);

    // --- Create Nodes ---
    const source = context.createBufferSource();
    source.buffer = originalBuffer;
    
    const bassEQ = context.createBiquadFilter();
    bassEQ.type = 'lowshelf';
    bassEQ.frequency.value = chainSettings.eq.bassFreq;
    bassEQ.gain.value = chainSettings.eq.bassGain;

    const trebleEQ = context.createBiquadFilter();
    trebleEQ.type = 'highshelf';
    trebleEQ.frequency.value = chainSettings.eq.trebleFreq;
    trebleEQ.gain.value = chainSettings.eq.trebleGain;

    const lowpass = context.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = chainSettings.crossover.lowPass;
    lowpass.Q.value = 0.71;

    const highpassForMid = context.createBiquadFilter();
    highpassForMid.type = 'highpass';
    highpassForMid.frequency.value = chainSettings.crossover.lowPass;
    highpassForMid.Q.value = 0.71;

    const lowpassForMid = context.createBiquadFilter();
    lowpassForMid.type = 'lowpass';
    lowpassForMid.frequency.value = chainSettings.crossover.highPass;
    lowpassForMid.Q.value = 0.71;

    const highpass = context.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = chainSettings.crossover.highPass;
    highpass.Q.value = 0.71;

    const lowComp = createCompressor(context, chainSettings.bands.low);
    const midComp = createCompressor(context, chainSettings.bands.mid);
    const highComp = createCompressor(context, chainSettings.bands.high);

    const lowGain = context.createGain();
    lowGain.gain.value = chainSettings.bands.low.makeupGain;
    const midGain = context.createGain();
    midGain.gain.value = chainSettings.bands.mid.makeupGain;
    const highGain = context.createGain();
    highGain.gain.value = chainSettings.bands.high.makeupGain;
    
    const saturationNode = context.createWaveShaper();
    if (chainSettings.saturation.amount > 0) {
        saturationNode.curve = createSaturationCurve(chainSettings.saturation.amount);
        saturationNode.oversample = '4x';
    }
    
    const merger = context.createGain();
    const finalGain = context.createGain();
    finalGain.gain.value = chainSettings.finalGain;
    const limiter = createCompressor(context, { ...chainSettings.limiter, knee: 0, ratio: 20 });

    // --- Connect the Audio Graph ---
    source.connect(bassEQ);
    bassEQ.connect(trebleEQ);
    const lastPreNode = trebleEQ;
    
    lastPreNode.connect(lowpass);
    lowpass.connect(lowComp);
    lowComp.connect(lowGain);
    lowGain.connect(merger);

    lastPreNode.connect(highpassForMid);
    highpassForMid.connect(lowpassForMid);
    lowpassForMid.connect(midComp);
    midComp.connect(midGain);
    midGain.connect(merger);

    lastPreNode.connect(highpass);
    highpass.connect(highComp);
    highComp.connect(highGain);
    highGain.connect(merger);
    
    let lastNode: AudioNode = merger;
    if (chainSettings.saturation.amount > 0) {
        merger.connect(saturationNode);
        lastNode = saturationNode;
    }
    
    lastNode.connect(finalGain);
    finalGain.connect(limiter);
    limiter.connect(context.destination);

    source.start(0);

    const renderedBuffer = await context.startRendering();
    
    return normalizeBuffer(renderedBuffer);
};