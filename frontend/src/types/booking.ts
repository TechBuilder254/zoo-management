export interface TicketInfo {
  quantity: number;
  price: number;
}

export interface Tickets {
  adult: TicketInfo;
  child: TicketInfo;
  senior: TicketInfo;
}

export interface TicketPrices {
  adult: number;
  child: number;
  senior: number;
}

export interface Booking {
  id: string;
  visit_date: string; // snake_case from Supabase
  ticket_type: string; // snake_case from Supabase
  quantity: number;
  total_price: number; // snake_case from Supabase
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  payment_id?: string;
  payment_status?: string;
  promo_code_id?: string; // snake_case from Supabase
  discount_amount: number; // snake_case from Supabase
  user_id: string; // snake_case from Supabase
  created_at: string; // snake_case from Supabase
  updated_at: string; // snake_case from Supabase
  users?: {
    id: string;
    name: string;
    email: string;
  };
  promo_codes?: {
    id: string;
    code: string;
    description?: string;
    discount_type: 'PERCENTAGE' | 'FIXED_AMOUNT';
    discount_value: number;
  };
  // Compatibility fields (camelCase aliases)
  _id?: string;
  userId?: string; // alias for user_id
  visitDate?: string; // alias for visit_date
  ticketType?: string; // alias for ticket_type
  totalPrice?: number; // alias for total_price
  totalAmount?: number; // alias for total_price
  bookingReference?: string;
  tickets?: Tickets;
  user?: {
    _id?: string;
    id: string;
    name: string;
    email: string;
  };
  qrCode?: string;
  ticketUsed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  paymentStatus?: string; // alias for payment_status
  paymentId?: string; // alias for payment_id
}

export interface CreateBookingData {
  visit_date?: string;
  ticket_type?: string;
  quantity?: number;
  promo_code_id?: string;
  // Compatibility fields
  visitDate?: string;
  tickets?: Tickets;
  promoCode?: string;
  discountAmount?: number;
}

export interface UpdateBookingData {
  id: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  payment_status?: string;
}