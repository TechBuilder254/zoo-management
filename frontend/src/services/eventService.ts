import api from './api';
import { Event } from '../types/event';

// Backend Event interface (from database)
interface BackendEvent {
  id: string;
  title: string;
  description: string;
  type: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  price: number;
  status: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Helper function to map backend event to frontend event
const mapBackendEventToFrontend = (backendEvent: BackendEvent): Event => {
  return {
    _id: backendEvent.id,
    title: backendEvent.title,
    description: backendEvent.description,
    eventDate: backendEvent.startDate.split('T')[0], // Extract date part
    startTime: backendEvent.startDate.split('T')[1]?.split('.')[0] || '', // Extract time part
    endTime: backendEvent.endDate.split('T')[1]?.split('.')[0] || '', // Extract time part
    location: backendEvent.location,
    image: backendEvent.imageUrl,
    category: backendEvent.type as any, // Cast to EventCategory
    capacity: backendEvent.capacity,
    isActive: backendEvent.status === 'Scheduled' || backendEvent.status === 'Ongoing',
    createdAt: backendEvent.createdAt,
    updatedAt: backendEvent.updatedAt,
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
    const upcomingBackendEvents = backendEvents.filter((event: BackendEvent) => new Date(event.startDate) > now);
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