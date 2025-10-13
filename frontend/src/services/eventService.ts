import api from './api';
import { Event, EventFormData } from '../types';

export const eventService = {
  getAll: async (): Promise<Event[]> => {
    const response = await api.get<Event[]>('/events');
    return response.data;
  },

  getById: async (id: string): Promise<Event> => {
    const response = await api.get<Event>(`/events/${id}`);
    return response.data;
  },

  getUpcoming: async (): Promise<Event[]> => {
    const response = await api.get<Event[]>('/events/upcoming');
    return response.data;
  },

  create: async (data: EventFormData): Promise<Event> => {
    const response = await api.post<Event>('/events', data);
    return response.data;
  },

  update: async (id: string, data: Partial<EventFormData>): Promise<Event> => {
    const response = await api.put<Event>(`/events/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
};




