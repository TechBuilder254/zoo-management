import React, { useState } from 'react';
import { Search, Check, X, Eye } from 'lucide-react';
import { Sidebar } from '../../components/admin/Sidebar';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { RatingStars } from '../../components/reviews/RatingStars';

export const ReviewModeration: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const reviews = [
    {
      id: '1',
      animalName: 'Simba the Lion',
      userName: 'Christine Wambui',
      rating: 5,
      comment: 'Amazing animal! Very majestic and well cared for.',
      status: 'pending',
      date: new Date('2025-10-13'),
    },
    {
      id: '2',
      animalName: 'Tembo the Elephant',
      userName: 'Samuel Mutua',
      rating: 4,
      comment: 'Great experience seeing the elephant. Would love to come back!',
      status: 'approved',
      date: new Date('2025-10-12'),
    },
    {
      id: '3',
      animalName: 'Twiga the Giraffe',
      userName: 'Lucy Nyambura',
      rating: 3,
      comment: 'Nice but the habitat could be bigger.',
      status: 'pending',
      date: new Date('2025-10-11'),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'rejected':
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Review Moderation
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review and moderate visitor feedback
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card padding="md">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">432</h3>
            </Card>
            <Card padding="md" className="border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">23</h3>
            </Card>
            <Card padding="md" className="border-l-4 border-green-500">
              <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">387</h3>
            </Card>
            <Card padding="md" className="border-l-4 border-red-500">
              <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">22</h3>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card padding="lg" className="mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search by animal name or reviewer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search size={18} />}
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </Card>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} padding="lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                          {review.animalName}
                        </h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                          <span>By {review.userName}</span>
                          <span>•</span>
                          <span>{review.date.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(review.status)}`}>
                        {review.status}
                      </span>
                    </div>

                    <div className="mb-3">
                      <RatingStars rating={review.rating} size={20} />
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {review.comment}
                    </p>

                    <div className="flex items-center space-x-2">
                      {review.status === 'pending' && (
                        <>
                          <Button variant="primary" size="sm">
                            <Check size={16} className="mr-1" />
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white">
                            <X size={16} className="mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm">
                        <Eye size={16} className="mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

