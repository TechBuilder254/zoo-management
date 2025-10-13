import React, { createContext, useState, ReactNode } from 'react';
import { Tickets, TicketPrices } from '../types';
import { TICKET_PRICES } from '../utils/constants';

interface BookingContextType {
  visitDate: Date | null;
  tickets: Tickets;
  ticketPrices: TicketPrices;
  setVisitDate: (date: Date | null) => void;
  updateTickets: (type: keyof Tickets, quantity: number) => void;
  resetBooking: () => void;
  getTotalAmount: () => number;
  getTotalTickets: () => number;
}

export const BookingContext = createContext<BookingContextType | undefined>(undefined);

interface BookingProviderProps {
  children: ReactNode;
}

const initialTickets: Tickets = {
  adult: { quantity: 0, price: TICKET_PRICES.adult },
  child: { quantity: 0, price: TICKET_PRICES.child },
  senior: { quantity: 0, price: TICKET_PRICES.senior },
};

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [visitDate, setVisitDate] = useState<Date | null>(null);
  const [tickets, setTickets] = useState<Tickets>(initialTickets);

  const updateTickets = (type: keyof Tickets, quantity: number): void => {
    setTickets((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        quantity: Math.max(0, quantity),
      },
    }));
  };

  const resetBooking = (): void => {
    setVisitDate(null);
    setTickets(initialTickets);
  };

  const getTotalAmount = (): number => {
    return (
      tickets.adult.quantity * tickets.adult.price +
      tickets.child.quantity * tickets.child.price +
      tickets.senior.quantity * tickets.senior.price
    );
  };

  const getTotalTickets = (): number => {
    return tickets.adult.quantity + tickets.child.quantity + tickets.senior.quantity;
  };

  const value: BookingContextType = {
    visitDate,
    tickets,
    ticketPrices: TICKET_PRICES,
    setVisitDate,
    updateTickets,
    resetBooking,
    getTotalAmount,
    getTotalTickets,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};




