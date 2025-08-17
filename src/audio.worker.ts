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

const createSaturationCurve = (amount: number, flavor: string): Float32Array => {
    const k = amount;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    let x;
    for (let i = 0; i < n_samples; i++) {
        x = i * 2 / n_samples - 1;
        switch (flavor) {
            case 'tube':
                curve[i] = x - (x * x * x / 3);
                break;
            case 'fuzz':
                curve[i] = Math.sign(x);
                break;
            case 'tape':
            default:
                curve[i] = Math.tanh(k * x) / Math.tanh(k);
                break;
        }
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
    highpassForMid.Q.value = 0.71;

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
        saturationNode.curve = createSaturationCurve(settings.saturation.amount, settings.saturation.flavor);
        saturationNode.oversample = '4x';
    }

    const merger = context.createGain();
    const finalGain = context.createGain();
    finalGain.gain.value = settings.finalGain;
    const limiter = createCompressor(context, { ...settings.limiter, knee: 0, ratio: 20 });

    const preamp = context.createGain();
    preamp.gain.value = settings.preGain;
    lastNode.connect(preamp);

    preamp.connect(lowpass);
    lowpass.connect(lowComp);
    lowComp.connect(lowGain);
    lowGain.connect(merger);

    const midBand = context.createGain();
    preamp.connect(highpassForMid);
    highpassForMid.connect(lowpassForMid);
    lowpassForMid.connect(midBand);
    midBand.connect(midComp);
    midComp.connect(midGain);
    midGain.connect(merger);

    preamp.connect(highpass);
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

    if (settings.reverb.impulseResponse !== 'none') {
      const reverb = await createReverb(context, settings.reverb);
      limiter.connect(reverb.wet);
      limiter.connect(reverb.dry);
      reverb.output.connect(context.destination);
    } else {
      limiter.connect(context.destination);
    }

    source.start(0);

    const renderedBuffer = await context.startRendering();

    return normalizeBuffer(renderedBuffer);
};

const createReverb = async (context: OfflineAudioContext, settings: { impulseResponse: string, wetDryMix: number }) => {
  const convolver = context.createConvolver();
  const response = await fetch(`/irs/${settings.impulseResponse}`);
  const buffer = await response.arrayBuffer();
  convolver.buffer = await context.decodeAudioData(buffer);

  const wet = context.createGain();
  wet.gain.value = settings.wetDryMix;

  const dry = context.createGain();
  dry.gain.value = 1 - settings.wetDryMix;

  const output = context.createGain();

  wet.connect(convolver);
  convolver.connect(output);
  dry.connect(output);

  return { wet, dry, output };
};

self.onmessage = async (event) => {
  const { originalBuffer, settings } = event.data;
  const masteredBuffer = await processAudio(originalBuffer, settings);
  self.postMessage({ masteredBuffer });
};
