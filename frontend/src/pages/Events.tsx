import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Grid, List, Filter, Search, Clock, MapPin, Users } from 'lucide-react';
import { eventService } from '../services/eventService';
import { Event } from '../types';
import { EventList } from '../components/events/EventList';
import { EventCalendar } from '../components/events/EventCalendar';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import toast from 'react-hot-toast';

type ViewMode = 'list' | 'calendar';
type FilterCategory = 'all' | 'Educational' | 'Feeding' | 'Special Event' | 'Workshop';

export const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getUpcoming();
      setEvents(data);
    } catch (error) {
      toast.error('Failed to load events');
      console.error('Events error:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Events', icon: <Grid size={16} /> },
    { value: 'Educational', label: 'Educational', icon: <Users size={16} /> },
    { value: 'Feeding', label: 'Feeding Time', icon: <Clock size={16} /> },
    { value: 'Workshop', label: 'Workshops', icon: <MapPin size={16} /> },
    { value: 'Special Event', label: 'Special Events', icon: <CalendarIcon size={16} /> },
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesDate = !selectedDate || 
                       new Date(event.eventDate).toDateString() === selectedDate.toDateString();
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setViewMode('list');
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upcoming Events
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Join us for exciting events and educational programs
          </p>
        </div>

        {/* Search and View Toggle */}
        <Card padding="lg" className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} />}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                onClick={() => setViewMode('list')}
                size="md"
              >
                <List size={18} className="mr-2" />
                List View
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'primary' : 'outline'}
                onClick={() => setViewMode('calendar')}
                size="md"
              >
                <CalendarIcon size={18} className="mr-2" />
                Calendar View
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card padding="lg" className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Filter size={18} className="mr-2" />
                  Filters
                </h3>
                {(selectedCategory !== 'all' || selectedDate) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                  >
                    Reset
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => setSelectedCategory(category.value as FilterCategory)}
                        className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === category.value
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {category.icon}
                        <span>{category.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Selected Date
                    </label>
                    <div className="flex items-center justify-between p-3 bg-primary-light dark:bg-gray-800 rounded-lg">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {selectedDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <button
                        onClick={() => setSelectedDate(null)}
                        className="text-sm text-primary hover:text-primary-dark"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {filteredEvents.length}
                      </span>{' '}
                      event{filteredEvents.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Events Display */}
          <div className="lg:col-span-3">
            {viewMode === 'calendar' ? (
              <EventCalendar events={events} onDateSelect={handleDateSelect} />
            ) : (
              <>
                {filteredEvents.length === 0 && !loading ? (
                  <Card padding="lg" className="text-center">
                    <CalendarIcon size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No Events Found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <Button variant="outline" onClick={handleResetFilters}>
                      Clear Filters
                    </Button>
                  </Card>
                ) : (
                  <EventList events={filteredEvents} loading={loading} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};




