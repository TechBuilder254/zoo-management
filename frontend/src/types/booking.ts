export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

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
  _id: string;
  bookingReference: string;
  userId: string;
  visitDate: string;
  tickets: Tickets;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  qrCode: string;
  status: BookingStatus;
  ticketUsed: boolean;
  usedAt?: string;
  createdAt: string;
  updatedAt: string;
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




