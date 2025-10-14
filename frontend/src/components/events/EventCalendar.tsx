import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Event } from '../../types';

interface EventCalendarProps {
  events: Event[];
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: Event) => void;
}

export const EventCalendar: React.FC<EventCalendarProps> = ({ events, onDateSelect, onEventClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Start the calendar on Sunday
  const startDay = monthStart.getDay();
  const previousMonthDays = Array.from({ length: startDay }, () => null);

  const allDays = [...previousMonthDays, ...daysInMonth];

  const hasEvents = (date: Date) => {
    return events.some(event => {
      const dateStr = event.start_date || event.eventDate;
      if (!dateStr) return false;
      const eventDate = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
      return isSameDay(eventDate, date);
    });
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const dateStr = event.start_date || event.eventDate;
      if (!dateStr) return false;
      const eventDate = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
      return isSameDay(eventDate, date);
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card padding="lg" className="lg:col-span-2">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <CalendarIcon size={24} className="mr-2 text-primary" />
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={prevMonth}>
              <ChevronLeft size={20} />
            </Button>
            <Button variant="ghost" size="sm" onClick={nextMonth}>
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Week days header */}
          {weekDays.map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400 text-sm py-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {allDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const isCurrentMonth = isSameMonth(date, currentMonth);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isCurrentDay = isToday(date);
            const hasEvent = hasEvents(date);

            return (
              <button
                key={date.toString()}
                onClick={() => handleDateClick(date)}
                disabled={!isCurrentMonth}
                className={`
                  aspect-square rounded-lg flex flex-col items-center justify-center relative
                  transition-all duration-200
                  ${!isCurrentMonth && 'text-gray-300 dark:text-gray-700 cursor-not-allowed'}
                  ${isCurrentMonth && !isSelected && 'hover:bg-gray-100 dark:hover:bg-gray-800'}
                  ${isSelected && 'bg-primary text-white hover:bg-primary-dark'}
                  ${isCurrentDay && !isSelected && 'border-2 border-primary'}
                  ${hasEvent && !isSelected && 'font-bold'}
                `}
              >
                <span className="text-sm">{format(date, 'd')}</span>
                {hasEvent && (
                  <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded border-2 border-primary mr-2" />
            <span className="text-gray-600 dark:text-gray-400">Today</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded bg-primary mr-2" />
            <span className="text-gray-600 dark:text-gray-400">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-1 h-1 rounded-full bg-primary mr-2" />
            <span className="text-gray-600 dark:text-gray-400">Has Events</span>
          </div>
        </div>
      </Card>

      {/* Events List for Selected Date */}
      <Card padding="lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a Date'}
        </h3>
        
        {selectedDateEvents.length > 0 ? (
          <div className="space-y-3">
            {selectedDateEvents.map(event => (
              <button
                key={event._id || event.id}
                onClick={() => onEventClick?.(event)}
                className="w-full text-left p-3 rounded-lg bg-primary-light dark:bg-gray-800 hover:bg-primary hover:text-white dark:hover:bg-primary transition-colors"
              >
                <div className="font-semibold mb-1">{event.title}</div>
                {event.startTime && (
                  <div className="text-sm opacity-80">{event.startTime}</div>
                )}
                {event.category && (
                  <div className="text-xs mt-1 opacity-70">{event.category}</div>
                )}
              </button>
            ))}
          </div>
        ) : selectedDate ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No events scheduled for this date
          </p>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            Click on a date to view events
          </p>
        )}
      </Card>
    </div>
  );
};

