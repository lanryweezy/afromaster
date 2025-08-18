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

    const paystack = new Paystack();
    paystack.checkout({
      ...options,
      email: user.email || '',
    });
  };

  return payWithPaystack;
};

export default usePaystack;
