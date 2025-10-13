import { format, formatDistance, parseISO } from 'date-fns';

export const formatDate = (date: string | Date, formatStr: string = 'PPP'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'PPP p');
};

export const formatShortDate = (date: string | Date): string => {
  return formatDate(date, 'MMM dd, yyyy');
};

export const formatTimeAgo = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting time ago:', error);
    return 'Unknown';
  }
};

export const formatTime = (time: string): string => {
  return time;
};

export const isDateInPast = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj < new Date();
};

export const isDateInFuture = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return dateObj > new Date();
};




