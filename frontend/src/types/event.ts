export interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string; // snake_case from Supabase
  end_date: string; // snake_case from Supabase
  location: string;
  image_url?: string; // snake_case from Supabase
  capacity?: number;
  price?: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  created_at: string; // snake_case from Supabase
  updated_at: string; // snake_case from Supabase
  // Compatibility fields (camelCase aliases)
  _id?: string;
  category?: string;
  eventDate?: string; // alias for start_date
  startTime?: string;
  endTime?: string;
  image?: string; // alias for image_url
  isActive?: boolean;
  updatedAt?: string; // alias for updated_at
}

export interface CreateEventData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  image_url?: string;
  capacity?: number;
  price?: number;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: string;
}