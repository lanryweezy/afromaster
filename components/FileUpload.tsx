import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { IconUpload, IconMusicNote, IconXCircle, IconCheckCircle } from '../constants';

interface FileUploadProps {
  onFileAccepted: (file: File) => void;
  acceptedMimeTypes?: string[];
  existingFile?: { name: string; size: number; duration?: number } | File | null;
  onFileCleared?: () => void;
  label?: string;
  id?: string;
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
  existingFile: externalFile, 
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
        setFileInfo({ name: externalFile.name, size: externalFile.size });
      } else {
        setFileInfo(externalFile);
        setInternalFile(null);
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
      setFileInfo({ name: file.name, size: file.size });
      onFileAccepted(file);
    }
  }, [onFileAccepted, acceptedMimeTypes, onFileCleared]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedMimeTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    multiple: false,
  });

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalFile(null);
    setFileInfo(null);
    setError(null);
    if (onFileCleared) {
      onFileCleared();
    }
    const inputElement = document.getElementById(id) as HTMLInputElement;
    if (inputElement) {
        inputElement.value = "";
    }
  };
  
  const currentDisplayFile = internalFile ? {name: internalFile.name, size: internalFile.size, duration: fileInfo?.duration} : fileInfo;


  return (
    <div className="w-full">
      {label && <p className="text-sm text-slate-400 mb-2 font-medium ml-1">{label}</p>}
      
      {!currentDisplayFile ? (
        <div
          {...getRootProps()}
          className={`relative group border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ease-in-out
            ${isDragActive 
                ? 'border-primary bg-primary/10 scale-[1.02]' 
                : 'border-slate-700/50 bg-slate-900/30 hover:border-primary/50 hover:bg-slate-800/50'
            }`}
        >
          <input {...getInputProps()} id={id} />
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${isDragActive ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary'}`}>
             <IconUpload className="w-8 h-8" />
          </div>
          
          {isDragActive ? (
            <p className="text-lg font-bold text-primary">Drop it like it's hot!</p>
          ) : (
            <>
                <p className="text-lg font-medium text-slate-200 group-hover:text-white transition-colors">Drag & drop your mix here</p>
                <p className="text-sm text-slate-500 mt-2">or click to browse files</p>
            </>
          )}
          <p className="text-xs text-slate-600 mt-4 font-mono">WAV, MP3, AIFF, FLAC up to 100MB</p>
        </div>
      ) : (
        <div className="relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-primary/30 rounded-2xl text-center shadow-lg shadow-primary/5 group">
          <div className="absolute top-0 right-0 p-3">
             <button 
                onClick={clearFile} 
                className="p-1 rounded-full text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                aria-label="Remove file"
            >
                <IconXCircle className="w-6 h-6" />
            </button>
          </div>
          
          <div className="w-16 h-16 mx-auto bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-3">
             <IconMusicNote className="w-8 h-8" />
          </div>
          
          <h3 className="text-lg font-bold text-white truncate px-8 mb-1" title={currentDisplayFile.name}>
            {currentDisplayFile.name}
          </h3>
          
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-mono bg-slate-950/50 py-1.5 px-3 rounded-full inline-flex mx-auto mt-2">
            <span>{(currentDisplayFile.size / (1024 * 1024)).toFixed(2)} MB</span>
            {currentDisplayFile.duration && (
                <>
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    <span>{formatDuration(currentDisplayFile.duration)}</span>
                </>
            )}
          </div>
          
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="flex items-center text-xs text-green-400 font-medium">
                  <IconCheckCircle className="w-4 h-4 mr-1"/> Ready
              </span>
          </div>
        </div>
      )}
      {error && (
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center text-red-400 text-sm">
            <IconXCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;