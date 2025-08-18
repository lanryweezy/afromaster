// This is the waveform worker file.
// The waveform data extraction logic will be moved here.

const extractWaveformData = (buffer: AudioBuffer, width: number) => {
  const data = buffer.getChannelData(0);
  const step = Math.ceil(data.length / width);
  const waveformData = new Float32Array(width * 2);

  for (let i = 0; i < width; i++) {
    let min = 1.0;
    let max = -1.0;
    for (let j = 0; j < step; j++) {
      const datum = data[(i * step) + j];
      if (datum < min) min = datum;
      if (datum > max) max = datum;
    }
    waveformData[i * 2] = min;
    waveformData[i * 2 + 1] = max;
  }

  return waveformData;
};

self.onmessage = (event) => {
  const { buffer, width } = event.data;
  const waveformData = extractWaveformData(buffer, width);
  self.postMessage({ waveformData });
};
