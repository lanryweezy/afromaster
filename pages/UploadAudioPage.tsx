import React from 'react';
import FileUpload from '../components/FileUpload';
import Button from '../components/Button';
import { useAppContext } from '../contexts/AppContext';
import { AppPage, UploadedTrack } from '../types';
import { IconArrowRight } from '../constants';
// import LoadingSpinner from '../components/LoadingSpinner'; // Removed as global
import useAudioFileProcessor from '../hooks/useAudioFileProcessor';
import Card from '../components/Card';

const UploadAudioPage: React.FC = () => {
  const { setCurrentPage, uploadedTrack, setUploadedTrack, setOriginalAudioBuffer, isLoading } = useAppContext(); // Get isLoading from global context
  const { processFile, reset } = useAudioFileProcessor(); // Removed local isLoading and error

  const handleFileAccepted = async (file: File) => {
    console.log('handleFileAccepted called with file:', file);
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });
    
    try {
      const buffer = await processFile(file);
      console.log('processFile returned buffer:', buffer);
      if (buffer) {
        const trackData: UploadedTrack = {
          file: file,
          name: file.name,
          duration: buffer.duration,
          audioBuffer: buffer,
        };
        setUploadedTrack(trackData);
        setOriginalAudioBuffer(buffer);
        console.log('File successfully processed and set in state');
      } else {
        console.log('processFile returned null buffer');
      }
    } catch (error) {
      console.error('Error processing file:', error);
    }
  };

  const handleFileCleared = () => {
    setUploadedTrack(null);
    setOriginalAudioBuffer(null);
    reset();
  };

  const handleNext = () => {
    if (uploadedTrack) {
      setCurrentPage(AppPage.SETTINGS);
    }
  };

  return (
    <Card maxWidth="max-w-3xl" className="text-center">
      <h2 className="text-3xl sm:text-4xl font-heading font-semibold mb-2 text-gradient-primary">Upload Your Next Hit</h2>
      <p className="text-slate-300 mb-8">Start by uploading your Afrobeats or Hip Hop track.</p>

      <FileUpload
        onFileAccepted={handleFileAccepted}
        onFileCleared={handleFileCleared}
        existingFile={uploadedTrack ? { name: uploadedTrack.name, size: uploadedTrack.file.size, duration: uploadedTrack.duration } : null}
        id="main-track-upload"
      />

      {/* Removed local isLoading and error display as they are now global */}

      {uploadedTrack && !isLoading && (
        <div className="mt-8 animate-fadeIn">
          <Button onClick={handleNext} size="lg" rightIcon={<IconArrowRight className="w-5 h-5"/>}>
            Next: Define Your Sound
          </Button>
        </div>
      )}
    </Card>
  );
};

export default UploadAudioPage;
