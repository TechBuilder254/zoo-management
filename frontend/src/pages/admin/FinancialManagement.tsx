import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Download, BarChart3, PieChart, Ticket, Star } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { financialService, FinancialData } from '../../services/financialService';
import toast from 'react-hot-toast';

interface ExpenseData {
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export const FinancialManagement: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch financial data
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        const data = await financialService.getFinancialData(selectedPeriod, parseInt(selectedYear));
        setFinancialData(data);
      } catch (error) {
        console.error('Failed to fetch financial data:', error);
        toast.error('Failed to load financial data');
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [selectedPeriod, selectedYear]);

  // Calculate expense data from real data
  const expenseData: ExpenseData[] = financialData ? [
    {
      category: 'Animal Care',
      amount: financialData.expenses.breakdown.animalCare,
      percentage: financialData.expenses.total > 0 ? (financialData.expenses.breakdown.animalCare / financialData.expenses.total) * 100 : 0,
      trend: 'up'
    },
    {
      category: 'Staff Salaries',
      amount: financialData.expenses.breakdown.staffSalaries,
      percentage: financialData.expenses.total > 0 ? (financialData.expenses.breakdown.staffSalaries / financialData.expenses.total) * 100 : 0,
      trend: 'stable'
    },
    {
      category: 'Maintenance',
      amount: financialData.expenses.breakdown.maintenance,
      percentage: financialData.expenses.total > 0 ? (financialData.expenses.breakdown.maintenance / financialData.expenses.total) * 100 : 0,
      trend: 'down'
    },
    {
      category: 'Utilities',
      amount: financialData.expenses.breakdown.utilities,
      percentage: financialData.expenses.total > 0 ? (financialData.expenses.breakdown.utilities / financialData.expenses.total) * 100 : 0,
      trend: 'up'
    },
    {
      category: 'Marketing',
      amount: financialData.expenses.breakdown.marketing,
      percentage: financialData.expenses.total > 0 ? (financialData.expenses.breakdown.marketing / financialData.expenses.total) * 100 : 0,
      trend: 'up'
    },
    {
      category: 'Insurance',
      amount: financialData.expenses.breakdown.insurance,
      percentage: financialData.expenses.total > 0 ? (financialData.expenses.breakdown.insurance / financialData.expenses.total) * 100 : 0,
      trend: 'stable'
    },
    {
      category: 'Other',
      amount: financialData.expenses.breakdown.other,
      percentage: financialData.expenses.total > 0 ? (financialData.expenses.breakdown.other / financialData.expenses.total) * 100 : 0,
      trend: 'stable'
    }
  ] : [];

  // Use real monthly revenue data
  const monthlyRevenue = financialData?.revenue.monthly || [];

  // Calculate revenue breakdown from real data
  const revenueBreakdown = financialData ? {
    ticketSales: financialData.revenue.byTicketType.reduce((sum, type) => sum + (type._sum.total_price || 0), 0),
    events: 0, // Events not implemented yet
    merchandise: 0, // Merchandise not implemented yet
    donations: 0, // Donations not implemented yet
    total: financialData.financial.totalRevenue
  } : {
    ticketSales: 0,
    events: 0,
    merchandise: 0,
    donations: 0,
    total: 0
  };

  const revenueGrowth = financialData?.trends.revenueGrowth || 0;
  const expenseGrowth = 0; // Would need historical data for real calculation

  const formatCurrency = (amount: number) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="text-green-500" size={16} />;
      case 'down':
        return <TrendingDown className="text-red-500" size={16} />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };


  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading financial data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Financial Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor revenue, expenses, and financial performance.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Button variant="outline" className="flex items-center">
                <Download size={16} className="mr-2" /> Export Report
              </Button>
              <Button className="flex items-center">
                <BarChart3 size={16} className="mr-2" /> Generate Report
              </Button>
            </div>
          </div>

          {/* Period Selector */}
          <Card padding="lg" className="mb-6 lg:mb-8">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Period
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="month">Monthly</option>
                  <option value="quarter">Quarterly</option>
                  <option value="year">Yearly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <Card padding="lg" className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-3">
                <DollarSign className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {loading ? 'Loading...' : formatCurrency(financialData?.financial.totalRevenue || 0)}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Total Revenue</p>
              <div className="flex items-center justify-center text-sm">
                <TrendingUp className="text-green-500 mr-1" size={16} />
                <span className="text-green-600 dark:text-green-400">
                  +{revenueGrowth.toFixed(1)}%
                </span>
              </div>
            </Card>
            
            <Card padding="lg" className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg mx-auto mb-3">
                <TrendingDown className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {loading ? 'Loading...' : formatCurrency(financialData?.financial.totalExpenses || 0)}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Total Expenses</p>
              <div className="flex items-center justify-center text-sm">
                <TrendingUp className="text-red-500 mr-1" size={16} />
                <span className="text-red-600 dark:text-red-400">
                  +{expenseGrowth.toFixed(1)}%
                </span>
              </div>
            </Card>
            
            <Card padding="lg" className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-3">
                <BarChart3 className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {loading ? 'Loading...' : formatCurrency(financialData?.financial.netProfit || 0)}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Net Profit</p>
              <div className="flex items-center justify-center text-sm">
                <span className={`${(financialData?.financial.netProfit || 0) > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {(financialData?.financial.netProfit || 0) > 0 ? 'Profitable' : 'Loss'}
                </span>
              </div>
            </Card>
            
            <Card padding="lg" className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mx-auto mb-3">
                <Calendar className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {loading ? 'Loading...' : formatCurrency(financialData?.financial.avgDailyRevenue || 0)}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Daily Average</p>
              <div className="flex items-center justify-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  This {selectedPeriod}
                </span>
              </div>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <Card padding="lg" className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-3">
                <Ticket className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {loading ? 'Loading...' : financialData?.bookings.total || 0}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Total Bookings</p>
              <div className="flex items-center justify-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  This {selectedPeriod}
                </span>
              </div>
            </Card>
            
            <Card padding="lg" className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg mx-auto mb-3">
                <DollarSign className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {loading ? 'Loading...' : formatCurrency(financialData?.financial.avgBookingValue || 0)}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Avg Booking Value</p>
              <div className="flex items-center justify-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Per booking
                </span>
              </div>
            </Card>
            
            <Card padding="lg" className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-3">
                <Star className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {loading ? 'Loading...' : `${financialData?.financial.profitMargin.toFixed(1) || 0}%`}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Profit Margin</p>
              <div className="flex items-center justify-center text-sm">
                <span className={`${(financialData?.financial.profitMargin || 0) > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {(financialData?.financial.profitMargin || 0) > 0 ? 'Profitable' : 'Loss'}
                </span>
              </div>
            </Card>
          </div>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Revenue Sources
                </h3>
                <PieChart className="text-gray-400" size={20} />
              </div>
              
              <div className="space-y-4">
                {/* Ticket Sales by Type */}
                {financialData?.revenue.byTicketType.map((ticketType, index) => {
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'];
                  const color = colors[index % colors.length];
                  const percentage = revenueBreakdown.total > 0 ? (ticketType._sum.total_price || 0) / revenueBreakdown.total * 100 : 0;
                  
                  return (
                    <div key={ticketType.ticket_type} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 ${color} rounded-full mr-3`}></div>
                        <span className="text-gray-600 dark:text-gray-400 capitalize">
                          {ticketType.ticket_type} Tickets
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(ticketType._sum.total_price || 0)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Events (placeholder for future implementation) */}
                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-600 dark:text-gray-400">Events</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(0)}
                    </div>
                    <div className="text-sm text-gray-500">
                      0%
                    </div>
                  </div>
                </div>
                
                {/* Merchandise (placeholder for future implementation) */}
                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-gray-600 dark:text-gray-400">Merchandise</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(0)}
                    </div>
                    <div className="text-sm text-gray-500">
                      0%
                    </div>
                  </div>
                </div>
                
                {/* Donations (placeholder for future implementation) */}
                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-gray-600 dark:text-gray-400">Donations</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(0)}
                    </div>
                    <div className="text-sm text-gray-500">
                      0%
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Expense Breakdown */}
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Expense Categories
                </h3>
                <BarChart3 className="text-gray-400" size={20} />
              </div>
              
              <div className="space-y-4">
                {expenseData.map((expense, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getTrendIcon(expense.trend)}
                      <span className="text-gray-600 dark:text-gray-400 ml-3">
                        {expense.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(expense.amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {expense.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Revenue Trends */}
          <Card padding="lg" className="mb-6 lg:mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Monthly Revenue Trend
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-400">Revenue</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-end justify-between h-64 space-x-2">
              {loading ? (
                <div className="flex items-center justify-center w-full h-full">
                  <div className="text-gray-500">Loading chart data...</div>
                </div>
              ) : monthlyRevenue.length > 0 ? (
                monthlyRevenue.map((month, index) => {
                  const maxAmount = Math.max(...monthlyRevenue.map(m => m.revenue));
                  const height = maxAmount > 0 ? (month.revenue / maxAmount) * 100 : 0;
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="flex flex-col items-center mb-2">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(month.revenue)}
                        </div>
                      </div>
                      <div 
                        className="w-full bg-primary rounded-t-lg transition-all duration-300 hover:bg-primary-dark"
                        style={{ height: `${height}%`, minHeight: '20px' }}
                      ></div>
                      <div className="text-xs text-gray-500 mt-2">{month.month}</div>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <div className="text-gray-500">No revenue data available</div>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card padding="none">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Financial Activity
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        Loading transactions...
                      </td>
                    </tr>
                  ) : financialData?.bookings.total === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        No transactions found for the selected period
                      </td>
                    </tr>
                  ) : (
                    <>
                      {/* Show recent bookings as transactions */}
                      {financialData?.bookings.byStatus.map((status, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {new Date().toISOString().split('T')[0]}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {status.status} Bookings
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            Revenue
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span className="text-green-600 dark:text-green-400">
                              +{formatCurrency(financialData?.financial.avgBookingValue || 0)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              Income
                            </span>
                          </td>
                        </tr>
                      ))}
                      
                      {/* Show expense transactions */}
                      {expenseData.map((expense, index) => (
                        <tr key={`expense-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {new Date().toISOString().split('T')[0]}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {expense.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {expense.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span className="text-red-600 dark:text-red-400">
                              -{formatCurrency(expense.amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                              Expense
                            </span>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </AdminLayout>
  );
};
