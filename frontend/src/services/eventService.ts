import { supabase } from '../config/supabase';
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
  type: string; // accepted from UI but not stored directly in DB
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
  type?: string; // accepted from UI but not stored directly in DB
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
      let query = supabase
        .from('events')
        .select('*');

      if (status) {
        query = query.eq('status', status);
      }

      query = query.order('start_date', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} events from Supabase`);
      return (data || []).map(mapBackendEventToFrontend);
    } catch (error) {
      console.error('Events fetch error:', error);
      return [];
    }
  },

  // Get upcoming events
  getUpcoming: async (): Promise<Event[]> => {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('start_date', now)
        .neq('status', 'CANCELLED')
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error fetching upcoming events:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} upcoming events from Supabase`);
      return (data || []).map(mapBackendEventToFrontend);
    } catch (error) {
      console.error('Upcoming events fetch error:', error);
      return [];
    }
  },

  // Get event by ID
  getById: async (id: string): Promise<Event> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching event:', error);
        throw error;
      }

      return mapBackendEventToFrontend(data);
    } catch (error) {
      console.error('Error in eventService.getById:', error);
      throw error;
    }
  },

  // Create new event
  create: async (data: CreateEventData): Promise<Event> => {
    try {
      const { data: result, error } = await supabase
        .from('events')
        .insert([{
          title: data.title,
          description: data.description,
          start_date: data.startDate,
          end_date: data.endDate,
          location: data.location,
          capacity: data.capacity,
          price: data.price,
          image_url: data.imageUrl,
          status: 'UPCOMING'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating event:', error);
        throw error;
      }

      return mapBackendEventToFrontend(result);
    } catch (error) {
      console.error('Error in eventService.create:', error);
      throw error;
    }
  },

  // Update event
  update: async (id: string, data: UpdateEventData): Promise<Event> => {
    try {
      const updateData: any = {};
      
      if (data.title) updateData.title = data.title;
      if (data.description) updateData.description = data.description;
      if (data.startDate) updateData.start_date = data.startDate;
      if (data.endDate) updateData.end_date = data.endDate;
      if (data.location) updateData.location = data.location;
      if (data.capacity !== undefined) updateData.capacity = data.capacity;
      if (data.price !== undefined) updateData.price = data.price;
      if (data.status) updateData.status = data.status;
      if (data.imageUrl) updateData.image_url = data.imageUrl;

      const { data: result, error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating event:', error);
        throw error;
      }

      return mapBackendEventToFrontend(result);
    } catch (error) {
      console.error('Error in eventService.update:', error);
      throw error;
    }
  },

  // Delete event
  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting event:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in eventService.delete:', error);
      throw error;
    }
  },
};

