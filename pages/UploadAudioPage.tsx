import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import Button from '../components/Button';
import { useAppContext } from '../contexts/AppContext';
import { AppPage, UploadedTrack } from '../types';
import { IconArrowRight } from '../constants';
import LoadingSpinner from '../components/LoadingSpinner';

const UploadAudioPage: React.FC = () => {
  const { setCurrentPage, uploadedTrack, setUploadedTrack, setOriginalAudioBuffer } = useAppContext();
  const [isDecoding, setIsDecoding] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileAccepted = async (file: File) => {
    setIsDecoding(true);
    setUploadError(null);
    setUploadedTrack(null); // Clear previous track while decoding new one
    setOriginalAudioBuffer(null);


    const audioContext = new AudioContext();
    const reader = new FileReader();

    reader.onload = async (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        try {
          const buffer = await audioContext.decodeAudioData(e.target.result);
          setOriginalAudioBuffer(buffer); // Save full buffer to context

          const trackData: UploadedTrack = {
            file: file,
            name: file.name,
            duration: buffer.duration,
            audioBuffer: buffer, // Keep it also in uploadedTrack for easier access initially
          };
          setUploadedTrack(trackData);
        } catch (decodeError) {
          console.error("Error decoding audio data:", decodeError);
          setUploadError("Could not decode audio file. It might be corrupted or an unsupported format.");
          setUploadedTrack(null);
          setOriginalAudioBuffer(null);
        } finally {
          setIsDecoding(false);
           if (audioContext.state !== 'closed') {
            audioContext.close();
          }
        }
      }
    };
    reader.onerror = () => {
      console.error("FileReader error");
      setUploadError("Error reading file.");
      setIsDecoding(false);
       if (audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileCleared = () => {
    setUploadedTrack(null);
    setOriginalAudioBuffer(null);
    setUploadError(null);
  };

  const handleNext = () => {
    if (uploadedTrack) {
      setCurrentPage(AppPage.SETTINGS);
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-center p-6 md:p-8 bg-slate-900/60 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-2xl card-accent">
      <h2 className="text-4xl font-heading font-semibold mb-2 text-gradient-primary">Upload Your Next Hit</h2>
      <p className="text-slate-300 mb-8">Start by uploading your Afrobeats or Hip Hop track.</p>
      
      <FileUpload 
        onFileAccepted={handleFileAccepted}
        onFileCleared={handleFileCleared}
        existingFile={uploadedTrack ? { name: uploadedTrack.name, size: uploadedTrack.file.size, duration: uploadedTrack.duration } : null}
        id="main-track-upload"
      />

      {isDecoding && <LoadingSpinner text="Analyzing audio..." className="my-4" />}
      {uploadError && <p className="text-red-400 text-sm mt-3">{uploadError}</p>}

      {uploadedTrack && !isDecoding && !uploadError && (
        <div className="mt-8 animate-fadeIn">
          <Button onClick={handleNext} size="lg" rightIcon={<IconArrowRight className="w-5 h-5"/>}>
            Next: Define Your Sound
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadAudioPage;
