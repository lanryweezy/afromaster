import { MasteringSettings } from './types';

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

const createSaturationCurve = (amount: number): Float32Array => {
    const k = amount;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    for (let i = 0; i < n_samples; i++) {
        const x = i * 2 / n_samples - 1;
        curve[i] = (1 + k/100) * x / (1 + k/100 * Math.abs(x));
    }
    return curve;
};

const normalizeBuffer = async (buffer: AudioBuffer): Promise<AudioBuffer> => {
    let max = 0;
    for (let c = 0; c < buffer.numberOfChannels; c++) {
        const channelData = buffer.getChannelData(c);
        for (let i = 0; i < channelData.length; i++) {
            max = Math.max(max, Math.abs(channelData[i]));
        }
    }

    if (max === 0) return buffer;

    const targetPeak = Math.pow(10, -0.1 / 20);
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

const createDynamicEQ = (context: OfflineAudioContext, freq: number, gain: number) => {
  const eq = context.createBiquadFilter();
  eq.type = 'peaking';
  eq.frequency.value = freq;
  eq.gain.value = gain;

  const compressor = context.createDynamicsCompressor();
  compressor.threshold.value = -40;
  compressor.knee.value = 30;
  compressor.ratio.value = 12;
  compressor.attack.value = 0;
  compressor.release.value = 0.25;

  const gainNode = context.createGain();
  gainNode.gain.value = -gain; // Invert the gain for the sidechain

  eq.connect(compressor);
  compressor.connect(gainNode);
  gainNode.connect(eq.gain);

  return eq;
};

const processAudio = async (
  originalBuffer: AudioBuffer,
  settings: MasteringSettings
): Promise<AudioBuffer> => {
    const context = new OfflineAudioContext(
        originalBuffer.numberOfChannels,
        originalBuffer.length,
        originalBuffer.sampleRate
    );

    const source = context.createBufferSource();
    source.buffer = originalBuffer;

    let lastNode: AudioNode = source;

    if (settings.useDynamicEQ) {
      const dynamicEQ = createDynamicEQ(context, 8000, 3);
      lastNode.connect(dynamicEQ);
      lastNode = dynamicEQ;
    }

    const bassEQ = context.createBiquadFilter();
    bassEQ.type = 'lowshelf';
    bassEQ.frequency.value = settings.eq.bassFreq;
    bassEQ.gain.value = settings.eq.bassGain;
    lastNode.connect(bassEQ);
    lastNode = bassEQ;

    const trebleEQ = context.createBiquadFilter();
    trebleEQ.type = 'highshelf';
    trebleEQ.frequency.value = settings.eq.trebleFreq;
    trebleEQ.gain.value = settings.eq.trebleGain;
    lastNode.connect(trebleEQ);
    lastNode = trebleEQ;

    const lowpass = context.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = settings.crossover.lowPass;
    lowpass.Q.value = 0.71;

    const highpassForMid = context.createBiquadFilter();
    highpassForMid.type = 'highpass';
    highpassForMid.frequency.value = settings.crossover.lowPass;
    highpassForMid.Q.value =.71;

    const lowpassForMid = context.createBiquadFilter();
    lowpassForMid.type = 'lowpass';
    lowpassForMid.frequency.value = settings.crossover.highPass;
    lowpassForMid.Q.value = 0.71;

    const highpass = context.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = settings.crossover.highPass;
    highpass.Q.value = 0.71;

    const lowComp = createCompressor(context, settings.bands.low);
    const midComp = createCompressor(context, settings.bands.mid);
    const highComp = createCompressor(context, settings.bands.high);

    const lowGain = context.createGain();
    lowGain.gain.value = settings.bands.low.makeupGain;
    const midGain = context.createGain();
    midGain.gain.value = settings.bands.mid.makeupGain;
    const highGain = context.createGain();
    highGain.gain.value = settings.bands.high.makeupGain;

    const saturationNode = context.createWaveShaper();
    if (settings.saturation.amount > 0) {
        saturationNode.curve = createSaturationCurve(settings.saturation.amount);
        saturationNode.oversample = '4x';
    }

    const merger = context.createGain();
    const finalGain = context.createGain();
    finalGain.gain.value = settings.finalGain;
    const limiter = createCompressor(context, { ...settings.limiter, knee: 0, ratio: 20 });

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

    lastNode = merger;
    if (settings.saturation.amount > 0) {
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

self.onmessage = async (event) => {
  const { originalBuffer, settings } = event.data;
  const masteredBuffer = await processAudio(originalBuffer, settings);
  self.postMessage({ masteredBuffer });
};
