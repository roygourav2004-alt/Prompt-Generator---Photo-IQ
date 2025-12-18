import React, { useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { UploadedFile } from '../types';
import { fileToBase64 } from '../services/geminiService';

interface ImageUploaderProps {
  uploadedFile: UploadedFile | null;
  onUpload: (file: UploadedFile | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ uploadedFile, onUpload }) => {
  
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        onUpload({
          file,
          previewUrl: URL.createObjectURL(file),
          base64
        });
      } catch (e) {
        console.error("Error reading file", e);
      }
    }
  }, [onUpload]);

  const handleClear = () => {
    onUpload(null);
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
       try {
        const base64 = await fileToBase64(file);
        onUpload({
          file,
          previewUrl: URL.createObjectURL(file),
          base64
        });
      } catch (err) {
        console.error(err);
      }
    }
  }, [onUpload]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-3 text-slate-200 flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-indigo-400" />
        Reference Style
      </h2>
      <div 
        className={`relative flex-1 rounded-xl border-2 border-dashed transition-all duration-200 ease-in-out flex flex-col items-center justify-center p-6
          ${uploadedFile ? 'border-indigo-500/50 bg-slate-800/50' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-800/30 bg-slate-800/20'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {uploadedFile ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg group">
            <img 
              src={uploadedFile.previewUrl} 
              alt="Reference" 
              className="max-w-full max-h-[300px] object-contain shadow-lg"
            />
            <button 
              onClick={handleClear}
              className="absolute top-2 right-2 p-2 bg-slate-900/80 hover:bg-red-500/90 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 px-3 py-1 bg-slate-900/80 rounded-md text-xs text-slate-300">
               {uploadedFile.file.name}
            </div>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mb-4 text-indigo-400">
              <Upload className="w-8 h-8" />
            </div>
            <span className="text-slate-300 font-medium text-lg">Upload Reference Image</span>
            <span className="text-slate-500 text-sm mt-2">Click or drag & drop</span>
            <span className="text-slate-600 text-xs mt-1">JPG, PNG supported</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;