import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const FileUpload = ({ onFileProcessed, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = useCallback((file) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        onFileProcessed(e.target.result);
      } catch (err) {
        setError('Error processing file. Please check the format.');
      }
    };
    reader.readAsText(file);
  }, [onFileProcessed]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = (e) => {
    e.preventDefault();
    setError(null);
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />
        
        <div className="space-y-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center shadow-lg">
            {isLoading ? (
              <LoadingSpinner size="lg" />
            ) : (
              <Upload className="w-10 h-10 text-blue-600" />
            )}
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              {isLoading ? 'Processing your data...' : 'Upload Your Data'}
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Drag and drop your CSV file here, or click to browse
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-3 text-gray-500">
            <FileText className="w-5 h-5" />
            <span className="text-sm font-medium">CSV format only</span>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-6 p-6 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl flex items-center space-x-3 text-red-700 shadow-lg">
          <AlertCircle className="w-6 h-6" />
          <span className="font-medium">{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
