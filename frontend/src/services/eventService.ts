import api from './api';
import { Event } from '../types/event';

// Backend Event interface (from Supabase database)
interface BackendEvent {
  id: string;
  title: string;
  description: string;
  start_date: string; // snake_case from Supabase
  end_date: string; // snake_case from Supabase
  location: string;
  capacity?: number;
  price?: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  image_url?: string; // snake_case from Supabase
  created_at?: string; // snake_case from Supabase
  updated_at?: string; // snake_case from Supabase
}

// Helper function to map backend event to frontend event
const mapBackendEventToFrontend = (backendEvent: BackendEvent): Event => {
  return {
    id: backendEvent.id,
    title: backendEvent.title,
    description: backendEvent.description,
    start_date: backendEvent.start_date, // Use snake_case directly
    end_date: backendEvent.end_date, // Use snake_case directly
    location: backendEvent.location,
    image_url: backendEvent.image_url,
    capacity: backendEvent.capacity,
    price: backendEvent.price,
    status: backendEvent.status,
    created_at: backendEvent.created_at || new Date().toISOString(),
    updated_at: backendEvent.updated_at || new Date().toISOString(),
  };
};

export interface CreateEventData {
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  price: number;
  imageUrl?: string;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  capacity?: number;
  price?: number;
  status?: string;
  imageUrl?: string;
}

export const eventService = {
  // Get all events
  getAll: async (status?: string): Promise<Event[]> => {
    try {
      const params = status ? { status } : {};
      const response = await api.get('/events', { params });
      console.log('Events API Response:', response.data);
      
      // Handle both array and object responses
      const backendEvents: BackendEvent[] = Array.isArray(response.data) 
        ? response.data 
        : response.data.data || [];
      
      console.log(`Fetched ${backendEvents.length} events from backend`);
      return backendEvents.map(mapBackendEventToFrontend);
    } catch (error) {
      console.error('Events fetch error:', error);
      return [];
    }
  },

  // Get upcoming events
  getUpcoming: async (): Promise<Event[]> => {
    try {
      const response = await api.get('/events');
      console.log('Upcoming Events API Response:', response.data);
      
      const backendEvents: BackendEvent[] = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
      
      console.log(`Total events from backend: ${backendEvents.length}`);
      
      const now = new Date();
      const upcomingBackendEvents = backendEvents.filter((event: BackendEvent) => {
        const startDate = new Date(event.start_date);
        const isUpcoming = startDate >= now;
        const isNotCancelled = event.status !== 'CANCELLED';
        console.log(`Event "${event.title}": start=${startDate.toISOString()}, status=${event.status}, upcoming=${isUpcoming}, notCancelled=${isNotCancelled}`);
        return isUpcoming && isNotCancelled;
      });
      
      console.log(`Filtered to ${upcomingBackendEvents.length} upcoming events`);
      return upcomingBackendEvents.map(mapBackendEventToFrontend);
    } catch (error) {
      console.error('Upcoming events fetch error:', error);
      return [];
    }
  },

  // Get event by ID
  getById: async (id: string): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return mapBackendEventToFrontend(response.data);
  },

  // Create new event
  create: async (data: CreateEventData): Promise<Event> => {
    const response = await api.post('/events', data);
    return mapBackendEventToFrontend(response.data);
  },

  // Update event
  update: async (id: string, data: UpdateEventData): Promise<Event> => {
    const response = await api.put(`/events/${id}`, data);
    return mapBackendEventToFrontend(response.data);
  },

  // Delete event
  delete: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
};

