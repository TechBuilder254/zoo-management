import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Calendar, Users, MapPin, Eye } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Sidebar } from '../../components/admin/Sidebar';
import { EventForm } from '../../components/admin/EventForm';
import { eventService } from '../../services/eventService';
import { Event } from '../../types/event';
import toast from 'react-hot-toast';

export const EventsManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'add' | 'edit'>('view');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAll();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        toast.error('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.delete(id);
        setEvents(events.filter(event => event._id !== id));
        toast.success('Event deleted successfully');
      } catch (error) {
        console.error('Failed to delete event:', error);
        toast.error('Failed to delete event');
      }
    }
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setModalType('view');
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setModalType('add');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setIsSubmitting(false);
  };

  const handleEventSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Transform frontend data to backend format
      const backendData = {
        title: data.title,
        description: data.description,
        type: data.category,
        startDate: `${data.eventDate}T${data.startTime}:00.000Z`,
        endDate: `${data.eventDate}T${data.endTime}:00.000Z`,
        location: data.location,
        capacity: Number(data.capacity),
        price: 0, // Default price
        imageUrl: data.imageUrl || ''
      };

      if (modalType === 'add') {
        await eventService.create(backendData);
        toast.success('Event created successfully');
        // Refresh events list
        const updatedEvents = await eventService.getAll();
        setEvents(updatedEvents);
      } else if (modalType === 'edit' && selectedEvent) {
        await eventService.update(selectedEvent._id || selectedEvent.id, backendData);
        toast.success('Event updated successfully');
        // Refresh events list
        const updatedEvents = await eventService.getAll();
        setEvents(updatedEvents);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save event:', error);
      toast.error('Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventTypes = ['All', 'Educational', 'Entertainment', 'Special Event', 'Feeding Show', 'Guided Tour'];
  const eventStatuses = ['All', 'Scheduled', 'Ongoing', 'Completed', 'Cancelled'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || selectedType === 'All' || event.category === selectedType;
    const matchesStatus = selectedStatus === '' || selectedStatus === 'All' || 
                         (selectedStatus === 'Scheduled' && event.isActive) ||
                         (selectedStatus === 'Completed' && !event.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Active' : 'Completed';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="lg:ml-56 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading events...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="lg:ml-56">
        <div className="p-3 lg:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Events Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage zoo events and activities
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="mt-3 sm:mt-0"
              onClick={handleAddEvent}
            >
              <Plus size={16} className="mr-2" />
              Add Event
            </Button>
          </div>

          {/* Filters */}
          <Card padding="lg" className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Events
                </label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {eventStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('');
                    setSelectedStatus('');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </Card>

          {/* Events Table */}
          <Card padding="lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Event</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date & Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Location</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Capacity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <tr key={event._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                              {event.image ? (
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                              ) : (
                                <Calendar size={24} className="text-gray-400" />
                              )}
                  </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                        {event.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {event.description}
                              </p>
                      </div>
                    </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {event.category}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(event.start_date || event.eventDate || '').toLocaleDateString()}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              {event.startTime} - {event.endTime}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center text-sm text-gray-900 dark:text-white">
                            <MapPin size={16} className="mr-1 text-gray-400" />
                            {event.location}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center text-sm text-gray-900 dark:text-white">
                            <Users size={16} className="mr-1 text-gray-400" />
                            {event.capacity}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.isActive || false)}`}>
                            {getStatusText(event.isActive || false)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="p-2"
                              onClick={() => handleViewEvent(event)}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="p-2"
                              onClick={() => handleEditEvent(event)}
                            >
                        <Edit size={16} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteEvent(event._id || event.id)}
                            >
                        <Trash2 size={16} />
                            </Button>
                    </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500 dark:text-gray-400">
                        {searchTerm || selectedType !== '' || selectedStatus !== '' ? 'No events found matching your criteria.' : 'No events found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
                  </div>
          </Card>

          {/* Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={
              modalType === 'view' ? 'Event Details' :
              modalType === 'edit' ? 'Edit Event' :
              'Add New Event'
            }
            size={modalType === 'view' ? 'md' : 'lg'}
          >
            {modalType === 'view' && selectedEvent ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {selectedEvent.category}
                  </p>
                    </div>
                    
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedEvent.description}
                  </p>
                    </div>
                    
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Date</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(selectedEvent.start_date || selectedEvent.eventDate || '').toLocaleDateString()}
                    </p>
                    </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Time</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedEvent.startTime} - {selectedEvent.endTime}
                    </p>
                  </div>
                    </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Location</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedEvent.location}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Capacity</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedEvent.capacity} people
                    </p>
                  </div>
                  </div>

                    <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">Status</h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedEvent.isActive || false)}`}>
                    {getStatusText(selectedEvent.isActive || false)}
                          </span>
                      </div>

                <div className="flex justify-end pt-4">
                  <Button variant="outline" onClick={handleCloseModal}>
                    Close
                  </Button>
                </div>
          </div>
            ) : (
              <EventForm
                event={selectedEvent || undefined}
                onSubmit={handleEventSubmit}
                onCancel={handleCloseModal}
                isLoading={isSubmitting}
              />
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};