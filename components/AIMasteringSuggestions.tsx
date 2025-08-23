import React, { useState, useEffect } from 'react';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import Slider from './Slider';
import { IconSparkles, IconCheck, IconCog } from '../constants';
import { MasteringSettings } from '../types';

interface AIMasteringSuggestionsProps {
  isLoading: boolean;
  apiKey: string | undefined;
  error: string | null;
  handleGetAISettings: () => Promise<void>;
  aiStrength: number;
  setAiStrength: (strength: number) => void;
  aiSettings?: MasteringSettings; // Add this to show when AI settings are available
  hasGeneratedSettings?: boolean; // Add this to track if settings were generated
}

const AIMasteringSuggestions: React.FC<AIMasteringSuggestionsProps> = ({
  isLoading,
  apiKey,
  error,
  handleGetAISettings,
  aiStrength,
  setAiStrength,
  aiSettings,
  hasGeneratedSettings = false,
}) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Show success message when settings are generated
  useEffect(() => {
    if (hasGeneratedSettings && aiSettings) {
      setShowSuccessMessage(true);
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [hasGeneratedSettings, aiSettings]);

  return (
    <div>
      <h3 className="text-2xl font-heading text-primary mb-4 border-b-2 border-slate-700 pb-2">AI Suggestions</h3>
      
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg animate-fadeIn">
          <div className="flex items-center gap-3">
            <IconCheck className="w-6 h-6 text-green-400 flex-shrink-0" />
            <div>
              <h4 className="text-green-400 font-semibold">AI Settings Generated Successfully!</h4>
              <p className="text-green-300 text-sm mt-1">
                Your track has been analyzed and optimized settings have been created. 
                Adjust the AI Strength slider below to blend with your manual settings.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* AI Settings Status */}
      <div className="mb-6 text-center bg-slate-800/50 p-4 rounded-lg">
        {hasGeneratedSettings ? (
          <div className="flex items-center justify-center gap-3 mb-4">
            <IconCheck className="w-6 h-6 text-green-400" />
            <span className="text-green-400 font-semibold">AI Settings Generated Successfully!</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 mb-4">
            <IconCog className="w-6 h-6 text-slate-400" />
            <span className="text-slate-400">No AI settings generated yet</span>
          </div>
        )}
        
        <Button 
          onClick={handleGetAISettings} 
          isLoading={isLoading} 
          disabled={isLoading || !apiKey} 
          leftIcon={<IconSparkles className="w-5 h-5" />}
          variant={hasGeneratedSettings ? "secondary" : "primary"}
        >
          {apiKey 
            ? (hasGeneratedSettings ? 'Regenerate AI Settings' : 'Generate AI Settings') 
            : 'Configure API Key for AI'
          }
        </Button>
        
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      {isLoading && (
        <div className="my-6 text-center">
          <LoadingSpinner text="Analyzing your track and generating AI settings..." className="mb-4" />
          <p className="text-slate-300 text-sm">
            AI is analyzing your track characteristics and creating optimal mastering settings...
          </p>
        </div>
      )}

      {/* AI Settings Preview */}
      {hasGeneratedSettings && aiSettings && !isLoading && (
        <div className="mb-6 bg-slate-800/30 p-4 rounded-lg border border-slate-600">
          <h4 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
            <IconSparkles className="w-5 h-5" />
            AI-Generated Settings Preview
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {aiSettings.eq && (
              <div>
                <span className="text-slate-400">EQ Settings:</span>
                <div className="text-slate-300 ml-2">
                  Bass: {aiSettings.eq.bassGain > 0 ? '+' : ''}{aiSettings.eq.bassGain}dB @ {aiSettings.eq.bassFreq}Hz<br/>
                  Treble: {aiSettings.eq.trebleGain > 0 ? '+' : ''}{aiSettings.eq.trebleGain}dB @ {aiSettings.eq.trebleFreq}Hz
                </div>
              </div>
            )}
            {aiSettings.saturation && (
              <div>
                <span className="text-slate-400">Saturation:</span>
                <div className="text-slate-300 ml-2">
                  Amount: {aiSettings.saturation.amount}%
                </div>
              </div>
            )}
            {aiSettings.bands && (
              <div>
                <span className="text-slate-400">Compression:</span>
                <div className="text-slate-300 ml-2">
                  Low: {aiSettings.bands.low.threshold}dB<br/>
                  Mid: {aiSettings.bands.mid.threshold}dB<br/>
                  High: {aiSettings.bands.high.threshold}dB
                </div>
              </div>
            )}
            {aiSettings.limiter && (
              <div>
                <span className="text-slate-400">Limiter:</span>
                <div className="text-slate-300 ml-2">
                  Threshold: {aiSettings.limiter.threshold}dB
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Strength Slider */}
      <div className="pt-4 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-lg font-semibold text-slate-300">AI Strength</label>
          <span className="text-primary font-bold">{aiStrength}%</span>
        </div>
        <Slider
          label=""
          name="aiStrength"
          min={0} max={100} step={1}
          value={aiStrength}
          onChange={(e) => setAiStrength(parseInt(e.target.value))}
          unit="%"
        />
        <div className="text-center">
          <p className="text-slate-400 text-sm">
            {aiStrength === 0 && "Manual settings only"}
            {aiStrength > 0 && aiStrength < 50 && "Mostly manual with some AI influence"}
            {aiStrength >= 50 && aiStrength < 100 && "Balanced AI and manual control"}
            {aiStrength === 100 && "Full AI optimization"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIMasteringSuggestions;
