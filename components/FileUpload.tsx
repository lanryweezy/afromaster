import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { analyticsService } from '../services/analyticsService';
import { IconUpload, IconMusicNote, IconXCircle } from '../constants';

interface FileUploadProps {
  onFileAccepted: (file: File) => void;
  acceptedMimeTypes?: string[];
  existingFile?: { name: string; size: number; duration?: number } | File | null; // Can be File object or info
  onFileCleared?: () => void;
  label?: string; // Optional label for the dropzone area
  id?: string; // For associating label with input
}

const formatDuration = (seconds?: number): string => {
  if (seconds === undefined || isNaN(seconds)) return '';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileAccepted, 
  acceptedMimeTypes = ['audio/mpeg', 'audio/wav', 'audio/aiff', 'audio/flac'],
  existingFile: externalFile, // Renamed to avoid conflict
  onFileCleared,
  label,
  id = 'file-upload'
}) => {
  const [internalFile, setInternalFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; duration?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (externalFile) {
      if (externalFile instanceof File) {
        setInternalFile(externalFile);
        setFileInfo({ name: externalFile.name, size: externalFile.size }); // Duration would be set by parent
      } else {
        setFileInfo(externalFile);
        setInternalFile(null); // We only have info, not the File object itself
      }
    } else {
      setInternalFile(null);
      setFileInfo(null);
    }
  }, [externalFile]);


  const onDrop: NonNullable<DropzoneOptions['onDrop']> = useCallback((acceptedFiles, fileRejections) => {
    console.log('onDrop called with:', { acceptedFiles, fileRejections });
    setError(null);
    if (fileRejections.length > 0) {
      const rejectionError = fileRejections[0].errors[0]?.message || `File type not supported. Please upload: ${acceptedMimeTypes.join(', ')}.`;
      setError(rejectionError);
      setInternalFile(null);
      setFileInfo(null);
      if (onFileCleared) onFileCleared();
      
      // Track file upload error
      analyticsService.trackError('file_upload_rejection', rejectionError, 'upload_page');
      return;
    }
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setInternalFile(file);
      setFileInfo({ name: file.name, size: file.size }); // Duration will be set by parent after decoding
      onFileAccepted(file);
      
      // Track successful file upload
      analyticsService.trackFileUpload(file.size, file.type);
    }
  }, [onFileAccepted, acceptedMimeTypes, onFileCleared]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone(({
    onDrop,
    accept: acceptedMimeTypes.reduce<Record<string, string[]>>((acc, type) => { acc[type] = []; return acc; }, {}),
    multiple: false,
    noClick: true, // Disable click on the dropzone itself
  }) as unknown as DropzoneOptions);

  const clearFile = useCallback(() => {
    setInternalFile(null);
    setFileInfo(null);
    setError(null);
    if (onFileCleared) {
      onFileCleared();
    }
  }, [onFileCleared]);
  
  const currentDisplayFile = internalFile ? {name: internalFile.name, size: internalFile.size, duration: fileInfo?.duration} : fileInfo;


  return (
    <div className="w-full p-1">
      {label && <p className="text-sm text-white mb-2 text-center font-medium">{label}</p>}
      {!currentDisplayFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-4 sm:p-8 text-center cursor-pointer transition-all duration-300 ease-in-out bg-slate-800/50
            ${isDragActive ? 'border-sky-400 bg-slate-800' : 'border-slate-700 hover:border-sky-500 hover:bg-slate-800'}`}
        >
          <input {...getInputProps()} id={id} />
          <div onClick={open} className="w-full h-full"> {/* Wrapper to capture clicks */}
            <IconUpload className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-slate-500 mb-2 sm:mb-3" />
            {isDragActive ? (
              <p className="text-sm sm:text-md font-semibold text-primary">Drop the track here ...</p>
            ) : (
              <p className="text-sm sm:text-md text-white">Drag &apos;n&apos; drop audio file, or <span className="text-primary underline">click to select</span></p>
            )}
            <p className="text-xs text-slate-400 mt-2">Supported: MP3, WAV, AIFF, FLAC</p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl text-center relative">
          <button 
            onClick={clearFile} 
            className="absolute top-2 right-2 text-slate-400 hover:text-red-400 transition-colors z-10 p-1"
            aria-label="Remove file"
          >
            <IconXCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <IconMusicNote className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-sky-400 mb-2" />
          <p className="text-sm sm:text-md font-medium text-white truncate px-4 sm:px-8" title={currentDisplayFile.name}>{currentDisplayFile.name}</p>
          <p className="text-xs text-slate-300">
            {(currentDisplayFile.size / (1024 * 1024)).toFixed(2)} MB
            {currentDisplayFile.duration ? ` / ${formatDuration(currentDisplayFile.duration)}` : ''}
          </p>
        </div>
      )}
      {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
    </div>
  );
};

export default FileUpload;
