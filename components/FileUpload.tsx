import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
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


  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError(null);
    if (fileRejections.length > 0) {
      const rejectionError = fileRejections[0].errors[0]?.message || `File type not supported. Please upload: ${acceptedMimeTypes.join(', ')}.`;
      setError(rejectionError);
      setInternalFile(null);
      setFileInfo(null);
      if (onFileCleared) onFileCleared();
      return;
    }
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setInternalFile(file);
      setFileInfo({ name: file.name, size: file.size }); // Duration will be set by parent after decoding
      onFileAccepted(file);
    }
  }, [onFileAccepted, acceptedMimeTypes, onFileCleared]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedMimeTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    multiple: false,
  });

  const clearFile = () => {
    setInternalFile(null);
    setFileInfo(null);
    setError(null);
    if (onFileCleared) {
      onFileCleared();
    }
    // If the input element holds a reference, this might be needed for some browsers
    const inputElement = document.getElementById(id) as HTMLInputElement;
    if (inputElement) {
        inputElement.value = "";
    }
  };
  
  const currentDisplayFile = internalFile ? {name: internalFile.name, size: internalFile.size, duration: fileInfo?.duration} : fileInfo;


  return (
    <div className="w-full p-1">
      {label && <p className="text-sm text-white mb-2 text-center font-medium">{label}</p>}
      {!currentDisplayFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ease-in-out bg-slate-800/50
            ${isDragActive ? 'border-sky-400 bg-slate-800' : 'border-slate-700 hover:border-sky-500 hover:bg-slate-800'}`}
        >
          <input {...getInputProps()} id={id} />
          <IconUpload className="w-12 h-12 mx-auto text-slate-500 mb-3" />
          {isDragActive ? (
            <p className="text-md font-semibold text-primary">Drop the track here ...</p>
          ) : (
            <p className="text-md text-white">Drag 'n' drop audio file, or click to select</p>
          )}
          <p className="text-xs text-white mt-2">Supported: MP3, WAV, AIFF, FLAC</p>
        </div>
      ) : (
        <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl text-center relative">
          <button 
            onClick={clearFile} 
            className="absolute top-2 right-2 text-slate-400 hover:text-red-400 transition-colors z-10"
            aria-label="Remove file"
          >
            <IconXCircle className="w-6 h-6" />
          </button>
          <IconMusicNote className="w-10 h-10 mx-auto text-sky-400 mb-2" />
          <p className="text-md font-medium text-white truncate px-8" title={currentDisplayFile.name}>{currentDisplayFile.name}</p>
          <p className="text-xs text-white">
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
