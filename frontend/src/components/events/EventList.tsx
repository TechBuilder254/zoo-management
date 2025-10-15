import React from 'react';
import { Event } from '../../types';
import { EventCard } from './EventCard';
import { Loader } from '../common/Loader';

interface EventListProps {
  events: Event[];
  loading?: boolean;
}

export const EventList: React.FC<EventListProps> = ({ events, loading = false }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader size="lg" text="Loading events..." />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No Upcoming Events
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Check back later for exciting events and activities!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
};






