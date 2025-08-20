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
    const paystack = new Paystack({
      key: options.publicKey || 'pk_test_6146052219e487843de3295e82645371235b2639',
      email: options.email || 'demo.user@example.com',
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