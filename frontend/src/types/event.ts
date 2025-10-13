export type EventCategory = 'Feeding' | 'Educational' | 'Special Event' | 'Workshop';

export interface Event {
  _id: string;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  location: string;
  image?: string;
  category: EventCategory;
  capacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventFormData {
  title: string;
  description: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  category: EventCategory;
  capacity: number;
}




