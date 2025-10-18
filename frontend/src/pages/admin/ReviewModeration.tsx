import React, { useState, useEffect } from 'react';
import { Search, Check, X, Calendar } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { RatingStars } from '../../components/reviews/RatingStars';
import { AdminLayout } from '../../components/admin/AdminLayout';
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
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await reviewService.getAll();
        setReviews(data.reviews); // Extract reviews array from paginated response
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

  // Modal handlers
  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  const handleApproveFromModal = async (reviewId: string) => {
    try {
      await reviewService.moderate(reviewId, 'APPROVED');
      setReviews(reviews.map(r => r.id === reviewId ? { ...r, status: 'APPROVED' } : r));
      toast.success('Review approved');
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to approve review');
    }
  };

  const handleRejectFromModal = async (reviewId: string) => {
    try {
      await reviewService.moderate(reviewId, 'REJECTED');
      setReviews(reviews.map(r => r.id === reviewId ? { ...r, status: 'REJECTED' } : r));
      toast.success('Review rejected');
      handleCloseModal();
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
      <AdminLayout>
        <p className="text-gray-600 dark:text-gray-400">Loading reviews...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
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

          {/* Reviews List - Desktop Table / Mobile Cards */}
          <Card padding="lg">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Animal / User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Rating</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Comment & AI Sentiment</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                      <ReviewRow 
                        key={review.id} 
                        review={review}
                        onApprove={handleApprove}
                        onReject={handleReject}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                        No reviews found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => {
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
                    <div 
                      key={review.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                      onClick={() => handleViewReview(review)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                            {review.animal?.name || 'Unknown Animal'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            by {review.user?.name || 'Anonymous'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${getStatusColor(review.status)}`}>
                          {review.status}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <RatingStars rating={review.rating} size={16} />
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                          {review.comment}
                        </p>
                        {sentiment && (
                          <div className="mt-2">
                            <SentimentBadge sentiment={sentiment} size="sm" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <Calendar size={14} className="mr-2" />
                        <span>{new Date(review.created_at || review.createdAt || '').toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No reviews found
                </div>
              )}
            </div>
          </Card>

          {/* Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title="Review Details"
            size="md"
          >
            {selectedReview && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Review for {selectedReview.animal?.name || 'Unknown Animal'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    by {selectedReview.user?.name || 'Anonymous'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Rating</h4>
                  <RatingStars rating={selectedReview.rating} size={20} />
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Comment</h4>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300">
                      {selectedReview.comment}
                    </p>
                  </div>
                </div>

                {selectedReview.sentiment && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">AI Sentiment Analysis</h4>
                    <SentimentBadge 
                      sentiment={{
                        label: selectedReview.sentiment as 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL',
                        score: selectedReview.sentimentScore || 0.5
                      }} 
                      size="md" 
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Status</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      selectedReview.status.toUpperCase() === 'APPROVED' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      selectedReview.status.toUpperCase() === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      selectedReview.status.toUpperCase() === 'REJECTED' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {selectedReview.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Date</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(selectedReview.created_at || selectedReview.createdAt || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {selectedReview.status.toUpperCase() === 'PENDING' && (
                  <div className="flex justify-between items-center pt-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleApproveFromModal(selectedReview.id)}
                        className="flex items-center space-x-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Check size={16} />
                        <span>Approve Review</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRejectFromModal(selectedReview.id)}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X size={16} />
                        <span>Reject Review</span>
                      </Button>
                    </div>
                    <Button variant="outline" onClick={handleCloseModal}>
                      Close
                    </Button>
                  </div>
                )}

                {selectedReview.status.toUpperCase() !== 'PENDING' && (
                  <div className="flex justify-end pt-4">
                    <Button variant="outline" onClick={handleCloseModal}>
                      Close
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Modal>
        </AdminLayout>
  );
};
