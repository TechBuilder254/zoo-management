import React, { useEffect, useState } from 'react';
import { Users, DollarSign, Ticket, PawPrint } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Sidebar } from '../../components/admin/Sidebar';
import { statsService, DashboardStats } from '../../services/statsService';

// Remove duplicate interface since it's imported from statsService

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalAnimals: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalVisitors: 0,
    recentBookings: [],
    popularAnimals: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Animals',
      value: stats.totalAnimals,
      icon: <PawPrint size={32} className="text-primary" />,
      bgColor: 'bg-primary-light dark:bg-primary/10',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: <Ticket size={32} className="text-blue-600" />,
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Revenue',
      value: `KSh ${stats.totalRevenue.toLocaleString()}`,
      icon: <DollarSign size={32} className="text-green-600" />,
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Total Visitors',
      value: stats.totalVisitors.toLocaleString(),
      icon: <Users size={32} className="text-purple-600" />,
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="lg:ml-56">
        <div className="p-3 lg:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Dashboard Overview
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Welcome back! Here's what's happening today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
            {statCards.map((stat, index) => (
              <Card key={index} padding="lg" hover>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {loading ? '...' : stat.value}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    {stat.icon}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            {/* Recent Bookings */}
            <Card padding="lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Bookings
              </h3>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-4 text-gray-500">Loading...</div>
                ) : stats.recentBookings.length > 0 ? (
                  stats.recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          Booking #{booking.id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {booking.user?.name || booking.users?.name || 'Guest'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">
                          KSh {(booking.totalPrice || booking.total_price || 0).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(booking.createdAt || booking.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">No recent bookings</div>
                )}
              </div>
            </Card>

            {/* Popular Animals */}
            <Card padding="lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Most Popular Animals
              </h3>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-4 text-gray-500">Loading...</div>
                ) : stats.popularAnimals.length > 0 ? (
                  stats.popularAnimals.map((animal, i) => (
                    <div
                      key={animal.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary-light dark:bg-primary/20 flex items-center justify-center">
                          <PawPrint size={20} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {animal.name} ({animal.species})
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {animal._count.reviews} reviews
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-primary">
                        #{i + 1}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">No popular animals data</div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

