import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import useCreditPurchase from '../hooks/useCreditPurchase';
import CreditPackageCard from '../components/CreditPackageCard';
import CurrencyToggle from '../components/CurrencyToggle';

const BuyCreditsPage: React.FC = () => {
  const { setCurrentPage, user } = useAppContext();
  const [currency, setCurrency] = useState('NGN');
  // Removed purchaseError state and related handlers as they are now global

  const { handlePurchase } = useCreditPurchase({
    user,
    // Removed onSuccess, onError, onClose props as they are now handled globally
  });

  const creditPackages = {
    NGN: [
      { credits: 1, price: 5000, currency: 'NGN' },
      { credits: 5, price: 20000, currency: 'NGN' },
      { credits: 10, price: 35000, currency: 'NGN' },
    ],
    USD: [
      { credits: 1, price: 5, currency: 'USD' },
      { credits: 5, price: 22, currency: 'USD' },
      { credits: 10, price: 40, currency: 'USD' },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-gradient-primary mb-4 text-center">
        Purchase Mastering Credits
      </h2>
      <CurrencyToggle currency={currency} setCurrency={setCurrency} />
      <div className="grid md:grid-cols-3 gap-8">
        {creditPackages[currency].map((pkg) => (
          <CreditPackageCard
            key={pkg.credits}
            credits={pkg.credits}
            price={pkg.price}
            currency={pkg.currency}
            onBuy={handlePurchase}
          />
        ))}
      </div>
      {/* Removed purchaseError display as it is now global */}
      <div className="text-center mt-8">
        <button onClick={() => setCurrentPage(AppPage.DASHBOARD)} className="text-slate-400 hover:underline">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default BuyCreditsPage;
