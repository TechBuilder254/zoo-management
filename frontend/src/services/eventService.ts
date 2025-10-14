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
    const params = status ? { status } : {};
    const response = await api.get('/events', { params });
    const backendEvents: BackendEvent[] = response.data;
    return backendEvents.map(mapBackendEventToFrontend);
  },

  // Get upcoming events
  getUpcoming: async (): Promise<Event[]> => {
    const response = await api.get('/events');
    const backendEvents: BackendEvent[] = response.data;
    const now = new Date();
    const upcomingBackendEvents = backendEvents.filter((event: BackendEvent) => new Date(event.start_date) > now);
    return upcomingBackendEvents.map(mapBackendEventToFrontend);
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