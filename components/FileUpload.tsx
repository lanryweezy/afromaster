import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { analyticsService } from '../services/analyticsService';
import { IconUpload, IconMusicNote, IconXCircle, IconCheckCircle } from '../constants';

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
  const [isUploading, setIsUploading] = useState(false);

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


  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    console.log('onDrop called with:', { acceptedFiles, fileRejections });
    setError(null);
    setIsUploading(true);
    
    if (fileRejections.length > 0) {
      const rejectionError = fileRejections[0].errors[0]?.message || `File type not supported. Please upload: ${acceptedMimeTypes.join(', ')}.`;
      setError(rejectionError);
      setInternalFile(null);
      setFileInfo(null);
      setIsUploading(false);
      if (onFileCleared) onFileCleared();
      
      // Track file upload error
      analyticsService.trackError('file_upload_rejection', rejectionError, 'upload_page');
      return;
    }
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setInternalFile(file);
      setFileInfo({ name: file.name, size: file.size }); // Duration will be set by parent after decoding
      
      // Simulate upload progress
      setTimeout(() => {
        setIsUploading(false);
        onFileAccepted(file);
        
        // Track successful file upload
        analyticsService.trackFileUpload(file.size, file.type);
      }, 800);
    }
  }, [onFileAccepted, acceptedMimeTypes, onFileCleared]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: acceptedMimeTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    multiple: false,
    noClick: true, // Disable click on the dropzone itself
  });

  const clearFile = useCallback(() => {
    setInternalFile(null);
    setFileInfo(null);
    setError(null);
    setIsUploading(false);
    if (onFileCleared) {
      onFileCleared();
    }
  }, [onFileCleared]);
  
  const currentDisplayFile = internalFile ? {name: internalFile.name, size: internalFile.size, duration: fileInfo?.duration} : fileInfo;


  return (
    <div className="w-full">
      {label && <p className="text-sm text-slate-300 mb-3 text-center font-medium">{label}</p>}
      {!currentDisplayFile ? (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ease-in-out overflow-hidden group
            ${isDragActive 
              ? 'border-orange-400 bg-orange-500/10 shadow-lg shadow-orange-500/20 scale-[1.02]' 
              : 'border-slate-600 bg-slate-800/30 hover:border-orange-500 hover:bg-slate-700/50 hover:shadow-lg hover:shadow-orange-500/10'
            }`}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <input {...getInputProps()} id={id} />
          <div onClick={open} className="relative z-10 w-full h-full"> {/* Wrapper to capture clicks */}
            <div className={`transition-all duration-300 ${isDragActive ? 'scale-110' : 'group-hover:scale-105'}`}>
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <IconUpload className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {isDragActive ? (
              <div className="animate-bounce-in">
                <p className="text-lg font-semibold text-orange-400 mb-2">Drop your track here!</p>
                <p className="text-sm text-slate-400">Release to upload</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium text-white mb-2">
                  Drag & drop your audio file here
                </p>
                <p className="text-sm text-slate-400 mb-4">
                  or <span className="text-orange-400 underline font-medium hover:text-orange-300 transition-colors">click to browse</span>
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-500">
                  <span className="bg-slate-700/50 px-2 py-1 rounded-md">MP3</span>
                  <span className="bg-slate-700/50 px-2 py-1 rounded-md">WAV</span>
                  <span className="bg-slate-700/50 px-2 py-1 rounded-md">AIFF</span>
                  <span className="bg-slate-700/50 px-2 py-1 rounded-md">FLAC</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all duration-300 group">
          {/* Success indicator */}
          <div className="absolute top-3 left-3 text-green-400">
            <IconCheckCircle className="w-5 h-5" />
          </div>
          
          <button 
            onClick={clearFile} 
            className="absolute top-3 right-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 p-1.5 rounded-lg hover:scale-110"
            aria-label="Remove file"
          >
            <IconXCircle className="w-5 h-5" />
          </button>
          
          {isUploading ? (
            <div className="animate-pulse">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
              <p className="text-sm font-medium text-orange-400">Processing file...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <IconMusicNote className="w-6 h-6 text-white" />
              </div>
              <p className="text-base font-medium text-white truncate px-4 mb-2" title={currentDisplayFile.name}>
                {currentDisplayFile.name}
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
                <span className="bg-slate-700/50 px-2 py-1 rounded-md">
                  {(currentDisplayFile.size / (1024 * 1024)).toFixed(2)} MB
                </span>
                {currentDisplayFile.duration && (
                  <span className="bg-slate-700/50 px-2 py-1 rounded-md">
                    {formatDuration(currentDisplayFile.duration)}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      )}
      {error && (
        <div className="mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-xl animate-shake">
          <p className="text-red-400 text-sm text-center font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
