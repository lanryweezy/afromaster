import Paystack from '@paystack/inline-js';

interface PaystackOptions {
  publicKey: string;
  email: string;
  amount: number;
  currency: string;
  onSuccess: (reference: {
    message: string;
    reference: string;
    status: string;
    trans: string;
    transaction: string;
    trxref: string;
  }) => void;
  onClose: () => void;
  metadata?: Record<string, any>;
}

const usePaystack = () => {
  const payWithPaystack = (options: PaystackOptions) => {
    console.log('Paystack Public Key:', options.publicKey);
    console.log('User Email:', options.email);
    console.log('Amount:', options.amount);
    console.log('Currency:', options.currency);

    if (!options.publicKey || !options.email || !options.amount) {
      throw new Error('Missing required Paystack parameters');
    }

    const config = {
      key: options.publicKey,
      email: options.email,
      amount: options.amount,
      currency: options.currency,
      ref: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      callback: options.onSuccess,
      onClose: options.onClose,
      metadata: options.metadata || {
        custom_fields: [
          {
            display_name: "Service",
            variable_name: "service",
            value: "AI Mastering Credits"
          }
        ]
      }
    };

    console.log('Paystack Config:', config);
    
    const paystack = new Paystack();
    paystack.newTransaction(config);
  };

  return payWithPaystack;
};

export default usePaystack;