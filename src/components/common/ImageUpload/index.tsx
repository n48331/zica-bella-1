"use client";
import React, { useState, useRef, useCallback } from 'react';
import { IoCloudUpload, IoClose, IoImage, IoMove } from 'react-icons/io5';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxFileSize?: number; // in MB
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
  maxFileSize = 5
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    if (uploading) return;

    const fileArray = Array.from(files);
    
    // Check if adding these files would exceed the limit
    if (images.length + fileArray.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate file types and sizes
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name}: Only image files are allowed`);
        return false;
      }
      
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(`${file.name}: File size must be less than ${maxFileSize}MB`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    setUploadProgress({});

    try {
      // Upload files in parallel with individual progress tracking
      const uploadPromises = validFiles.map(async (file, index) => {
        const formData = new FormData();
        formData.append('files', file);

        // Create a unique identifier for this file
        const fileId = `${Date.now()}-${index}`;
        
        // Initialize progress for this file
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

        try {
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();

          if (response.ok && result.urls && result.urls.length > 0) {
            // Update progress to 100% for successful upload
            setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
            return result.urls[0]; // Return the uploaded URL
          } else {
            throw new Error(result.error || 'Upload failed');
          }
        } catch (error) {
          console.error(`Upload error for ${file.name}:`, error);
          throw error;
        }
      });

      // Wait for all uploads to complete
      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Add new images to the existing array
      const newImages = [...images, ...uploadedUrls];
      onImagesChange(newImages);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Some files failed to upload. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
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
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = images[index];
    
    try {
      // Delete from Supabase Storage if it's a Supabase URL
      if (imageUrl.includes('supabase')) {
        await fetch(`/api/upload?url=${encodeURIComponent(imageUrl)}`, {
          method: 'DELETE',
        });
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }

    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const setMainImage = useCallback((index: number) => {
    if (index === 0) return; // Already the main image
    
    const newImages = [...images];
    const selectedImage = newImages[index];
    
    // Remove the selected image from its current position
    newImages.splice(index, 1);
    
    // Add it to the beginning (main position)
    newImages.unshift(selectedImage);
    
    // Force a new array reference to ensure React detects the change
    onImagesChange([...newImages]);
  }, [images, onImagesChange]);

  // Drag and drop reordering handlers
  const handleImageDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
  }, []);

  const handleImageDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  }, []);

  const handleImageDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleImageDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Remove the dragged image from its original position
    newImages.splice(draggedIndex, 1);
    
    // Insert it at the new position
    newImages.splice(dropIndex, 0, draggedImage);
    
    // Force a new array reference to ensure React detects the change
    onImagesChange([...newImages]);
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [draggedIndex, images, onImagesChange]);

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getTotalProgress = () => {
    const progressValues = Object.values(uploadProgress);
    if (progressValues.length === 0) return 0;
    return progressValues.reduce((sum, progress) => sum + progress, 0) / progressValues.length;
  };

  // Filter out empty images and create a stable array
  const validImages = images.filter(img => img && img.trim() !== '');

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50/10'
            : 'border-gray-600 hover:border-gray-500'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center">
          <IoCloudUpload className="text-4xl text-gray-400 mb-4" />
          <p className="text-gray-300 mb-2">
            {uploading ? 'Uploading...' : 'Drag and drop images here, or'}
          </p>
          <button
            type="button"
            onClick={openFileDialog}
            disabled={uploading || images.length >= maxImages}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Browse Files'}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            PNG, JPG, GIF up to {maxFileSize}MB ({images.length}/{maxImages} images)
          </p>
          
          {/* Upload Progress */}
          {uploading && Object.keys(uploadProgress).length > 0 && (
            <div className="w-full mt-4">
              <div className="bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getTotalProgress()}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Uploading... {Math.round(getTotalProgress())}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Grid */}
      {validImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {validImages.map((imageUrl, index) => (
            <div 
              key={`${imageUrl}-${index}`} 
              className={`relative group ${
                draggedIndex === index ? 'opacity-50' : ''
              } ${
                dragOverIndex === index ? 'ring-2 ring-blue-400' : ''
              }`}
              draggable
              onDragStart={(e) => handleImageDragStart(e, index)}
              onDragOver={(e) => handleImageDragOver(e, index)}
              onDragLeave={handleImageDragLeave}
              onDrop={(e) => handleImageDrop(e, index)}
            >
              <div 
                className="aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setMainImage(index)}
                title={index === 0 ? "This is the main image" : "Click to set as main image"}
              >
                <img
                  src={imageUrl}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback for broken images
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xMDAgMTUwQzEyNy42MTQgMTUwIDE1MCAxMjcuNjE0IDE1MCAxMDBDMTUwIDcyLjM4NTggMTI3LjYxNCA1MCAxMDAgNTBDNzIuMzg1OCA1MCA1MCA3Mi4zODU4IDUwIDEwMEM1MCAxMjcuNjE0IDcyLjM4NTggMTUwIDEwMCAxNTBaIiBmaWxsPSIjNkI3Mjg4Ii8+CjxwYXRoIGQ9Ik04NSA5MEM4NS4zMzMzIDg3LjMzMzMgODYuNzUgODUuMjUgODkuMjUgODMuNzVDOTEuNzUgODIuMjUgOTQuNSA4MS41IDk3LjUgODEuNUMxMDAuNSA4MS41IDEwMy4yNSA4Mi4yNSAxMDUuNzUgODMuNzVDMTA4LjI1IDg1LjI1IDEwOS42NjcgODcuMzMzMyAxMTAgOTBWMTEwSDEwMFY5NSIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                  }}
                />
                
                {/* Hover overlay for non-main images */}
                {index !== 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-center">
                      <IoMove className="text-2xl mx-auto mb-1" />
                      <p className="text-xs">Set as main</p>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Remove image"
              >
                <IoClose className="text-sm" />
              </button>
              
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  Main
                </div>
              )}
              
              {/* Image number indicator */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                {index + 1}
              </div>
              
              {/* Drag handle indicator */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                <IoMove className="text-xs" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {validImages.length === 0 && !uploading && (
        <div className="text-center py-8 text-gray-500">
          <IoImage className="text-4xl mx-auto mb-2 opacity-50" />
          <p>No images uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 