export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type BookingStatus = 'upcoming' | 'completed' | 'cancelled' | 'pending' | 'confirmed' | 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface TicketType {
  quantity: number;
  price: number;
}

export interface Tickets {
  adult: TicketType;
  child: TicketType;
  senior: TicketType;
}

export interface Booking {
  id: string;
  _id?: string; // For backwards compatibility
  userId: string;
  visitDate: string;
  ticketType: string;
  quantity: number;
  totalPrice: number;
  status: BookingStatus;
  paymentId?: string;
  paymentStatus?: string;
  createdAt: string;
  updatedAt: string;
  // Legacy fields
  bookingReference?: string;
  tickets?: Tickets;
  totalAmount?: number;
  qrCode?: string;
  ticketUsed?: boolean;
  usedAt?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface BookingFormData {
  visitDate: Date;
  tickets: Tickets;
}

export interface TicketPrices {
  adult: number;
  child: number;
  senior: number;
}




