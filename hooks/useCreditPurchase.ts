import { useCallback } from 'react';
import usePaystack from './usePaystack';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { User } from 'firebase/auth';
import { useAppContext } from '../contexts/AppContext';

interface CreditPackage {
  credits: number;
  price: number;
  currency: string;
}

interface UseCreditPurchaseOptions {
  user: User | null;
}

const useCreditPurchase = ({ user }: UseCreditPurchaseOptions) => {
  const payWithPaystack = usePaystack();
  const { setIsLoading, setErrorMessage } = useAppContext();

  const handlePurchase = useCallback(async (pkg: CreditPackage) => {
    setIsLoading(true);
    setErrorMessage(null);

    if (!user || !user.email) {
      setErrorMessage("User not logged in or email not available.");
      setIsLoading(false);
      return;
    }

    console.log('Received pkg:', pkg);
    
    payWithPaystack({
      publicKey: (import.meta as any).env.VITE_PAYSTACK_PUBLIC_KEY as string,
      email: user.email,
      amount: pkg.price * 100, // Paystack expects amount in kobo for NGN, cents for USD
      currency: pkg.currency,
      onSuccess: async (reference) => {
        console.log('Payment successful:', reference);
        const functions = getFunctions();
        const verifyTransaction = httpsCallable(functions, 'verifyPaystackTransaction');
        try {
          const result = await verifyTransaction({ reference: reference.reference });
          console.log('Verification result:', result.data);
          if ((result.data as { success: boolean; message?: string })?.success) {
            // Optionally, show a success message globally if needed
          } else {
            setErrorMessage((result.data as { message?: string })?.message || 'Payment verification failed.');
          }
        } catch (error: unknown) {
          console.error('Verification failed:', error);
          if (error instanceof Error) {
            setErrorMessage(`Payment verification failed: ${error.message}`);
          } else {
            setErrorMessage("Payment verification failed: Unknown error");
          }
        } finally {
          setIsLoading(false);
        }
      },
      onClose: () => {
        console.log('Payment closed');
        setIsLoading(false);
        setErrorMessage('Payment process cancelled.');
      },
    });
  }, [user, payWithPaystack, setIsLoading, setErrorMessage]);

  return { handlePurchase };
};

export default useCreditPurchase;
