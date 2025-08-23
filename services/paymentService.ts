// Real Paystack payment integration is handled by the usePaystack hook
// This service only contains Firebase credit deduction utilities

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
