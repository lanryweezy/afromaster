import React from 'react';
import Button from '../components/Button';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import usePaystack from '../hooks/usePaystack';
import { getFunctions, httpsCallable } from 'firebase/functions';

import { useState } from 'react';

const BuyCreditsPage: React.FC = () => {
  const { setCurrentPage, user } = useAppContext();
  const payWithPaystack = usePaystack();
  const [currency, setCurrency] = useState('NGN');

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

  const handleBuy = (amount: number, currency: string) => {
    payWithPaystack({
      publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string,
      email: user?.email || '',
      amount: amount * 100, // Paystack expects amount in kobo/cents
      currency,
      onSuccess: async (reference) => {
        console.log('Payment successful:', reference);
        const functions = getFunctions();
        const verifyTransaction = httpsCallable(functions, 'verifyPaystackTransaction');
        try {
          const result = await verifyTransaction({ reference: reference.reference });
          console.log('Verification result:', result.data);
          alert('Credits added successfully!');
        } catch (error) {
          console.error('Verification failed:', error);
          alert('There was an error verifying your payment. Please contact support.');
        }
      },
      onClose: () => {
        console.log('Payment closed');
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-gradient-primary mb-4 text-center">
        Purchase Mastering Credits
      </h2>
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
      <div className="grid md:grid-cols-3 gap-8">
        {creditPackages[currency].map((pkg) => (
          <div key={pkg.credits} className="bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 p-6 rounded-xl shadow-lg text-center flex flex-col">
            <h3 className="text-2xl font-bold text-primary mb-2">{pkg.credits} Credit{pkg.credits > 1 && 's'}</h3>
            <p className="text-4xl font-semibold text-white mb-6">
              {pkg.currency === 'USD' && '$'}{pkg.price}{pkg.currency === 'NGN' && ' NGN'}
            </p>
            <Button onClick={() => handleBuy(pkg.price, pkg.currency)} className="w-full mt-auto">
              Buy Now
            </Button>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <button onClick={() => setCurrentPage(AppPage.DASHBOARD)} className="text-slate-400 hover:underline">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default BuyCreditsPage;