import React, { useState } from 'react';
import { X, Star, CheckCircle, Award } from 'lucide-react';
import { SellerInfo, SellerReview } from '../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: SellerInfo | null;
  onSubmitReview: (review: SellerReview) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  seller,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !seller) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newReview: SellerReview = {
      id: `rev-${Date.now()}`,
      sellerId: seller.id,
      reviewerName: reviewerName.trim() || 'Verified Buyer',
      rating,
      comment: comment.trim(),
      date: 'Today',
      verifiedTransaction: true,
    };

    onSubmitReview(newReview);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setComment('');
    setReviewerName('');
    setRating(5);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base font-display text-white">
                Review Seller: {seller.name}
              </h3>
              <p className="text-[11px] text-slate-300">
                Verified Commercial Transaction Feedback
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {/* Star Picker */}
            <div className="text-center py-2 space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                Overall Service & Asset Rating
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition transform hover:scale-110 cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs font-semibold text-slate-600">
                {rating === 5 && 'Outstanding • Highly Recommended'}
                {rating === 4 && 'Very Good • Smooth Transaction'}
                {rating === 3 && 'Average • Met Expectations'}
                {rating === 2 && 'Below Expectations'}
                {rating === 1 && 'Unsatisfactory'}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Your Feedback & Experience *
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience regarding physical inspection, paperwork accuracy, pricing transparency, and delivery..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Your Name / Company
              </label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Barrister Folake Adeyemi"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="py-2 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-900/10"
              >
                <Star className="w-3.5 h-3.5 fill-slate-950" />
                <span>Submit Review</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-base">
                Review Published!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you for contributing to transparency in Nigeria’s property and equipment marketplace.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="py-2 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
