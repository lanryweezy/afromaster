import React from 'react';
import { Stem, StemType } from '../types';
import Slider from './Slider';
import { IconMusicNote } from '../constants';

interface StemMixerProps {
  stems: Stem[];
  onGainChange: (stemId: string, gain: number) => void;
}

const StemMixer: React.FC<StemMixerProps> = ({ stems, onGainChange }) => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 p-6 rounded-2xl shadow-xl">
      <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            <IconMusicNote className="w-5 h-5 mr-2 text-primary" /> AI Stem Balance
          </h3>
          <span className="px-2 py-1 rounded bg-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest border border-indigo-500/30">Pre-Sum Mixer</span>
      </div>

      <div className="grid gap-6">
        {stems.map((stem) => (
          <div key={stem.id} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/30">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-sm font-medium text-white truncate max-w-[200px]">{stem.name}</p>
                <span className="text-[10px] uppercase font-bold text-slate-500">{stem.type}</span>
              </div>
              <div className="text-xs font-mono text-indigo-400 font-bold">
                {(20 * Math.log10(stem.gain)).toFixed(1)} dB
              </div>
            </div>
            
            <Slider 
              label="" 
              name={stem.id} 
              min={0} 
              max={2} 
              step={0.01} 
              value={stem.gain} 
              onChange={(e) => onGainChange(stem.id, parseFloat(e.target.value))} 
              unit="x"
            />
            
            <div className="flex justify-between mt-2">
                <span className="text-[9px] text-slate-600 font-bold uppercase">-∞</span>
                <span className="text-[9px] text-slate-600 font-bold uppercase">Unity</span>
                <span className="text-[9px] text-slate-600 font-bold uppercase">+6dB</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
          <p className="text-[10px] text-indigo-300 leading-relaxed italic text-center">
            "AI suggests these gain levels to prevent masking and ensure the vocals sit perfectly in the master."
          </p>
      </div>
    </div>
  );
};

export default StemMixer;