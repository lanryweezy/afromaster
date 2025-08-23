import { db, storage } from '../src/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, runTransaction, query, orderBy, getDocs, getDoc, setDoc, where, writeBatch } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { MasteringSettings, MasteredTrackInfo } from '../types';
import toWav from 'audiobuffer-to-wav';

// Generate a unique referral code for users
const generateReferralCode = (userId: string): string => {
  // Create a short, unique code based on user ID
  const hash = userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return Math.abs(hash).toString(36).substring(0, 6).toUpperCase();
};

// Get user by referral code
export const getUserByReferralCode = async (referralCode: string): Promise<User | null> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('referralCode', '==', referralCode.toUpperCase()));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user by referral code:', error);
    return null;
  }
};

// Process referral when new user signs up
export const processReferral = async (referrerId: string, newUserId: string): Promise<void> => {
  try {
    const batch = writeBatch(db);
    
    // Get referrer's document
    const referrerRef = doc(db, 'users', referrerId);
    const referrerDoc = await getDoc(referrerRef);
    
    if (referrerDoc.exists()) {
      const referrerData = referrerDoc.data();
      const newReferralCount = (referrerData.referralCount || 0) + 1;
      
      // Update referrer's referral count and add credits if they reach milestones
      const updates: any = { referralCount: newReferralCount };
      
      // Give credits for referrals (1 credit per referral, up to 5)
      if (newReferralCount <= 5) {
        updates.credits = (referrerData.credits || 0) + 1;
      }
      
      batch.update(referrerRef, updates);
      
      // Update new user's referredBy field
      const newUserRef = doc(db, 'users', newUserId);
      batch.update(newUserRef, { referredBy: referrerId });
      
      await batch.commit();
    }
  } catch (error) {
    console.error('Error processing referral:', error);
  }
};

export const uploadMasteredTrack = async (user: User, masteredBuffer: AudioBuffer, setIsLoading: (loading: boolean) => void, setErrorMessage: (message: string | null) => void): Promise<string | undefined> => {
  setIsLoading(true);
  setErrorMessage(null);
  
  // First, try to check if Firebase Storage is available
  let storageAvailable = false;
  try {
    // Quick test to see if storage is accessible
    const testRef = ref(storage, 'test-connection');
    storageAvailable = true;
  } catch (error) {
    console.log('Firebase Storage not available, using local fallback');
    storageAvailable = false;
  }
  
  // If storage is not available, immediately return local download indicator
  if (!storageAvailable) {
    console.log('Firebase Storage not configured, using local download only');
    setErrorMessage('Cloud storage not available. Your track is ready for local download.');
    return 'local-download-available';
  }
  
  const maxRetries = 5; // Reduced retries since we have fallback
  let lastError: Error | null = null;
  
  // Try cloud upload with fallback
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Cloud upload attempt ${attempt}/${maxRetries}`);
      
      // Convert audio buffer to WAV blob
      const wavBlob = new Blob([toWav(masteredBuffer)], { type: 'audio/wav' });
      
      // Check file size
      if (wavBlob.size > 50 * 1024 * 1024) { // 50MB limit
        throw new Error('File size too large. Please use a shorter audio file (max 50MB).');
      }
      
      // Create unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      const filename = `mastered_${timestamp}_${randomId}.wav`;
      const storageRef = ref(storage, `users/${user.uid}/tracks/${filename}`);
      
      // Upload with progress tracking
      setErrorMessage(`Uploading to cloud (attempt ${attempt}/${maxRetries})...`);
      
      // Upload with timeout
      const uploadPromise = uploadBytes(storageRef, wavBlob, {
        cacheControl: 'public, max-age=31536000', // 1 year cache
        customMetadata: {
          uploadedAt: new Date().toISOString(),
          userId: user.uid,
          fileType: 'mastered_audio'
        }
      });
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Upload timeout')), 30000); // 30 second timeout
      });
      
      const uploadResult = await Promise.race([uploadPromise, timeoutPromise]);
      console.log('Cloud upload successful:', uploadResult);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Cloud download URL obtained:', downloadURL);
      
      setErrorMessage(null);
      return downloadURL;
      
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error('Unknown upload error');
      console.error(`Cloud upload attempt ${attempt} failed:`, lastError);
      
      // Don't retry for certain errors
      if (lastError.message.includes('unauthorized') || 
          lastError.message.includes('permission') ||
          lastError.message.includes('quota') ||
          lastError.message.includes('size') ||
          lastError.message.includes('CORS') ||
          lastError.message.includes('storage')) {
        console.log('Storage error detected, switching to local fallback');
        break;
      }
      
      // Wait before retrying
      if (attempt < maxRetries) {
        const delay = Math.min(2000 * Math.pow(2, attempt - 1), 10000); // Max 10 seconds
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // Cloud upload failed, use local fallback
  console.log('Cloud upload failed, using local download fallback');
  setErrorMessage('Cloud upload unavailable. Your track is ready for local download.');
  
  // Return local download indicator
  return 'local-download-available';
};

export const saveUserProject = async (user: User, uploadedTrackName: string, masteredFileUrl: string, masteringSettings: MasteringSettings, setIsLoading: (loading: boolean) => void, setErrorMessage: (message: string | null) => void): Promise<MasteredTrackInfo | undefined> => {
  setIsLoading(true);
  try {
    const now = new Date();
    const projectData = {
      userId: user.uid,
      originalName: uploadedTrackName,
      masteredName: `mastered_${uploadedTrackName}`,
      downloadUrl: masteredFileUrl,
      settings: masteringSettings,
      dateProcessed: now.toISOString(),
      createdAt: now,
      // Calculate durations from the settings or use defaults
      originalDuration: 0, // This should be passed from the actual audio buffer
      masteredDuration: 0, // This should be calculated from the processed audio
    };
    
    const docRef = await addDoc(collection(db, "projects"), projectData);
    
    return {
      id: docRef.id,
      originalName: projectData.originalName,
      masteredName: projectData.masteredName,
      downloadUrl: projectData.downloadUrl,
      settings: projectData.settings,
      dateProcessed: projectData.dateProcessed,
      originalDuration: projectData.originalDuration,
      masteredDuration: projectData.masteredDuration,
    };
  } catch (error: unknown) {
    console.error('Error saving user project:', error);
    if (error instanceof Error) {
      setErrorMessage(`Failed to save project: ${error.message}`);
    } else {
      setErrorMessage("Failed to save project: Unknown error");
    }
    return undefined;
  } finally {
    setIsLoading(false);
  }
};

export const checkAndDeductCredits = async (user: User, setIsLoading: (loading: boolean) => void, setErrorMessage: (message: string | null) => void): Promise<boolean> => {
  setIsLoading(true);
  const userRef = doc(db, 'users', user.uid);
  try {
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists() || userDoc.data()?.credits < 1) {
        throw new Error('Insufficient credits');
      }
      const newCredits = userDoc.data().credits - 1;
      transaction.update(userRef, { credits: newCredits });
    });
    return true;
  } catch (error: unknown) {
    console.error('Credit deduction transaction failed: ', error);
    if (error instanceof Error) {
      setErrorMessage(`Credit check failed: ${error.message}`);
    } else {
      setErrorMessage("Credit check failed: Unknown error");
    }
    return false;
  } finally {
    setIsLoading(false);
  }
};


export const getUserProjects = async (user: User): Promise<MasteredTrackInfo[]> => {
  try {
    const projectsQuery = collection(db, 'projects');
    const userProjectsQuery = query(projectsQuery, 
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(userProjectsQuery);
    const projects: MasteredTrackInfo[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.userId === user.uid) {
        projects.push({
          id: doc.id,
          originalName: data.originalName,
          masteredName: data.masteredName,
          downloadUrl: data.downloadUrl,
          settings: data.settings,
          dateProcessed: data.dateProcessed,
          originalDuration: data.originalDuration || 0,
          masteredDuration: data.masteredDuration || 0,
          masteringReportNotes: data.masteringReportNotes,
        });
      }
    });
    
    return projects;
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return [];
  }
};

// Get user credits from Firestore
export const getUserCredits = async (user: User): Promise<number> => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data()?.credits || 0;
    } else {
      // Create user document with initial credits
      await setDoc(userRef, { 
        credits: 1, // Give new users 1 free credit
        email: user.email,
        createdAt: new Date(),
        referralCode: generateReferralCode(user.uid),
        referredBy: null,
        referralCount: 0
      });
      return 1;
    }
  } catch (error) {
    console.error('Error getting user credits:', error);
    return 0;
  }
};

// Add credits to user account
export const addCreditsToUser = async (user: User, creditsToAdd: number): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', user.uid);
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const currentCredits = userDoc.exists() ? (userDoc.data()?.credits || 0) : 0;
      const newCredits = currentCredits + creditsToAdd;
      
      if (userDoc.exists()) {
        transaction.update(userRef, { credits: newCredits });
      } else {
        transaction.set(userRef, { 
          credits: newCredits,
          email: user.email,
          createdAt: new Date()
        });
      }
    });
    return true;
  } catch (error) {
    console.error('Error adding credits:', error);
    return false;
  }
};