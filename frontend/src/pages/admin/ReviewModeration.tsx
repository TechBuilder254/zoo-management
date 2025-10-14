import React, { useState, useEffect } from 'react';
import { Search, Check, X } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { RatingStars } from '../../components/reviews/RatingStars';
import { Sidebar } from '../../components/admin/Sidebar';
import { reviewService } from '../../services/reviewService';
import { Review } from '../../types';
import { SentimentBadge } from '../../components/reviews/SentimentBadge';
import toast from 'react-hot-toast';

const ReviewRow: React.FC<{ 
  review: Review; 
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}> = ({ review, onApprove, onReject }) => {
  const sentiment = review.sentiment 
    ? { label: review.sentiment as 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL', score: review.sentimentScore || 0.5 }
    : null;

  const getStatusColor = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'APPROVED') return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    if (s === 'PENDING') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    if (s === 'REJECTED') return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{review.animal?.name || 'Unknown Animal'}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{review.user?.name || 'Anonymous'}</p>
        </div>
      </td>
      <td className="px-6 py-4">
        <RatingStars rating={review.rating} size={16} />
      </td>
      <td className="px-6 py-4 max-w-md">
        <p className="text-gray-700 dark:text-gray-300 line-clamp-2">{review.comment}</p>
        {sentiment && (
          <div className="mt-2">
            <SentimentBadge sentiment={sentiment} size="sm" />
          </div>
        )}
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(review.status)}`}>
          {review.status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
        {new Date(review.created_at || review.createdAt || '').toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-right space-x-2">
        {review.status.toUpperCase() === 'PENDING' && (
          <>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-green-600 hover:text-green-700"
              onClick={() => onApprove(review.id)}
            >
              <Check size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 hover:text-red-700"
              onClick={() => onReject(review.id)}
            >
              <X size={16} />
            </Button>
          </>
        )}
      </td>
    </tr>
  );
};

export const ReviewModeration: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await reviewService.getAll();
        setReviews(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        toast.error('Failed to load reviews');
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await reviewService.moderate(id, 'APPROVED');
      setReviews(reviews.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
      toast.success('Review approved');
    } catch (error) {
      toast.error('Failed to approve review');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await reviewService.moderate(id, 'REJECTED');
      setReviews(reviews.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
      toast.success('Review rejected');
    } catch (error) {
      toast.error('Failed to reject review');
    }
  };

  const pendingCount = reviews.filter(r => r.status.toUpperCase() === 'PENDING').length;
  const approvedCount = reviews.filter(r => r.status.toUpperCase() === 'APPROVED').length;
  const rejectedCount = reviews.filter(r => r.status.toUpperCase() === 'REJECTED').length;

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      (review.animal?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && review.status.toUpperCase() === filter.toUpperCase();
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="lg:ml-56 p-6">
          <p className="text-gray-600 dark:text-gray-400">Loading reviews...</p>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Review Moderation
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review and moderate visitor feedback with AI sentiment analysis
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card padding="md">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{reviews.length}</h3>
            </Card>
            <Card padding="md" className="border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</h3>
            </Card>
            <Card padding="md" className="border-l-4 border-green-500">
              <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{approvedCount}</h3>
            </Card>
            <Card padding="md" className="border-l-4 border-red-500">
              <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{rejectedCount}</h3>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search reviews by animal, user, or comment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All Reviews
              </Button>
              <Button
                variant={filter === 'pending' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('pending')}
              >
                Pending ({pendingCount})
              </Button>
              <Button
                variant={filter === 'approved' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('approved')}
              >
                Approved ({approvedCount})
              </Button>
              <Button
                variant={filter === 'rejected' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('rejected')}
              >
                Rejected ({rejectedCount})
              </Button>
            </div>
          </div>

          {/* Reviews Table */}
          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Animal / User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Comment & AI Sentiment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredReviews.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        No reviews found
                      </td>
                    </tr>
                  ) : (
                    filteredReviews.map((review) => (
                      <ReviewRow 
                        key={review.id} 
                        review={review}
                        onApprove={handleApprove}
                        onReject={handleReject}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
