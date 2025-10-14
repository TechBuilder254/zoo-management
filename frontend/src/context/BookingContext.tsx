import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Tickets, TicketPrices } from '../types';
import { TICKET_PRICES } from '../utils/constants';
import { ticketService, TicketPrice } from '../services/ticketService';

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
  const [ticketPrices, setTicketPrices] = useState<TicketPrices>(TICKET_PRICES);

  // Fetch ticket prices from backend on mount
  useEffect(() => {
    const fetchTicketPrices = async () => {
      try {
        const prices = await ticketService.getAll();
        const priceMap: TicketPrices = {
          adult: TICKET_PRICES.adult,
          child: TICKET_PRICES.child,
          senior: TICKET_PRICES.senior,
        };
        
        prices.forEach((price: TicketPrice) => {
          if (price.ticketType === 'adult') priceMap.adult = price.price;
          if (price.ticketType === 'child') priceMap.child = price.price;
          if (price.ticketType === 'senior') priceMap.senior = price.price;
        });
        
        setTicketPrices(priceMap);
        
        // Update ticket prices in state
        setTickets(prev => ({
          adult: { ...prev.adult, price: priceMap.adult },
          child: { ...prev.child, price: priceMap.child },
          senior: { ...prev.senior, price: priceMap.senior },
        }));
      } catch (error) {
        console.error('Failed to fetch ticket prices:', error);
        // Keep using default prices if fetch fails
      }
    };

    fetchTicketPrices();
  }, []);

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
    ticketPrices,
    setVisitDate,
    updateTickets,
    resetBooking,
    getTotalAmount,
    getTotalTickets,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};




