import React from 'react';

interface CurrencyToggleProps {
  currency: string;
  setCurrency: (currency: string) => void;
  disabled?: boolean;
}

const CurrencyToggle: React.FC<CurrencyToggleProps> = ({
  currency,
  setCurrency,
  disabled = false
}) => {
  const currencies = [
    { code: 'NGN', symbol: '₦', label: 'Nigerian Naira' },
    { code: 'USD', symbol: '$', label: 'US Dollar' }
  ];

  return (
    <div className="flex justify-center mb-8">
      <div className="relative bg-slate-800/50 backdrop-blur-sm p-1 rounded-2xl flex items-center border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
        {/* Sliding background indicator */}
        <div 
          className="absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] bg-gradient-to-r from-orange-500 to-red-600 rounded-xl transition-all duration-500 ease-out shadow-lg shadow-orange-500/50"
          style={{
            transform: currency === 'USD' ? 'translateX(calc(100% + 4px))' : 'translateX(0%)'
          }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl opacity-50 blur-sm"></div>
        </div>

        {currencies.map((curr) => (
          <button
            key={curr.code}
            onClick={() => !disabled && setCurrency(curr.code)}
            disabled={disabled}
            className={`relative z-10 px-6 py-2 rounded-xl text-sm font-semibold transition-all duration-300 min-w-[80px] flex items-center justify-center space-x-1 ${
              currency === curr.code
                ? 'text-white drop-shadow-sm'
                : 'text-slate-400 hover:text-slate-300'
            } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            title={curr.label}
            aria-label={`Switch to ${curr.label}`}
          >
            <span className="text-lg">{curr.symbol}</span>
            <span>{curr.code}</span>
          </button>
        ))}

        {/* Decorative gradient border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/20 via-transparent to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default CurrencyToggle;
