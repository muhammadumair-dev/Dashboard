import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/Modals/Modal';
import { CardGridSkeleton } from '../../components/Skeletons/Skeletons';
import { Review } from '../../types';
import { 
  MessageSquare, 
  Star, 
  Check, 
  X, 
  Trash2, 
  Filter, 
  ThumbsUp, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const Comments: React.FC = () => {
  const { 
    reviews, 
    isLoading, 
    approveReview, 
    rejectReview, 
    deleteReview 
  } = useApp();

  // Filter States
  const [statusFilter, setStatusFilter] = useState<'All' | 'Approved' | 'Pending' | 'Rejected'>('All');
  const [ratingFilter, setRatingFilter] = useState<number | 'All'>('All');

  // Deletion Modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  // 1. Compute Analytics Metrics
  const totalReviews = reviews.length;
  
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  const pendingCount = reviews.filter(r => r.status === 'Pending').length;
  const approvedCount = reviews.filter(r => r.status === 'Approved').length;

  // 2. Stars Renderer Helper
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`w-4.5 h-4.5 ${
              i < rating 
                ? 'fill-amber-400 text-amber-400' 
                : 'text-slate-200 dark:text-slate-800'
            }`} 
          />
        ))}
      </div>
    );
  };

  // 3. Status Badge Mapper
  const getStatusBadge = (status: Review['status']) => {
    const map = {
      Approved: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
      Pending: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
      Rejected: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30'
    };

    return (
      <span className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${map[status]}`}>
        {status}
      </span>
    );
  };

  // 4. Delete trigger
  const handleOpenDelete = (review: Review) => {
    setReviewToDelete(review);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (reviewToDelete) {
      const success = await deleteReview(reviewToDelete.id);
      if (success) {
        setIsDeleteOpen(false);
        setReviewToDelete(null);
      }
    }
  };

  // 5. Apply Filter Logic
  const filteredReviews = reviews.filter(r => {
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesRating = ratingFilter === 'All' || r.rating === ratingFilter;
    return matchesStatus && matchesRating;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
          Customer Reviews & Comments
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Moderate review listings, approve product feedback, and monitor user satisfaction scores.
        </p>
      </div>

      {/* Moderation Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">TOTAL REVIEWS</span>
            <span className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">{totalReviews}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">SATISFACTION SCORE</span>
            <span className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">{averageRating} / 5.0</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
            <AlertCircle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">PENDING MODERATION</span>
            <span className="text-xl font-extrabold text-rose-600 dark:text-rose-450 mt-0.5">{pendingCount}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">APPROVED & LIVE</span>
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-450 mt-0.5">{approvedCount}</span>
          </div>
        </div>
      </div>

      {/* Moderation Toolbar Filter */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {/* Status Tab filters */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 self-start">
          {(['All', 'Approved', 'Pending', 'Rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === tab 
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Star Rating filter select */}
        <div className="sm:ml-auto flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl px-3 bg-slate-50 dark:bg-slate-950 h-10 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value === 'All' ? 'All' : parseInt(e.target.value))}
            className="bg-transparent border-none text-xs font-semibold focus:outline-none dark:text-slate-200 cursor-pointer w-full sm:w-auto"
          >
            <option value="All">All Star Ratings</option>
            <option value="5">5 Stars only</option>
            <option value="4">4 Stars & up</option>
            <option value="3">3 Stars & up</option>
            <option value="2">2 Stars & up</option>
            <option value="1">1 Star only</option>
          </select>
        </div>
      </div>

      {/* Review Cards Grid */}
      {isLoading.reviews ? (
        <CardGridSkeleton count={4} />
      ) : filteredReviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-4">
            <HelpCircle className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No reviews match your filters</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            Try resetting your moderation filters or wait for website visitors to write reviews.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map(review => (
            <div 
              key={review.id} 
              className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header: User & Rating & Status */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold text-indigo-600 dark:text-indigo-400 border border-slate-100 dark:border-slate-850">
                      {review.customerName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block">{review.customerName}</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        {new Date(review.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {getStatusBadge(review.status)}
                    {renderStars(review.rating)}
                  </div>
                </div>

                {/* Target Product Description */}
                <div className="p-2 py-1.5 rounded-lg border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/30 text-xs font-semibold text-slate-600 dark:text-slate-300 inline-block">
                  Product: <span className="text-indigo-600 dark:text-indigo-450">{review.productName}</span>
                </div>

                {/* Review Message Text */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic p-3 rounded-xl bg-slate-50/20 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-850">
                  "{review.reviewText}"
                </p>
              </div>

              {/* Action Moderation Toolbar */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-105 border-t border-slate-100 dark:border-slate-800">
                <div className="flex gap-2">
                  {/* Approve Action */}
                  {review.status !== 'Approved' && (
                    <button
                      onClick={() => approveReview(review.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                      title="Approve and Publish Review"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve
                    </button>
                  )}
                  {/* Reject Action */}
                  {review.status !== 'Rejected' && (
                    <button
                      onClick={() => rejectReview(review.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                      title="Reject Review"
                    >
                      <X className="w-3.5 h-3.5 text-amber-500" />
                      Reject
                    </button>
                  )}
                </div>
                {/* Delete Action */}
                <button
                  onClick={() => handleOpenDelete(review)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 text-rose-500 hover:text-rose-750 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Review Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Customer Review"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Are you sure you want to permanently delete the review by <span className="font-bold text-slate-800 dark:text-white">"{reviewToDelete?.customerName}"</span>? 
            This review will be permanently deleted from the database.
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsDeleteOpen(false)}
              className="px-4.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              No, Keep
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-4.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
