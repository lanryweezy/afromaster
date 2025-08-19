import React from 'react';
import Slider from './Slider';

const DynamicEQ: React.FC = () => {
  return (
    <div className="p-4 rounded-lg bg-slate-800/50">
      <h4 className="text-lg font-semibold text-primary-focus mb-4">Dynamic EQ</h4>
      <div className="space-y-4">
        <Slider label="Low Band" min={-12} max={12} step={0.5} value={0} onChange={() => {}} unit="dB" />
        <Slider label="Mid Band" min={-12} max={12} step={0.5} value={0} onChange={() => {}} unit="dB" />
        <Slider label="High Band" min={-12} max={12} step={0.5} value={0} onChange={() => {}} unit="dB" />
      </div>
    </div>
  );
};

export default DynamicEQ;
