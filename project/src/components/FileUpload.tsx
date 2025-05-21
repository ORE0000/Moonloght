import { useState, useRef } from 'react';
import { Upload, X, File, Image, Film, Music, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  multiple?: boolean;
}

const FileUpload = ({
  onFilesSelect,
  accept = '*/*',
  maxSize = 50,
  maxFiles = 5,
  multiple = true,
}: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileType: string) => {
    switch (fileType.split('/')[0]) {
      case 'image':
        return <Image className="text-blue-500" size={20} />;
      case 'video':
        return <Film className="text-purple-500" size={20} />;
      case 'audio':
        return <Music className="text-green-500" size={20} />;
      case 'text':
        return <FileText className="text-gray-500" size={20} />;
      default:
        return <File className="text-gray-500" size={20} />;
    }
  };

  const validateFiles = (files: File[]) => {
    // Reset error
    setError('');
    
    // Check number of files
    const totalFiles = selectedFiles.length + files.length;
    if (totalFiles > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed (trying to add ${files.length} to existing ${selectedFiles.length})`);
      return false;
    }

    // If accept is set to all files, skip type validation
    const skipTypeValidation = accept === '*/*';
    
    // Parse accepted types into a more usable format
    const acceptedTypes = accept.split(',').map(type => {
      const trimmed = type.trim();
      // Handle mime types (e.g., image/*)
      if (trimmed.includes('/')) {
        return {
          category: trimmed.split('/')[0],
          extension: trimmed.split('/')[1]
        };
      }
      // Handle file extensions (e.g., .jpg)
      else if (trimmed.startsWith('.')) {
        return {
          category: null,
          extension: trimmed.substring(1).toLowerCase()
        };
      }
      return {
        category: null,
        extension: null
      };
    });

    // Validate each file
    for (const file of files) {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File "${file.name}" exceeds ${maxSize}MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
        return false;
      }

      // Skip type validation if accepting all files
      if (skipTypeValidation) continue;

      const fileCategory = file.type.split('/')[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      
      // Check if this file type is allowed
      const isAllowed = acceptedTypes.some(acceptedType => {
        // Check by mime category (e.g., image/*)
        if (acceptedType.category && acceptedType.extension === '*') {
          return fileCategory === acceptedType.category;
        }
        // Check by specific mime type (e.g., image/jpeg)
        else if (acceptedType.category && acceptedType.extension) {
          return file.type === `${acceptedType.category}/${acceptedType.extension}`;
        }
        // Check by file extension (e.g., .jpg)
        else if (acceptedType.extension) {
          return fileExtension === acceptedType.extension;
        }
        return false;
      });

      if (!isAllowed) {
        setError(`File "${file.name}" (${file.type || fileExtension}) is not an accepted file type`);
        return false;
      }
    }

    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      if (validateFiles(files)) {
        const newFiles = [...selectedFiles, ...files];
        setSelectedFiles(newFiles);
        onFilesSelect(newFiles);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      if (validateFiles(files)) {
        const newFiles = [...selectedFiles, ...files];
        setSelectedFiles(newFiles);
        onFilesSelect(newFiles);
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelect(newFiles);
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
    onFilesSelect([]);
    setError('');
    // Reset file input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // Format accepted types for display
  const formatAcceptedTypes = () => {
    if (accept === '*/*') return 'all file types';
    
    return accept
      .split(',')
      .map(type => {
        const trimmed = type.trim();
        if (trimmed.includes('/*')) {
          return trimmed.split('/')[0] + ' files';
        }
        if (trimmed.startsWith('.')) {
          return trimmed;
        }
        return trimmed;
      })
      .join(', ');
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl">
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 bg-white'
        } shadow-sm`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
        <Upload className="mx-auto text-gray-400 mb-3" size={32} />

        <div className="flex flex-col items-center justify-center gap-3">
          <p className="text-gray-700 font-medium">
            Drag and drop files here
          </p>
          
          <button
            onClick={handleClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Browse Files
          </button>
          
          <p className="text-sm text-gray-500">
            Accepts {formatAcceptedTypes()} | Max size: {maxSize}MB | Max files: {maxFiles}
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
          <AlertCircle size={18} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold text-gray-700">
              Selected Files ({selectedFiles.length}/{maxFiles})
            </h4>
            <button
              onClick={clearAllFiles}
              className="text-xs text-red-500 hover:text-red-700 transition"
            >
              Clear All
            </button>
          </div>
          
          <div className="max-h-60 overflow-y-auto pr-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 my-2 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {getFileIcon(file.type)}
                  <span className="text-sm text-gray-600 truncate max-w-xs">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({(file.size / 1024 / 1024).toFixed(2)}MB)
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;