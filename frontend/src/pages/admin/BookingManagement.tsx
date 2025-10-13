import React, { useState } from 'react';
import { Search, Download, CheckCircle, XCircle } from 'lucide-react';
import { Sidebar } from '../../components/admin/Sidebar';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { format } from 'date-fns';

export const BookingManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const bookings = [
    {
      id: 'ZOO-2025-1001',
      customerName: 'James Kariuki',
      email: 'james.kariuki@gmail.com',
      visitDate: new Date('2025-10-20'),
      tickets: 3,
      amount: 2250,
      status: 'confirmed',
      paymentStatus: 'completed',
    },
    {
      id: 'ZOO-2025-1002',
      customerName: 'Mary Akinyi',
      email: 'mary.akinyi@yahoo.com',
      visitDate: new Date('2025-10-21'),
      tickets: 2,
      amount: 1500,
      status: 'confirmed',
      paymentStatus: 'completed',
    },
    {
      id: 'ZOO-2025-1003',
      customerName: 'Daniel Kipchoge',
      email: 'daniel.k@gmail.com',
      visitDate: new Date('2025-10-22'),
      tickets: 5,
      amount: 3750,
      status: 'pending',
      paymentStatus: 'pending',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Booking Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage all ticket bookings
              </p>
            </div>
            <Button variant="outline" size="lg">
              <Download size={20} className="mr-2" />
              Export Report
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card padding="md">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">1,523</h3>
            </Card>
            <Card padding="md">
              <p className="text-sm text-gray-600 dark:text-gray-400">Today's Bookings</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">47</h3>
            </Card>
            <Card padding="md">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">KSh 3.8M</h3>
            </Card>
            <Card padding="md">
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Ticket Price</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">KSh 750</h3>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card padding="lg" className="mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search by booking ID or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search size={18} />}
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option value="">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <input
                type="date"
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </Card>

          {/* Bookings Table */}
          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Visit Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tickets
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {booking.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {booking.customerName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {booking.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {format(booking.visitDate, 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {booking.tickets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                        KSh {booking.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <Button variant="ghost" size="sm" className="text-green-600">
                          <CheckCircle size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <XCircle size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

