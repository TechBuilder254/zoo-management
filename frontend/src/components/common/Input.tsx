import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', ...props }, ref) => {
    const inputClasses = `
      w-full px-4 py-2 border rounded-lg
      focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
      dark:bg-gray-800 dark:border-gray-700 dark:text-white
      disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-gray-900
      ${error ? 'border-red-500' : 'border-gray-300'}
      ${icon ? 'pl-10' : ''}
      ${className}
    `;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {icon}
            </div>
          )}
          <input ref={ref} className={inputClasses} {...props} />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';





