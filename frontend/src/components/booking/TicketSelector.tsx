import React from 'react';
import { Minus, Plus, Users } from 'lucide-react';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/formatCurrency';

interface TicketType {
  label: string;
  description: string;
  price: number;
  quantity: number;
  icon: React.ReactNode;
}

interface TicketSelectorProps {
  tickets: {
    adult: { quantity: number; price: number };
    child: { quantity: number; price: number };
    senior: { quantity: number; price: number };
  };
  onUpdateQuantity: (type: 'adult' | 'child' | 'senior', quantity: number) => void;
}

export const TicketSelector: React.FC<TicketSelectorProps> = ({
  tickets,
  onUpdateQuantity,
}) => {
  const ticketTypes: TicketType[] = [
    {
      label: 'Adult',
      description: 'Ages 13-64',
      price: tickets.adult.price,
      quantity: tickets.adult.quantity,
      icon: <Users size={24} className="text-primary" />,
    },
    {
      label: 'Child',
      description: 'Ages 3-12',
      price: tickets.child.price,
      quantity: tickets.child.quantity,
      icon: <Users size={20} className="text-primary" />,
    },
    {
      label: 'Senior',
      description: 'Ages 65+',
      price: tickets.senior.price,
      quantity: tickets.senior.quantity,
      icon: <Users size={22} className="text-primary" />,
    },
  ];

  const handleIncrement = (type: 'adult' | 'child' | 'senior') => {
    const current = tickets[type].quantity;
    onUpdateQuantity(type, current + 1);
  };

  const handleDecrement = (type: 'adult' | 'child' | 'senior') => {
    const current = tickets[type].quantity;
    if (current > 0) {
      onUpdateQuantity(type, current - 1);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Select Tickets
      </h3>

      {ticketTypes.map((ticket) => (
        <Card key={ticket.label} padding="md" className="border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-light dark:bg-gray-700 rounded-lg">
                {ticket.icon}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {ticket.label}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {ticket.description}
                </p>
                <p className="text-lg font-bold text-primary mt-1">
                  {formatCurrency(ticket.price)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleDecrement(ticket.label.toLowerCase() as 'adult' | 'child' | 'senior')}
                disabled={ticket.quantity === 0}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors shadow-md"
                aria-label={`Decrease ${ticket.label} tickets`}
              >
                <Minus size={20} strokeWidth={3} />
              </button>

              <span className="w-16 text-center text-2xl font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 rounded-lg py-2">
                {ticket.quantity}
              </span>

              <button
                onClick={() => handleIncrement(ticket.label.toLowerCase() as 'adult' | 'child' | 'senior')}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition-colors shadow-md"
                aria-label={`Increase ${ticket.label} tickets`}
              >
                <Plus size={20} strokeWidth={3} />
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};






