import { MasteringSettings } from '../types';
import { Genre, LoudnessTarget, StereoWidth } from '../constants';

export class EnhancedAudioProcessor {
  
  async processAudio(
    audioBuffer: AudioBuffer, 
    settings: MasteringSettings,
    onProgress?: (progress: number, stage: string) => void
  ): Promise<AudioBuffer> {
    onProgress?.(0, 'Initializing advanced processing...');
    
    // Stage 1: Pre-processing
    onProgress?.(10, 'Pre-processing audio...');
    let processedBuffer = await this.preProcess(audioBuffer, settings);
    
    // Stage 2: Genre-specific enhancement
    onProgress?.(25, 'Applying genre-specific processing...');
    processedBuffer = await this.applyGenreEnhancement(processedBuffer, settings.genre);
    
    // Stage 3: Dynamic EQ
    onProgress?.(40, 'Applying dynamic EQ...');
    processedBuffer = await this.applyDynamicEQ(processedBuffer, settings);
    
    // Stage 4: Multi-band compression
    onProgress?.(55, 'Applying multi-band compression...');
    processedBuffer = await this.applyMultiBandCompression(processedBuffer, settings);
    
    // Stage 5: Stereo enhancement
    onProgress?.(70, 'Enhancing stereo field...');
    processedBuffer = await this.applyStereoEnhancement(processedBuffer, settings.stereoWidth);
    
    // Stage 6: Harmonic saturation
    onProgress?.(80, 'Applying harmonic saturation...');
    processedBuffer = await this.applySaturation(processedBuffer, settings.saturation);
    
    // Stage 7: Loudness maximization
    onProgress?.(90, 'Maximizing loudness...');
    processedBuffer = await this.applyLoudnessMaximization(processedBuffer, settings.loudnessTarget as LoudnessTarget);
    
    // Stage 8: Final limiting
    onProgress?.(95, 'Applying final limiting...');
    processedBuffer = await this.applyFinalLimiting(processedBuffer, settings);
    
    onProgress?.(100, 'Advanced processing complete!');
    return processedBuffer;
  }

  private async preProcess(audioBuffer: AudioBuffer, settings: MasteringSettings): Promise<AudioBuffer> {
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;

    const preGain = offlineContext.createGain();
    preGain.gain.value = settings.preGain;

    source.connect(preGain);
    preGain.connect(offlineContext.destination);
    source.start();
    
    return await offlineContext.startRendering();
  }

  private async applyGenreEnhancement(audioBuffer: AudioBuffer, genre: Genre): Promise<AudioBuffer> {
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;

    switch (genre) {
      case Genre.HIPHOP:
        const hipHopEQ = offlineContext.createBiquadFilter();
        hipHopEQ.type = 'lowshelf';
        hipHopEQ.frequency.value = 80;
        hipHopEQ.gain.value = 3;
        source.connect(hipHopEQ);
        hipHopEQ.connect(offlineContext.destination);
        break;

      case Genre.AFROBEATS:
        const afroEQ = offlineContext.createBiquadFilter();
        afroEQ.type = 'peaking';
        afroEQ.frequency.value = 2000;
        afroEQ.Q.value = 1;
        afroEQ.gain.value = 2;
        source.connect(afroEQ);
        afroEQ.connect(offlineContext.destination);
        break;

      case Genre.EDM:
        const edmLow = offlineContext.createBiquadFilter();
        edmLow.type = 'lowshelf';
        edmLow.frequency.value = 60;
        edmLow.gain.value = 4;
        source.connect(edmLow);
        edmLow.connect(offlineContext.destination);
        break;

      default:
        source.connect(offlineContext.destination);
    }

    source.start();
    return await offlineContext.startRendering();
  }

  private async applyDynamicEQ(audioBuffer: AudioBuffer, settings: MasteringSettings): Promise<AudioBuffer> {
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;

    // Bass EQ
    const bassEQ = offlineContext.createBiquadFilter();
    bassEQ.type = 'lowshelf';
    bassEQ.frequency.value = settings.eq.bassFreq;
    bassEQ.gain.value = settings.eq.bassGain;

    // Treble EQ
    const trebleEQ = offlineContext.createBiquadFilter();
    trebleEQ.type = 'highshelf';
    trebleEQ.frequency.value = settings.eq.trebleFreq;
    trebleEQ.gain.value = settings.eq.trebleGain;

    source.connect(bassEQ);
    bassEQ.connect(trebleEQ);
    trebleEQ.connect(offlineContext.destination);
    source.start();
    
    return await offlineContext.startRendering();
  }

  private async applyMultiBandCompression(audioBuffer: AudioBuffer, settings: MasteringSettings): Promise<AudioBuffer> {
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;

    // Low band
    const lowSplit = offlineContext.createBiquadFilter();
    lowSplit.type = 'lowpass';
    lowSplit.frequency.value = 200;
    
    const lowComp = offlineContext.createDynamicsCompressor();
    lowComp.threshold.value = settings.bands.low.threshold;
    lowComp.ratio.value = settings.bands.low.ratio;
    lowComp.attack.value = settings.bands.low.attack;
    lowComp.release.value = settings.bands.low.release;
    lowComp.knee.value = settings.bands.low.knee;

    // Mid band
    const midSplit = offlineContext.createBiquadFilter();
    midSplit.type = 'bandpass';
    midSplit.frequency.value = 1000;
    midSplit.Q.value = 1;
    
    const midComp = offlineContext.createDynamicsCompressor();
    midComp.threshold.value = settings.bands.mid.threshold;
    midComp.ratio.value = settings.bands.mid.ratio;
    midComp.attack.value = settings.bands.mid.attack;
    midComp.release.value = settings.bands.mid.release;
    midComp.knee.value = settings.bands.mid.knee;

    // High band
    const highSplit = offlineContext.createBiquadFilter();
    highSplit.type = 'highpass';
    highSplit.frequency.value = 4000;
    
    const highComp = offlineContext.createDynamicsCompressor();
    highComp.threshold.value = settings.bands.high.threshold;
    highComp.ratio.value = settings.bands.high.ratio;
    highComp.attack.value = settings.bands.high.attack;
    highComp.release.value = settings.bands.high.release;
    highComp.knee.value = settings.bands.high.knee;

    // Connect multi-band chain
    source.connect(lowSplit);
    source.connect(midSplit);
    source.connect(highSplit);
    
    lowSplit.connect(lowComp);
    midSplit.connect(midComp);
    highSplit.connect(highComp);
    
    // Mix the bands back together
    const mixer = offlineContext.createGain();
    mixer.gain.value = 1.0;
    
    lowComp.connect(mixer);
    midComp.connect(mixer);
    highComp.connect(mixer);
    
    mixer.connect(offlineContext.destination);

    source.start();
    return await offlineContext.startRendering();
  }

  private async applyStereoEnhancement(audioBuffer: AudioBuffer, stereoWidth: StereoWidth): Promise<AudioBuffer> {
    if (audioBuffer.numberOfChannels < 2) return audioBuffer;

    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;

    // Create stereo enhancement for both channels
    const leftChannel = offlineContext.createGain();
    const rightChannel = offlineContext.createGain();
    
    // Split the stereo signal
    const splitter = offlineContext.createChannelSplitter(2);
    source.connect(splitter);
    
    // Apply different processing to each channel based on stereo width
    let leftGain = 1.0;
    let rightGain = 1.0;
    
    switch (stereoWidth) {
      case StereoWidth.WIDE:
        leftGain = 1.2;
        rightGain = 1.2;
        break;
      case StereoWidth.STANDARD:
        leftGain = 1.1;
        rightGain = 1.1;
        break;
      case StereoWidth.FOCUSED:
        leftGain = 1.0;
        rightGain = 1.0;
        break;
      case StereoWidth.MONO_COMPATIBLE:
        leftGain = 0.9;
        rightGain = 0.9;
        break;
      default:
        leftGain = 1.0;
        rightGain = 1.0;
    }
    
    leftChannel.gain.value = leftGain;
    rightChannel.gain.value = rightGain;
    
    // Connect channels
    splitter.connect(leftChannel, 0);
    splitter.connect(rightChannel, 1);
    
    // Mix back to stereo
    const merger = offlineContext.createChannelMerger(2);
    leftChannel.connect(merger, 0, 0);
    rightChannel.connect(merger, 0, 1);
    
    merger.connect(offlineContext.destination);
    source.start();
    
    return await offlineContext.startRendering();
  }

  private async applySaturation(audioBuffer: AudioBuffer, saturation: { amount: number; flavor: string }): Promise<AudioBuffer> {
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;

    const waveshaper = offlineContext.createWaveShaper();
    const curve = new Float32Array(4096);
    
    for (let i = 0; i < 4096; i++) {
      const x = (i * 2) / 4096 - 1;
      
      switch (saturation.flavor) {
        case 'tube':
          curve[i] = Math.sign(x) * (1 - Math.exp(-Math.abs(x) * saturation.amount));
          break;
        case 'tape':
          curve[i] = Math.tanh(x * saturation.amount);
          break;
        case 'fuzz':
          curve[i] = Math.sign(x) * Math.min(Math.abs(x) * saturation.amount, 0.8);
          break;
        default:
          curve[i] = Math.tanh(x * saturation.amount);
      }
    }
    
    waveshaper.curve = curve;
    waveshaper.oversample = '4x';

    source.connect(waveshaper);
    waveshaper.connect(offlineContext.destination);
    source.start();
    
    return await offlineContext.startRendering();
  }

  private async applyLoudnessMaximization(audioBuffer: AudioBuffer, loudnessTarget: LoudnessTarget): Promise<AudioBuffer> {
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;

    const limiter = offlineContext.createDynamicsCompressor();
    limiter.threshold.value = -1;
    limiter.ratio.value = 20;
    limiter.attack.value = 0.001;
    limiter.release.value = 0.01;

    const gainNode = offlineContext.createGain();
    
    switch (loudnessTarget) {
      case LoudnessTarget.CLUB:
        gainNode.gain.value = 1.8;
        break;
      case LoudnessTarget.STREAMING_LOUD:
        gainNode.gain.value = 1.5;
        break;
      case LoudnessTarget.STREAMING_STANDARD:
        gainNode.gain.value = 1.2;
        break;
      case LoudnessTarget.VINYL:
        gainNode.gain.value = 1.0;
        break;
      default:
        gainNode.gain.value = 1.3;
    }

    source.connect(limiter);
    limiter.connect(gainNode);
    gainNode.connect(offlineContext.destination);
    source.start();
    
    return await offlineContext.startRendering();
  }

  private async applyFinalLimiting(audioBuffer: AudioBuffer, settings: MasteringSettings): Promise<AudioBuffer> {
    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;

    const finalLimiter = offlineContext.createDynamicsCompressor();
    finalLimiter.threshold.value = settings.limiter.threshold;
    finalLimiter.ratio.value = 10;
    finalLimiter.attack.value = settings.limiter.attack;
    finalLimiter.release.value = settings.limiter.release;

    const outputGain = offlineContext.createGain();
    outputGain.gain.value = settings.finalGain;

    source.connect(finalLimiter);
    finalLimiter.connect(outputGain);
    outputGain.connect(offlineContext.destination);
    source.start();
    
    return await offlineContext.startRendering();
  }
}

export const enhancedAudioProcessor = new EnhancedAudioProcessor();
