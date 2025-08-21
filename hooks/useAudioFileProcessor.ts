import { useState, useCallback, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';

interface AudioProcessingResult {
  audioBuffer: AudioBuffer | null;
  processFile: (file: File) => Promise<AudioBuffer | null>;
  reset: () => void;
}

const useAudioFileProcessor = (): AudioProcessingResult => {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const { setIsLoading, setErrorMessage } = useAppContext();
  const abortControllerRef = useRef<AbortController | null>(null);

  const processFile = useCallback(async (file: File): Promise<AudioBuffer | null> => {
    // Cancel any ongoing processing
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    setIsLoading(true);
    setErrorMessage(null);
    setAudioBuffer(null);

    const audioContext = new AudioContext();
    const reader = new FileReader();

    return new Promise<AudioBuffer | null>((resolve) => {
      reader.onload = async (e) => {
        if (abortController.signal.aborted) {
          resolve(null);
          return;
        }
        
        if (e.target?.result instanceof ArrayBuffer) {
          try {
            const buffer = await audioContext.decodeAudioData(e.target.result);
            if (!abortController.signal.aborted) {
              setAudioBuffer(buffer);
              resolve(buffer);
            } else {
              resolve(null);
            }
          } catch (decodeError) {
            if (!abortController.signal.aborted) {
              console.error("Error decoding audio data:", decodeError);
              setErrorMessage("Could not decode audio file. It might be corrupted or an unsupported format.");
              resolve(null);
            }
          } finally {
            setIsLoading(false);
            if (audioContext.state !== 'closed') {
              audioContext.close();
            }
            if (abortControllerRef.current === abortController) {
              abortControllerRef.current = null;
            }
          }
        } else {
          if (!abortController.signal.aborted) {
            setErrorMessage("Error reading file: Invalid file type.");
            setIsLoading(false);
            resolve(null);
          }
        }
      };
      
      reader.onerror = () => {
        if (abortController.signal.aborted) {
          resolve(null);
          return;
        }
        
        console.error("FileReader error");
        setErrorMessage("Error reading file.");
        setIsLoading(false);
        resolve(null);
        if (audioContext.state !== 'closed') {
          audioContext.close();
        }
        if (abortControllerRef.current === abortController) {
          abortControllerRef.current = null;
        }
      };
      
      reader.readAsArrayBuffer(file);
    });
  }, [setIsLoading, setErrorMessage]);

  const reset = useCallback(() => {
    // Cancel any ongoing processing
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    setAudioBuffer(null);
    setIsLoading(false);
    setErrorMessage(null);
  }, [setIsLoading, setErrorMessage]);

  return { audioBuffer, processFile, reset };
};

export default useAudioFileProcessor;
