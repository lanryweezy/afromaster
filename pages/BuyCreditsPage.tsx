import React from 'react';
import Button from '../components/Button';
import { useAppContext } from '../contexts/AppContext';
import { AppPage } from '../types';
import { IconSparkles, IconCheckCircle } from '../constants';

const BuyCreditsPage: React.FC = () => {
  const { setCurrentPage } = useAppContext();

  const plans = [
    { name: 'Basic', credits: 5, price: '₦2,500', icon: '🎵' },
    { name: 'Pro', credits: 20, price: '₦7,500', icon: '🚀', popular: true },
    { name: 'Ultimate', credits: 100, price: '₦25,000', icon: '👑' },
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-heading font-bold text-white mb-4">Fuel Your Creativity</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">Get high-quality masters with zero monthly commitment. Only pay for what you release.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.name} className={`relative p-8 rounded-2xl border transition-all ${plan.popular ? 'bg-indigo-900/20 border-primary shadow-2xl scale-105 z-10' : 'bg-slate-900/40 border-slate-800'}`}>
            {plan.popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">Most Popular</span>}
            <div className="text-4xl mb-6">{plan.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
            <p className="text-primary text-3xl font-bold mb-6">{plan.price}</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-sm text-slate-300"><IconCheckCircle className="w-4 h-4 text-primary mr-2" /> {plan.credits} HQ Masters</li>
              <li className="flex items-center text-sm text-slate-300"><IconCheckCircle className="w-4 h-4 text-primary mr-2" /> AI Variation Access</li>
              <li className="flex items-center text-sm text-slate-300"><IconCheckCircle className="w-4 h-4 text-primary mr-2" /> .WAV Export</li>
            </ul>
            <Button variant={plan.popular ? 'primary' : 'ghost'} className="w-full">Choose {plan.name}</Button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button onClick={() => setCurrentPage(AppPage.UPLOAD)} className="text-slate-500 hover:text-white transition-colors">Maybe later</button>
      </div>
    </div>
  );
};

export default BuyCreditsPage;