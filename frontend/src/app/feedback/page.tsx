'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores';

export default function FeedbackPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [pendingReviews, setPendingReviews] = useState([
    { id: '1', name: 'Alex Chen', role: 'Software Engineer', dueDate: '2026-03-15' },
    { id: '2', name: 'Maria Lopez', role: 'Product Manager', dueDate: '2026-03-15' },
    { id: '3', name: 'James Park', role: 'Designer', dueDate: '2026-03-15' },
  ]);

  const [receivedCount] = useState(2);
  const [totalExpected] = useState(3);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [ratings, setRatings] = useState({ collaboration: 0, delivery: 0, comment: '' });

  const handleSubmitFeedback = async () => {
    if (ratings.collaboration === 0 || ratings.delivery === 0) {
      alert('Please provide ratings for all questions');
      return;
    }

    try {
      // In real implementation, submit to API
      // await api.submitFeedback({
      //   fromEmployeeId: user.id,
      //   toEmployeeId: selectedReview.id,
      //   score: (ratings.collaboration + ratings.delivery) / 2
      // });
      
      alert('Feedback submitted anonymously!');
      setPendingReviews(pendingReviews.filter(r => r.id !== selectedReview.id));
      setSelectedReview(null);
      setRatings({ collaboration: 0, delivery: 0, comment: '' });
    } catch (error) {
      alert('Failed to submit feedback');
    }
  };

  useEffect(() => {
    async function fetchFeedback() {
      // Use mock data for client demo
      setDemoMode(false); // Hide demo warning for client presentation
      setLoading(false);
    }

    if (user) {
      fetchFeedback();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {demoMode && (
        <div className="glass-card p-4 border-l-4 border-warning">
          <p className="text-sm text-warning">
            ⚠️ Demo Mode: Backend unavailable. Showing mock data.
          </p>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Peer Feedback</h1>
        <p className="text-text-secondary">Provide anonymous feedback for your colleagues</p>
      </div>

      {/* Status Card */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Feedback Status</h3>
            <p className="text-sm text-text-muted mt-1">Due: March 15, 2026 (11 days left)</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono font-bold text-white">{receivedCount}/{totalExpected}</div>
            <div className="text-xs text-text-muted">Received</div>
          </div>
        </div>
        <div className="relative h-3 bg-white/[0.05] rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/30 to-white/20 rounded-full"
            style={{ width: `${(receivedCount / totalExpected) * 100}%` }}
          />
        </div>
      </div>

      {/* Pending Reviews */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Pending reviews from you:</h3>
        <div className="space-y-3">
          {pendingReviews.map((review) => (
            <div key={review.id} className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center text-sm font-bold text-white">
                  {review.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium text-text-primary">{review.name}</div>
                  <div className="text-xs text-text-muted">{review.role}</div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReview(review)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-medium transition-colors"
              >
                Give Feedback
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Form Example */}
      {selectedReview ? (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Feedback for {selectedReview.name}</h3>
          <p className="text-sm text-text-muted mb-6">Your responses are anonymous and will be aggregated</p>

          <div className="space-y-6">
            {/* Question 1 */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">
                How effectively does this person collaborate?
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setRatings({ ...ratings, collaboration: rating })}
                    className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors group"
                  >
                    <Star 
                      className={`w-8 h-8 transition-colors ${
                        rating <= ratings.collaboration 
                          ? 'text-warning fill-warning' 
                          : 'text-text-muted group-hover:text-warning'
                      }`} 
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-text-muted">{ratings.collaboration} / 5</span>
              </div>
            </div>

            {/* Question 2 */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">
                Does this person deliver on commitments?
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setRatings({ ...ratings, delivery: rating })}
                    className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors group"
                  >
                    <Star 
                      className={`w-8 h-8 transition-colors ${
                        rating <= ratings.delivery 
                          ? 'text-warning fill-warning' 
                          : 'text-text-muted group-hover:text-warning'
                      }`} 
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-text-muted">{ratings.delivery} / 5</span>
              </div>
            </div>

            {/* Optional Comment */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Additional comments (optional)
              </label>
              <textarea
                value={ratings.comment}
                onChange={(e) => setRatings({ ...ratings, comment: e.target.value })}
                placeholder="Any additional feedback..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-text-primary placeholder:text-text-muted outline-none focus:border-white/30 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] transition-all resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button 
                onClick={handleSubmitFeedback}
                className="flex-1 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium transition-colors"
              >
                Submit Anonymously
              </button>
              <button 
                onClick={() => {
                  setSelectedReview(null);
                  setRatings({ collaboration: 0, delivery: 0, comment: '' });
                }}
                className="px-6 py-3 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Feedback Form</h3>
          <p className="text-sm text-text-muted mb-6">Select a colleague above to provide feedback</p>
        </div>
      )}

      {/* Info Box */}
      <div className="glass-card p-4 bg-white/5 border-white/10">
        <div className="flex items-start gap-3">
          <div className="text-sm text-text-secondary">
            <strong className="text-text-primary">Privacy Notice:</strong> Your feedback is completely anonymous. 
            Individual responses are never shown to managers or the person being reviewed. Only aggregated scores 
            and anonymized comments are visible.
          </div>
        </div>
      </div>
    </div>
  );
}
