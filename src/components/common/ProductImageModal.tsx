import React, { useState, useEffect, useRef } from 'react';

interface ProductImageModalProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const ProductImageModal: React.FC<ProductImageModalProps> = ({ images, initialIndex, onClose }) => {
  const [current, setCurrent] = useState(initialIndex);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (diff > 50 && current < images.length - 1) {
        setCurrent(current + 1);
      } else if (diff < -50 && current > 0) {
        setCurrent(current - 1);
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation (optional)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && current > 0) setCurrent(current - 1);
      if (e.key === 'ArrowRight' && current < images.length - 1) setCurrent(current + 1);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [current, images.length, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center" onClick={onClose}>
      {/* Image and swipe area */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
      >
        <img
          src={images[current]}
          alt={`Product image ${current + 1}`}
          className="max-w-full max-h-full object-contain mx-auto"
          draggable={false}
        />
        {/* Left arrow */}
        {current > 0 && (
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-2 z-10"
            onClick={() => setCurrent(current - 1)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
        )}
        {/* Right arrow */}
        {current < images.length - 1 && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-2 z-10"
            onClick={() => setCurrent(current + 1)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        )}
        {/* Close button */}
        <button className="absolute top-4 right-4 text-white text-3xl font-bold z-20" onClick={onClose}>&times;</button>
      </div>
      {/* Image index indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm bg-black/60 rounded px-3 py-1">
        {current + 1} / {images.length}
      </div>
    </div>
  );
};

export default ProductImageModal; 