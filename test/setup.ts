// Mock Vite's import.meta.env for Jest
 
(global as any).import = {
  meta: {
    env: {
      VITE_PAYSTACK_PUBLIC_KEY: 'pk_test_123',
      VITE_GEMINI_API_KEY: 'test_gemini_key',
      VITE_FIREBASE_API_KEY: 'test_firebase_api_key',
      VITE_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
      VITE_FIREBASE_PROJECT_ID: 'test-project',
      VITE_FIREBASE_STORAGE_BUCKET: 'test-project.appspot.com',
      VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
      VITE_FIREBASE_APP_ID: 'test_app_id',
      VITE_FIREBASE_MEASUREMENT_ID: 'test_measurement_id',
    },
  },
};

// Mock AudioContext for tests
 
(window as any).AudioContext = class MockAudioContext {
  currentTime = 0;
  sampleRate = 44100;
  state = 'running';
  destination = {
    connect: () => {},
  };

  createBufferSource() {
    return {
      connect: () => {},
      start: () => {},
      stop: () => {},
      buffer: null,
    };
  }

  createGain() {
    return {
      connect: () => {},
      gain: { value: 1 },
    };
  }

  createBiquadFilter() {
    return {
      connect: () => {},
      type: 'lowpass',
      frequency: { value: 1000 },
      Q: { value: 1 },
      gain: { value: 0 },
    };
  }

  createDynamicsCompressor() {
    return {
      connect: () => {},
      threshold: { value: -24 },
      knee: { value: 30 },
      ratio: { value: 12 },
      attack: { value: 0.003 },
      release: { value: 0.25 },
    };
  }

  createBuffer() {
    return {
      getChannelData: () => new Float32Array(44100),
      copyFromChannel: () => {},
      copyToChannel: () => {},
      duration: 1,
      length: 44100,
      numberOfChannels: 2,
      sampleRate: 44100,
    };
  }

  decodeAudioData() {
    return Promise.resolve({
      getChannelData: () => new Float32Array(44100),
      copyFromChannel: () => {},
      copyToChannel: () => {},
      duration: 1,
      length: 44100,
      numberOfChannels: 2,
      sampleRate: 44100,
    });
  }

  suspend() {
    return Promise.resolve();
  }

  resume() {
    return Promise.resolve();
  }

  close() {
    return Promise.resolve();
  }
};

// Mock OfflineAudioContext
 
(window as any).OfflineAudioContext = class MockOfflineAudioContext extends (window as any).AudioContext {
  numberOfChannels: number;
  length: number;
  sampleRate: number;

  constructor(numberOfChannels: number, length: number, sampleRate: number) {
    super();
    this.numberOfChannels = numberOfChannels;
    this.length = length;
    this.sampleRate = sampleRate;
  }

  startRendering() {
    return Promise.resolve({
      getChannelData: () => new Float32Array(this.length),
      copyFromChannel: () => {},
      copyToChannel: () => {},
      duration: this.length / this.sampleRate,
      length: this.length,
      numberOfChannels: this.numberOfChannels,
      sampleRate: this.sampleRate,
    });
  }
};

// Mock Worker
 
(window as any).Worker = class MockWorker {
   
  onmessage: ((event: any) => void) | null = null;
   
  onerror: ((event: any) => void) | null = null;

  constructor() {}
  postMessage() {}
  terminate() {}
  addEventListener() {}
  removeEventListener() {}
};

// Mock URL.createObjectURL
 
(URL as any).createObjectURL = () => 'mock-url';

// Mock URL.revokeObjectURL
 
(URL as any).revokeObjectURL = () => {};
