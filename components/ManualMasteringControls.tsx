import React from 'react';
import Dropdown from './Dropdown';
import FileUpload from './FileUpload';
import Slider from './Slider';
import { MasteringSettings } from '../types';
import { LoudnessTarget, GENRE_OPTIONS, LOUDNESS_TARGET_OPTIONS, TONE_PREFERENCE_OPTIONS, STEREO_WIDTH_OPTIONS } from '../constants';

interface ManualMasteringControlsProps {
  currentSettings: MasteringSettings;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleReferenceFileAccepted: (file: File) => Promise<void>;
  handleReferenceFileCleared: () => void;
}

const ManualMasteringControls: React.FC<ManualMasteringControlsProps> = ({
  currentSettings,
  handleInputChange,
  handleReferenceFileAccepted,
  handleReferenceFileCleared,
}) => {
  return (
    <div>
      <h3 className="text-2xl font-heading text-primary-focus transition-colors mb-4 border-b-2 border-slate-700 pb-2">Manual Controls</h3>
      <div className="space-y-4">
        <Dropdown label="Genre" name="genre" options={GENRE_OPTIONS} value={currentSettings.genre} onChange={handleInputChange} />
        <Dropdown label="Target Loudness" name="loudnessTarget" options={LOUDNESS_TARGET_OPTIONS} value={currentSettings.loudnessTarget as LoudnessTarget} onChange={handleInputChange} />
        {currentSettings.loudnessTarget === LoudnessTarget.CUSTOM && (
          <div className="pl-4 border-l-2 border-slate-700">
            <label htmlFor="customLoudnessValue" className="block text-sm font-medium text-slate-300 mb-2">Custom LUFS Value (e.g. -12)</label>
            <input
              type="number"
              name="customLoudnessValue"
              id="customLoudnessValue"
              value={currentSettings.customLoudnessValue || ''}
              onChange={handleInputChange}
              placeholder="-14"
              step="0.1"
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg shadow-sm focus:ring-primary focus:border-primary transition-colors"
            />
          </div>
        )}
        <Dropdown label="Tone Preference" name="tonePreference" options={TONE_PREFERENCE_OPTIONS} value={currentSettings.tonePreference} onChange={handleInputChange} />
        <Dropdown label="Stereo Width" name="stereoWidth" options={STEREO_WIDTH_OPTIONS} value={currentSettings.stereoWidth} onChange={handleInputChange} />

        <div className="pt-4 space-y-6">
          <Slider
            label="Compression Intensity"
            name="compressionAmount"
            min={0} max={100} step={1}
            value={currentSettings.compressionAmount}
            onChange={handleInputChange}
            unit="%"
          />
          <Dropdown
            label="Saturation Flavor"
            name="saturation.flavor"
            options={['tape', 'tube', 'fuzz']} // Array of string values
            optionDisplayNames={{ // Map values to labels
              'tape': 'Warm Tape',
              'tube': 'Tube',
              'fuzz': 'Fuzz',
            }}
            value={currentSettings.saturation?.flavor || 'tape'}
            onChange={handleInputChange}
          />
          <Slider
            label="Analog Saturation"
            name="saturation.amount"
            min={0} max={100} step={1}
            value={currentSettings.saturation?.amount || 0}
            onChange={handleInputChange}
            unit="%"
          />
          <Slider
            label="Bass Emphasis"
            name="bassBoost"
            min={-6} max={6} step={0.5}
            value={currentSettings.bassBoost}
            onChange={handleInputChange}
            unit="dB"
          />
          <Slider
            label="Treble Emphasis"
            name="trebleBoost"
            min={-6} max={6} step={0.5}
            value={currentSettings.trebleBoost}
            onChange={handleInputChange}
            unit="dB"
          />
        </div>

        <div className="pt-4">
          <h4 className="text-lg font-semibold text-primary-focus mb-2">Creative Effects</h4>
          <Dropdown
            label="Reverb"
            name="reverb.impulseResponse"
            options={['none', 'small_drum_room.wav', 'nice_drum_room.wav', 'large_long_echo_hall.wav', 'masonic_lodge.wav']} // Array of string values
            optionDisplayNames={{ // Map values to labels
              'none': 'None',
              'small_drum_room.wav': 'Small Drum Room',
              'nice_drum_room.wav': 'Nice Drum Room',
              'large_long_echo_hall.wav': 'Large Hall',
              'masonic_lodge.wav': 'Masonic Lodge',
            }}
            value={currentSettings.reverb.impulseResponse}
            onChange={handleInputChange}
          />
          <Slider
            label="Reverb Mix"
            name="reverb.wetDryMix"
            min={0} max={1} step={0.01}
            value={currentSettings.reverb.wetDryMix}
            onChange={handleInputChange}
            unit="%"
          />
        </div>

        <div className="pt-4">
          <FileUpload
            label="Match a Reference Track (Optional)"
            onFileAccepted={handleReferenceFileAccepted}
            onFileCleared={handleReferenceFileCleared}
            existingFile={currentSettings.referenceTrackFile || null}
            id="reference-track-upload"
          />
        </div>
      </div>
    </div>
  );
};

export default ManualMasteringControls;
