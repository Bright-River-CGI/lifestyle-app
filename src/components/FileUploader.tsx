import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (files: FileList) => void;
  accept?: string;
  multiple?: boolean;
}

export default function FileUploader({ onFileSelect, accept = '*', multiple = true }: FileUploaderProps) {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;
    if (files?.length) {
      onFileSelect(files);
    }
  }, [onFileSelect]);

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors duration-200"
    >
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={(e) => e.target.files && onFileSelect(e.target.files)}
        accept={accept}
        multiple={multiple}
      />
      <label
        htmlFor="fileInput"
        className="cursor-pointer flex flex-col items-center justify-center"
      >
        <Upload className="h-12 w-12 text-gray-400 mb-3" />
        <span className="text-sm font-medium text-gray-900">Drop files here or click to upload</span>
        <span className="text-xs text-gray-500 mt-1">
          {multiple ? 'Upload multiple files' : 'Upload a file'}
        </span>
      </label>
    </div>
  );
}