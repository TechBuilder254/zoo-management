import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Download, BarChart3, PieChart } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Sidebar } from '../../components/admin/Sidebar';
import { financialService, FinancialData } from '../../services/financialService';
import toast from 'react-hot-toast';

interface RevenueData {
  period: string;
  ticketSales: number;
  events: number;
  merchandise: number;
  donations: number;
  total: number;
}

interface ExpenseData {
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

export const FinancialManagement: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [, setFinancialData] = useState<FinancialData | null>(null);
  const [, setLoading] = useState(true);

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

  const expenseData: ExpenseData[] = [
    {
      category: 'Animal Care',
      amount: 850000,
      percentage: 35,
      trend: 'up'
    },
    {
      category: 'Staff Salaries',
      amount: 680000,
      percentage: 28,
      trend: 'stable'
    },
    {
      category: 'Maintenance',
      amount: 420000,
      percentage: 17,
      trend: 'down'
    },
    {
      category: 'Utilities',
      amount: 320000,
      percentage: 13,
      trend: 'up'
    },
    {
      category: 'Marketing',
      amount: 180000,
      percentage: 7,
      trend: 'up'
    }
  ];

  const monthlyRevenue = [
    { month: 'Jan', amount: 2200000 },
    { month: 'Feb', amount: 1950000 },
    { month: 'Mar', amount: 2100000 },
    { month: 'Apr', amount: 1850000 },
    { month: 'May', amount: 2300000 },
    { month: 'Jun', amount: 2450000 }
  ];

  const revenueData: RevenueData[] = [
    { period: 'Current Month', ticketSales: 1500000, events: 450000, merchandise: 250000, donations: 100000, total: 2300000 },
    { period: 'Previous Month', ticketSales: 1400000, events: 350000, merchandise: 200000, donations: 150000, total: 2100000 }
  ];

  const currentMonth = revenueData[0];
  const previousMonth = revenueData[1];
  
  const revenueGrowth = ((currentMonth.total - previousMonth.total) / previousMonth.total) * 100;
  const expenseGrowth = ((850000 - 820000) / 820000) * 100; // Mock calculation

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


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      <div className="lg:ml-56">
        <div className="p-3 lg:p-6">
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
                {formatCurrency(currentMonth.total)}
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
                {formatCurrency(2450000)}
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
                {formatCurrency(currentMonth.total - 2450000)}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Net Profit</p>
              <div className="flex items-center justify-center text-sm">
                <span className={`${(currentMonth.total - 2450000) > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {(currentMonth.total - 2450000) > 0 ? 'Profitable' : 'Loss'}
                </span>
              </div>
            </Card>
            
            <Card padding="lg" className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mx-auto mb-3">
                <Calendar className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {formatCurrency(currentMonth.total / 31)}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Daily Average</p>
              <div className="flex items-center justify-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  This month
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-600 dark:text-gray-400">Ticket Sales</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(currentMonth.ticketSales)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {Math.round((currentMonth.ticketSales / currentMonth.total) * 100)}%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-600 dark:text-gray-400">Events</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(currentMonth.events)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {Math.round((currentMonth.events / currentMonth.total) * 100)}%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-gray-600 dark:text-gray-400">Merchandise</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(currentMonth.merchandise)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {Math.round((currentMonth.merchandise / currentMonth.total) * 100)}%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                    <span className="text-gray-600 dark:text-gray-400">Donations</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(currentMonth.donations)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {Math.round((currentMonth.donations / currentMonth.total) * 100)}%
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
              {monthlyRevenue.map((month, index) => {
                const maxAmount = Math.max(...monthlyRevenue.map(m => m.amount));
                const height = (month.amount / maxAmount) * 100;
                
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="flex flex-col items-center mb-2">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(month.amount)}
                      </div>
                    </div>
                    <div 
                      className="w-full bg-primary rounded-t-lg transition-all duration-300 hover:bg-primary-dark"
                      style={{ height: `${height}%`, minHeight: '20px' }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2">{month.month}</div>
                  </div>
                );
              })}
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
                  {[
                    { date: '2024-01-20', description: 'Daily ticket sales', category: 'Revenue', amount: 45000, type: 'Income' },
                    { date: '2024-01-20', description: 'Animal feed purchase', category: 'Animal Care', amount: -8500, type: 'Expense' },
                    { date: '2024-01-19', description: 'Staff salaries', category: 'Payroll', amount: -680000, type: 'Expense' },
                    { date: '2024-01-19', description: 'Event ticket sales', category: 'Revenue', amount: 125000, type: 'Income' },
                    { date: '2024-01-18', description: 'Facility maintenance', category: 'Maintenance', amount: -15000, type: 'Expense' },
                    { date: '2024-01-18', description: 'Merchandise sales', category: 'Revenue', amount: 28000, type: 'Income' }
                  ].map((transaction, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {transaction.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.type === 'Income' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {transaction.type}
                        </span>
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
