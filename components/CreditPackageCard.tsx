import React from 'react';
import Button from './Button';

interface CreditPackageCardProps {
  credits: number;
  price: number;
  currency: string;
  onBuy: (pkg: { credits: number; price: number; currency: string }) => void;
}

const CreditPackageCard: React.FC<CreditPackageCardProps> = ({
  credits,
  price,
  currency,
  onBuy,
}) => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 p-6 rounded-xl shadow-lg text-center flex flex-col">
      <h3 className="text-2xl font-bold text-primary mb-2">{credits} Credit{credits > 1 && 's'}</h3>
      <p className="text-4xl font-semibold text-white mb-6">
        {currency === 'USD' && '$'}{price}{currency === 'NGN' && ' NGN'}
      </p>
      <Button onClick={() => onBuy({ credits, price, currency })} className="w-full mt-auto">
        Buy Now
      </Button>
    </div>
  );
};

export default CreditPackageCard;