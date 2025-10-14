import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = '', 
  size = 'xl',
  padding = 'md'
}) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-8xl',
    full: 'max-w-none'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-2 sm:px-4',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12'
  };

  const baseClasses = 'mx-auto';
  const sizeClass = sizeClasses[size];
  const paddingClass = paddingClasses[padding];

  return (
    <div className={`${baseClasses} ${sizeClass} ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};

// Full-width section with contained content
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'primary' | 'dark' | 'transparent';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  fullWidth?: boolean; // New prop to control full-width behavior
  style?: React.CSSProperties; // Add style prop for background images
}

export const Section: React.FC<SectionProps> = ({ 
  children, 
  className = '',
  background = 'transparent',
  padding = 'lg',
  containerSize = 'xl',
  fullWidth = false,
  style = {}
}) => {
  const backgroundClasses = {
    white: 'bg-white dark:bg-gray-900',
    gray: 'bg-gray-50 dark:bg-gray-900',
    primary: 'bg-primary text-white',
    dark: 'bg-gray-900 text-white',
    transparent: ''
  };

  const paddingClasses = {
    none: '',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-20'
  };


  const backgroundClass = backgroundClasses[background];
  const paddingClass = paddingClasses[padding];

  // If fullWidth is true, don't use Container wrapper
  if (fullWidth) {
    return (
      <section className={`${backgroundClass} ${paddingClass} ${className}`} style={style}>
        {children}
      </section>
    );
  }

  // For sections with backgrounds (either through background prop or className), 
  // wrap the entire section in a container so the background respects the same width as content
  if ((background !== 'transparent') || className.includes('bg-')) {
    return (
      <section className="py-0">
        <Container size={containerSize}>
          <div className={`${backgroundClass} ${paddingClass} ${className} rounded-lg`} style={style}>
            {children}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className={`${backgroundClass} ${paddingClass} ${className}`} style={style}>
      <Container size={containerSize}>
        {children}
      </Container>
    </section>
  );
};
