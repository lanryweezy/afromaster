import React from 'react';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import Slider from './Slider';
import { IconSparkles } from '../constants';

interface AIMasteringSuggestionsProps {
  isLoading: boolean;
  apiKey: string | undefined;
  error: string | null;
  handleGetAISettings: () => Promise<void>;
  aiStrength: number;
  setAiStrength: (strength: number) => void;
}

const AIMasteringSuggestions: React.FC<AIMasteringSuggestionsProps> = ({
  isLoading,
  apiKey,
  error,
  handleGetAISettings,
  aiStrength,
  setAiStrength,
}) => {
  return (
    <div>
      <h3 className="text-2xl font-heading text-primary mb-4 border-b-2 border-slate-700 pb-2">AI Suggestions</h3>
      <div className="mb-6 text-center bg-slate-800/50 p-4 rounded-lg">
        <Button onClick={handleGetAISettings} isLoading={isLoading} disabled={isLoading || !apiKey} leftIcon={<IconSparkles className="w-5 h-5" />}>
          {apiKey ? 'Generate AI Settings' : 'Configure API Key for AI'}
        </Button>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      {isLoading && <LoadingSpinner text="Generating AI Settings..." className="my-6" />}

      <div className="pt-4 space-y-6">
        <Slider
          label="AI Strength"
          name="aiStrength"
          min={0} max={100} step={1}
          value={aiStrength}
          onChange={(e) => setAiStrength(parseInt(e.target.value))}
          unit="%"
        />
      </div>
    </div>
  );
};

export default AIMasteringSuggestions;
