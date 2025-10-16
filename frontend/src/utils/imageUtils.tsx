import React from 'react';

/**
 * Image optimization utilities for better performance
 * Generates thumbnail URLs and implements lazy loading
 */

/**
 * Generate thumbnail URL from full image URL
 * This assumes you're using a service like Cloudinary or similar
 */
export const getThumbnailUrl = (
  imageUrl: string,
  width: number = 300,
  height: number = 200,
  quality: number = 80
): string => {
  if (!imageUrl || imageUrl.includes('placeholder')) {
    return imageUrl;
  }

  // If using Cloudinary
  if (imageUrl.includes('cloudinary.com')) {
    const baseUrl = imageUrl.split('/upload/')[0];
    const publicId = imageUrl.split('/upload/')[1];
    return `${baseUrl}/upload/w_${width},h_${height},c_fill,q_${quality},f_auto/${publicId}`;
  }

  // If using Supabase Storage
  if (imageUrl.includes('supabase')) {
    return `${imageUrl}?width=${width}&height=${height}&quality=${quality}`;
  }

  // For other services or direct URLs, return original
  return imageUrl;
};

/**
 * Generate multiple image sizes for responsive loading
 */
export const getResponsiveImageUrls = (imageUrl: string) => {
  if (!imageUrl || imageUrl.includes('placeholder')) {
    return {
      thumbnail: imageUrl,
      small: imageUrl,
      medium: imageUrl,
      large: imageUrl,
    };
  }

  return {
    thumbnail: getThumbnailUrl(imageUrl, 150, 100, 60),
    small: getThumbnailUrl(imageUrl, 300, 200, 70),
    medium: getThumbnailUrl(imageUrl, 600, 400, 80),
    large: getThumbnailUrl(imageUrl, 1200, 800, 85),
  };
};

/**
 * Generate WebP image URL if supported
 */
export const getWebPUrl = (imageUrl: string): string => {
  if (!imageUrl || imageUrl.includes('placeholder')) {
    return imageUrl;
  }

  // If using Cloudinary, add f_webp flag
  if (imageUrl.includes('cloudinary.com')) {
    return imageUrl.replace('/upload/', '/upload/f_webp,');
  }

  // For Supabase, add format parameter
  if (imageUrl.includes('supabase')) {
    return `${imageUrl}&format=webp`;
  }

  return imageUrl;
};

/**
 * Check if WebP is supported by the browser
 */
export const isWebPSupported = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Lazy loading hook for images
 */
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = React.useState(placeholder || src);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      setIsError(false);
    };
    img.onerror = () => {
      setIsError(true);
      setIsLoaded(false);
    };
    img.src = src;
  }, [src]);

  return { imageSrc, isLoaded, isError };
};

interface ProgressiveImageProps {
  src: string;
  placeholder?: string;
  alt: string;
  className?: string;
  sizes?: string;
}

/**
 * Progressive image loading component
 */
export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({ src, placeholder, alt, className, sizes }) => {
  const { imageSrc, isLoaded, isError } = useLazyImage(src, placeholder);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      sizes={sizes}
      loading="lazy"
      onError={(e) => {
        if (!isError) {
          (e.target as HTMLImageElement).src = placeholder || 'https://via.placeholder.com/400x300?text=Image+Not+Found';
        }
      }}
    />
  );
};

/**
 * Generate optimized image props for different use cases
 */
export const getOptimizedImageProps = (
  imageUrl: string,
  type: 'thumbnail' | 'card' | 'hero' | 'gallery' = 'card'
) => {
  const urls = getResponsiveImageUrls(imageUrl);
  
  switch (type) {
    case 'thumbnail':
      return {
        src: urls.thumbnail,
        srcSet: `${urls.thumbnail} 150w, ${urls.small} 300w`,
        sizes: '(max-width: 150px) 150px, 300px',
      };
    
    case 'card':
      return {
        src: urls.small,
        srcSet: `${urls.small} 300w, ${urls.medium} 600w`,
        sizes: '(max-width: 300px) 300px, 600px',
      };
    
    case 'hero':
      return {
        src: urls.large,
        srcSet: `${urls.medium} 600w, ${urls.large} 1200w`,
        sizes: '(max-width: 600px) 600px, 1200px',
      };
    
    case 'gallery':
      return {
        src: urls.medium,
        srcSet: `${urls.small} 300w, ${urls.medium} 600w, ${urls.large} 1200w`,
        sizes: '(max-width: 300px) 300px, (max-width: 600px) 600px, 1200px',
      };
    
    default:
      return {
        src: urls.small,
        srcSet: `${urls.small} 300w, ${urls.medium} 600w`,
        sizes: '(max-width: 300px) 300px, 600px',
      };
  }
};

/**
 * Image preloader for better UX
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Batch preload images
 */
export const preloadImages = async (urls: string[]): Promise<void> => {
  try {
    await Promise.all(urls.map(preloadImage));
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};
