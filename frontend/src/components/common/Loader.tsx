import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  fullScreen = false,
  text,
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const loader = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`animate-spin rounded-full border-4 border-gray-200 border-t-primary ${sizeClasses[size]}`}
      />
      {text && (
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
        {loader}
      </div>
    );
  }

  return loader;
};




