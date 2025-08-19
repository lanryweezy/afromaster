import Paystack from '@paystack/inline-js';
import { useAppContext } from '../contexts/AppContext';

interface PaystackOptions {
  publicKey: string;
  email: string;
  amount: number;
  currency: string;
  onSuccess: (reference: any) => void;
  onClose: () => void;
}

const usePaystack = () => {
  const { user } = useAppContext();

  const payWithPaystack = (options: PaystackOptions) => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    const paystack = new Paystack({
      key: options.publicKey,
      email: options.email,
      amount: options.amount,
      currency: options.currency,
      onSuccess: options.onSuccess,
      onClose: options.onClose,
    });
    paystack.checkout();
  };

  return payWithPaystack;
};

export default usePaystack;