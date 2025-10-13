import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  title?: string;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  title,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrevious();
          break;
        case 'ArrowRight':
          onNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
      onClick={onClose}
    >
      {/* Close Button */}
      <Button
        variant="ghost"
        className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-10"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <X size={24} />
      </Button>

      {/* Previous Button */}
      {images.length > 1 && (
        <Button
          variant="ghost"
          className="absolute left-4 text-white hover:bg-white hover:bg-opacity-10"
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          aria-label="Previous image"
        >
          <ChevronLeft size={32} />
        </Button>
      )}

      {/* Image Container */}
      <div
        className="relative max-w-7xl max-h-screen p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={title || `Image ${currentIndex + 1}`}
          className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg"
        />

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {title && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm max-w-md text-center">
            {title}
          </div>
        )}
      </div>

      {/* Next Button */}
      {images.length > 1 && (
        <Button
          variant="ghost"
          className="absolute right-4 text-white hover:bg-white hover:bg-opacity-10"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Next image"
        >
          <ChevronRight size={32} />
        </Button>
      )}
    </div>
  );
};

