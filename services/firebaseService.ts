import { db, storage } from '../src/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { MasteringSettings, MasteredTrackInfo } from '../types';
import toWav from 'audiobuffer-to-wav';

export const uploadMasteredTrack = async (user: User, masteredBuffer: AudioBuffer): Promise<string> => {
  const wavBlob = new Blob([toWav(masteredBuffer)], { type: 'audio/wav' });
  const storageRef = ref(storage, `users/${user.uid}/tracks/${Date.now()}_mastered.wav`);
  await uploadBytes(storageRef, wavBlob);
  return getDownloadURL(storageRef);
};

export const saveUserProject = async (user: User, uploadedTrackName: string, masteredFileUrl: string, masteringSettings: MasteringSettings): Promise<MasteredTrackInfo> => {
  const projectData = {
    userId: user.uid,
    trackName: uploadedTrackName,
    masteredFileUrl: masteredFileUrl,
    settings: masteringSettings,
    createdAt: new Date(),
  };
  const docRef = await addDoc(collection(db, "projects"), projectData);
  return { id: docRef.id, ...projectData } as MasteredTrackInfo;
};

export const checkAndDeductCredits = async (user: User): Promise<boolean> => {
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists() || userDoc.data()?.credits < 1) {
    return false;
  }
  await updateDoc(userRef, {
    credits: userDoc.data()?.credits - 1,
  });
  return true;
};
