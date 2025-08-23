// Paystack Configuration Interface
// interface PaystackConfig {
//   key: string;
//   email: string;
//   amount: number;
//   currency: string;
//   metadata?: Record<string, string>;
//   callback: (response: { reference: string; message: string; status: string; trans: string; transaction: string; trxref: string; redirecturl: string }) => void;
//   onClose: () => void;
// }

// This tells TypeScript that PaystackPop is a global variable provided by the script
// declare const PaystackPop: {
//   setup: (config: PaystackConfig) => {
//     openIframe: () => void;
//   };
// };

// Real Paystack payment integration (this is now handled by usePaystack hook)
// This service is now deprecated in favor of the hook-based approach

// Real credit deduction using Firebase
import { User } from 'firebase/auth';
import { doc, runTransaction } from 'firebase/firestore';
import { db } from '../src/firebaseConfig';

export const deductCredits = async (user: User, amount: number = 1): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', user.uid);
    
    const success = await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists()) {
        // Create user with 0 credits if they don't exist
        transaction.set(userRef, { 
          credits: 0, 
          email: user.email,
          createdAt: new Date()
        });
        return false; // Not enough credits
      }
      
      const currentCredits = userDoc.data()?.credits || 0;
      
      if (currentCredits < amount) {
        return false; // Not enough credits
      }
      
      const newCredits = currentCredits - amount;
      transaction.update(userRef, { credits: newCredits });
      return true;
    });
    
    return success;
  } catch (error) {
    console.error('Error deducting credits:', error);
    return false;
  }
};
