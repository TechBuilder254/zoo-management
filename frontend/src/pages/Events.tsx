import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import { Event } from '../types';
import { EventList } from '../components/events/EventList';
import toast from 'react-hot-toast';

export const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getUpcoming();
      setEvents(data);
    } catch (error) {
      toast.error('Failed to load events');
      console.error('Events error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upcoming Events
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Join us for exciting events and educational programs
          </p>
        </div>

        <EventList events={events} loading={loading} />
      </div>
    </div>
  );
};




