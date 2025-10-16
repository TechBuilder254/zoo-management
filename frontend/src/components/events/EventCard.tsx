import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Event } from '../../types';
import { Card } from '../common/Card';
import { formatDate } from '../../utils/formatDate';

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Feeding':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Educational':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Special Event':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Workshop':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // Extract time from datetime strings
  const getTimeFromDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Get category from title or description (fallback logic)
  const getEventCategory = () => {
    const title = event.title?.toLowerCase() || '';
    const description = event.description?.toLowerCase() || '';
    
    if (title.includes('feeding') || description.includes('feeding')) return 'Feeding';
    if (title.includes('educational') || description.includes('educational') || title.includes('learn')) return 'Educational';
    if (title.includes('workshop') || description.includes('workshop')) return 'Workshop';
    if (title.includes('special') || title.includes('show') || title.includes('parade')) return 'Special Event';
    
    return 'Special Event'; // Default category
  };

  const eventCategory = event.category || getEventCategory();
  const eventImage = event.image_url || event.image;
  const startTime = getTimeFromDate(event.start_date || event.eventDate || '');
  const endTime = getTimeFromDate(event.end_date || '');

  return (
    <Card hover padding="none" className="overflow-hidden">
      {eventImage && (
        <div className="h-48 overflow-hidden">
          <img
            src={eventImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
            {event.title}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(eventCategory)}`}>
            {eventCategory}
          </span>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
          {event.description}
        </p>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <Calendar size={16} />
            <span>{formatDate(event.start_date || event.eventDate || '')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={16} />
            <span>{startTime} - {endTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users size={16} />
            <span>Capacity: {event.capacity}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};






