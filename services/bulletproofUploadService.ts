import { User } from 'firebase/auth';
import { MasteringSettings } from '../types';
import toWav from 'audiobuffer-to-wav';

// Multiple upload strategies for 100% success rate
export interface UploadResult {
  success: boolean;
  url?: string;
  method: 'firebase' | 'local' | 'cloudflare' | 'backup';
  error?: string;
}

export class BulletproofUploadService {
  private static instance: BulletproofUploadService;
  
  static getInstance(): BulletproofUploadService {
    if (!BulletproofUploadService.instance) {
      BulletproofUploadService.instance = new BulletproofUploadService();
    }
    return BulletproofUploadService.instance;
  }

  // Strategy 1: Firebase Storage with enhanced error handling
  private async uploadToFirebase(user: User, audioBuffer: AudioBuffer, filename: string): Promise<UploadResult> {
    try {
      const { storage } = await import('../src/firebaseConfig');
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      
      const wavBlob = new Blob([toWav(audioBuffer)], { type: 'audio/wav' });
      const storageRef = ref(storage, `users/${user.uid}/tracks/${filename}`);
      
      await uploadBytes(storageRef, wavBlob, {
        cacheControl: 'public, max-age=31536000',
        customMetadata: {
          uploadedAt: new Date().toISOString(),
          userId: user.uid,
          fileType: 'mastered_audio'
        }
      });
      
      const downloadURL = await getDownloadURL(storageRef);
      
      return {
        success: true,
        url: downloadURL,
        method: 'firebase'
      };
    } catch (error) {
      console.warn('Firebase upload failed, trying next strategy:', error);
      return {
        success: false,
        method: 'firebase',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Strategy 2: Cloudflare R2 (S3-compatible) backup
  private async uploadToCloudflare(audioBuffer: AudioBuffer, filename: string): Promise<UploadResult> {
    try {
      const wavBlob = new Blob([toWav(audioBuffer)], { type: 'audio/wav' });
      
      // Using Cloudflare R2 as backup storage
      const formData = new FormData();
      formData.append('file', wavBlob, filename);
      
      // This would use your Cloudflare R2 endpoint
      const response = await fetch('/api/upload-cloudflare', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          url: result.url,
          method: 'cloudflare'
        };
      }
      
      throw new Error('Cloudflare upload failed');
    } catch (error) {
      console.warn('Cloudflare upload failed, trying local storage:', error);
      return {
        success: false,
        method: 'cloudflare',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Strategy 3: Local storage with IndexedDB (always works)
  private async uploadToLocal(audioBuffer: AudioBuffer, filename: string): Promise<UploadResult> {
    try {
      const wavBlob = new Blob([toWav(audioBuffer)], { type: 'audio/wav' });
      
      // Store in IndexedDB for persistent local storage
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['audioFiles'], 'readwrite');
      const store = transaction.objectStore('audioFiles');
      
      await store.put({
        id: filename,
        blob: wavBlob,
        timestamp: Date.now(),
        size: wavBlob.size
      });
      
      // Create object URL for immediate download
      const objectURL = URL.createObjectURL(wavBlob);
      
      return {
        success: true,
        url: objectURL,
        method: 'local'
      };
    } catch (error) {
      console.error('Local storage failed:', error);
      return {
        success: false,
        method: 'local',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Initialize IndexedDB for local storage
  private async openIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('AfromasterAudioDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('audioFiles')) {
          db.createObjectStore('audioFiles', { keyPath: 'id' });
        }
      };
    });
  }

  // Main bulletproof upload method - tries all strategies
  async uploadMasteredTrack(
    user: User, 
    audioBuffer: AudioBuffer, 
    setIsLoading: (loading: boolean) => void,
    setErrorMessage: (message: string | null) => void
  ): Promise<UploadResult> {
    setIsLoading(true);
    setErrorMessage('Preparing upload...');
    
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const filename = `mastered_${timestamp}_${randomId}.wav`;
    
    // Strategy 1: Try Firebase first
    setErrorMessage('Uploading to cloud storage...');
    let result = await this.uploadToFirebase(user, audioBuffer, filename);
    
    if (result.success) {
      setErrorMessage(null);
      setIsLoading(false);
      return result;
    }
    
    // Strategy 2: Try Cloudflare backup
    setErrorMessage('Cloud storage unavailable, using backup...');
    result = await this.uploadToCloudflare(audioBuffer, filename);
    
    if (result.success) {
      setErrorMessage(null);
      setIsLoading(false);
      return result;
    }
    
    // Strategy 3: Local storage (always works)
    setErrorMessage('Saving to local storage...');
    result = await this.uploadToLocal(audioBuffer, filename);
    
    if (result.success) {
      setErrorMessage('Cloud upload unavailable. Your track is saved locally and ready for download.');
      setIsLoading(false);
      return result;
    }
    
    // This should never happen, but just in case
    setErrorMessage('Upload failed. Please try again.');
    setIsLoading(false);
    return result;
  }

  // Get file from local storage
  async getLocalFile(filename: string): Promise<Blob | null> {
    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['audioFiles'], 'readonly');
      const store = transaction.objectStore('audioFiles');
      const result = await store.get(filename);
      return result?.blob || null;
    } catch (error) {
      console.error('Error retrieving local file:', error);
      return null;
    }
  }

  // Clean up local storage
  async cleanupLocalStorage(): Promise<void> {
    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['audioFiles'], 'readwrite');
      const store = transaction.objectStore('audioFiles');
      
      // Keep only files from last 30 days
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const request = store.openCursor();
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          if (cursor.value.timestamp < thirtyDaysAgo) {
            cursor.delete();
          }
          cursor.continue();
        }
      };
    } catch (error) {
      console.error('Error cleaning up local storage:', error);
    }
  }
}

export const bulletproofUploadService = BulletproofUploadService.getInstance();
