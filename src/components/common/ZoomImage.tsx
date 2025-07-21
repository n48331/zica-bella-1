import React, { useRef, useState } from 'react';

interface ZoomImageProps {
  src: string;
  alt?: string;
  className?: string;
  onMobileZoom?: () => void;
}

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

const LENS_SIZE = 180; // px
const ZOOM_FACTOR = 2.5; // 2.5x zoom

const ZoomImage: React.FC<ZoomImageProps> = ({ src, alt, className, onMobileZoom }) => {
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number } | null>(null);
  const [imgDims, setImgDims] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  // Desktop magnifier logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    // Clamp mouse position to image bounds
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));
    setZoomPos({ x, y });
  };

  const handleMouseLeave = () => {
    setZoomPos(null);
  };

  // Mobile modal logic
  const handleImageClick = () => {
    if (isMobile() && onMobileZoom) onMobileZoom();
  };

  // Get image natural size for accurate zoom
  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImgDims({ width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight });
  };

  // Calculate background size and position for the lens
  let backgroundSize = '0px 0px';
  let backgroundPosition = '0% 0%';
  if (imgRef.current && imgDims.width && imgDims.height && zoomPos) {
    const displayWidth = imgRef.current.width;
    const displayHeight = imgRef.current.height;
    const zoomedWidth = displayWidth * ZOOM_FACTOR;
    const zoomedHeight = displayHeight * ZOOM_FACTOR;
    backgroundSize = `${zoomedWidth}px ${zoomedHeight}px`;
    // Calculate the percent position of the cursor
    const percentX = zoomPos.x / displayWidth;
    const percentY = zoomPos.y / displayHeight;
    // Calculate the background position so the lens is centered on the cursor
    const bgX = percentX * zoomedWidth - LENS_SIZE / 2;
    const bgY = percentY * zoomedHeight - LENS_SIZE / 2;
    backgroundPosition = `-${bgX}px -${bgY}px`;
  }

  return (
    <>
      {/* Desktop: Magnifier lens */}
      <div
        className={className + ' relative select-none'}
        style={{ cursor: isMobile() ? 'zoom-in' : 'crosshair' }}
        onMouseMove={isMobile() ? undefined : handleMouseMove}
        onMouseLeave={isMobile() ? undefined : handleMouseLeave}
        onClick={handleImageClick}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          draggable={false}
          onLoad={handleImgLoad}
        />
        {/* Magnifier lens overlay */}
        {!isMobile() && zoomPos && imgDims.width > 0 && imgDims.height > 0 && (
          <div
            className="absolute pointer-events-none border border-white/70 rounded shadow-lg z-30 transition-opacity duration-200"
            style={{
              left: zoomPos.x - LENS_SIZE / 2,
              top: zoomPos.y - LENS_SIZE / 2,
              width: LENS_SIZE,
              height: LENS_SIZE,
              overflow: 'hidden',
              background: `url('${src}') no-repeat`,
              backgroundSize,
              backgroundPosition,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              opacity: zoomPos ? 1 : 0,
              transition: 'opacity 0.2s',
            }}
          />
        )}
      </div>
    </>
  );
};

export default ZoomImage; 