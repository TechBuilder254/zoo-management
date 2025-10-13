import React, { useEffect, useState } from 'react';
import { Users, DollarSign, Ticket, PawPrint, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Sidebar } from '../../components/admin/Sidebar';

interface DashboardStats {
  totalAnimals: number;
  totalBookings: number;
  totalRevenue: number;
  totalVisitors: number;
  revenueChange: number;
  bookingsChange: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalAnimals: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalVisitors: 0,
    revenueChange: 0,
    bookingsChange: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch real data from API
    setTimeout(() => {
      setStats({
        totalAnimals: 248,
        totalBookings: 1523,
        totalRevenue: 125890,
        totalVisitors: 45234,
        revenueChange: 12.5,
        bookingsChange: 8.3,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    {
      title: 'Total Animals',
      value: stats.totalAnimals,
      icon: <PawPrint size={32} className="text-primary" />,
      bgColor: 'bg-primary-light dark:bg-primary/10',
      change: null,
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: <Ticket size={32} className="text-blue-600" />,
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      change: stats.bookingsChange,
    },
    {
      title: 'Revenue',
      value: `KSh ${(stats.totalRevenue * 130).toLocaleString()}`,
      icon: <DollarSign size={32} className="text-green-600" />,
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      change: stats.revenueChange,
    },
    {
      title: 'Total Visitors',
      value: stats.totalVisitors.toLocaleString(),
      icon: <Users size={32} className="text-purple-600" />,
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      change: null,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back! Here's what's happening today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                    {stat.change !== null && (
                      <div
                        className={`flex items-center text-sm ${
                          stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {stat.change >= 0 ? (
                          <TrendingUp size={16} className="mr-1" />
                        ) : (
                          <TrendingDown size={16} className="mr-1" />
                        )}
                        <span>{Math.abs(stat.change)}% from last month</span>
                      </div>
                    )}
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    {stat.icon}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <Card padding="lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Bookings
              </h3>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Booking #ZOO-2025-{1000 + i}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {['James Kariuki', 'Mary Akinyi', 'Peter Mwangi', 'Grace Njeri', 'Daniel Omondi'][i - 1]} • {i} tickets
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">KSh {(750 * i).toLocaleString()}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Today</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Popular Animals */}
            <Card padding="lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Most Popular Animals
              </h3>
              <div className="space-y-3">
                {['Simba (Lion)', 'Tembo (Elephant)', 'Twiga (Giraffe)', 'Chui (Leopard)', 'Kiboko (Hippo)'].map((animal, i) => (
                  <div
                    key={animal}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary-light dark:bg-primary/20 flex items-center justify-center">
                        <PawPrint size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {animal}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {Math.floor(Math.random() * 500) + 100} views
                        </p>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-primary">
                      #{i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

