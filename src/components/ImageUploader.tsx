import { useState, useRef, ChangeEvent } from 'react';

interface ImageUploaderProps {
  maxFiles?: number;
  minFiles?: number;
  onImagesChange: (files: File[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  maxFiles = 10,
  minFiles = 0,
  onImagesChange,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    
    // Check if adding these would exceed the max
    if (selectedFiles.length + newFiles.length > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} images.`);
      return;
    }

    const updatedFiles = [...selectedFiles, ...newFiles];
    setSelectedFiles(updatedFiles);
    
    // Generate new previews
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    
    // Notify parent component
    onImagesChange(updatedFiles);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previews[index]);
    
    // Remove from previews
    const updatedPreviews = [...previews];
    updatedPreviews.splice(index, 1);
    setPreviews(updatedPreviews);
    
    // Notify parent component
    onImagesChange(updatedFiles);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Upload Images <span className="text-red-500">*</span>
        <span className="text-xs text-gray-500 ml-2">
          ({minFiles}-{maxFiles} photos)
        </span>
      </label>

      {selectedFiles.length < maxFiles && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer hover:border-purple-500 transition-colors"
        >
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-1 text-sm text-gray-600">
              Click to upload images or drag and drop
            </p>
            <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {selectedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="relative group aspect-square rounded-md overflow-hidden bg-gray-100 border border-gray-200"
            >
              <img
                src={previews[index]}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-xs text-white truncate p-1">
                {file.name}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-sm">
        <span
          className={`font-medium ${
            selectedFiles.length < minFiles ? 'text-red-500' : 'text-green-500'
          }`}
        >
          {selectedFiles.length}
        </span>{' '}
        of {maxFiles} images selected
        {minFiles > 0 && selectedFiles.length < minFiles && (
          <span className="text-red-500 ml-2">
            (Please upload at least {minFiles} images)
          </span>
        )}
      </div>
    </div>
  );
};

export default ImageUploader; 