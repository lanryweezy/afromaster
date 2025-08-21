import React from 'react';

interface CurrencyToggleProps {
  currency: string;
  setCurrency: (currency: string) => void;
}

const CurrencyToggle: React.FC<CurrencyToggleProps> = ({
  currency,
  setCurrency,
}) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-slate-800 p-1 rounded-full flex items-center">
        <button onClick={() => setCurrency('NGN')} className={`px-4 py-1 rounded-full text-sm font-semibold ${currency === 'NGN' ? 'bg-primary text-white' : 'text-slate-400'}`}>
          NGN
        </button>
        <button onClick={() => setCurrency('USD')} className={`px-4 py-1 rounded-full text-sm font-semibold ${currency === 'USD' ? 'bg-primary text-white' : 'text-slate-400'}`}>
          USD
        </button>
      </div>
    </div>
  );
};

export default CurrencyToggle;
