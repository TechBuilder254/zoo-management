import React, { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  hover = false,
  padding = 'md',
  className = '',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClass = hover ? 'hover:shadow-lg hover:scale-[1.02] transition-all duration-200' : '';

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md ${paddingClasses[padding]} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};




