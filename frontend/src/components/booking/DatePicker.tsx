import React from 'react';
import { Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

interface DatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  minDate?: Date;
  label?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateChange,
  minDate = new Date(),
  label = 'Select Visit Date',
}) => {
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value + 'T00:00:00');
    onDateChange(newDate);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      
      <div className="relative">
        <input
          type="date"
          value={selectedDate ? formatDateForInput(selectedDate) : ''}
          onChange={handleDateChange}
          min={formatDateForInput(minDate)}
          className="w-full px-4 py-3 pl-12 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
          required
        />
        <Calendar
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>

      {selectedDate && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Selected: {formatDate(selectedDate, 'EEEE, MMMM d, yyyy')}
        </p>
      )}
    </div>
  );
};





