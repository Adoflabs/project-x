'use client';

import { useState, useEffect } from 'react';
import { generateMockEmployees } from '@/lib/mock-data';
import { useAuthStore } from '@/stores';

export default function FormsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(() => generateMockEmployees(10));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<string, { quality: number; output: number; collaboration: number; notes: string }>>({});

  useEffect(() => {
    // In a real implementation, fetch employees from backend
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading forms...</p>
        </div>
      </div>
    );
  }

  const currentEmployee = employees[currentIndex];
  const currentRating = ratings[currentEmployee?.id] || { quality: 5, output: 5, collaboration: 5, notes: '' };

  const handleRatingChange = (field: 'quality' | 'output' | 'collaboration', value: number) => {
    setRatings((prev) => ({
      ...prev,
      [currentEmployee.id]: {
        ...currentRating,
        [field]: value,
      },
    }));
  };

  const handleNotesChange = (notes: string) => {
    setRatings((prev) => ({
      ...prev,
      [currentEmployee.id]: {
        ...currentRating,
        notes,
      },
    }));
  };

  const handleNext = () => {
    if (currentIndex < employees.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSaveDraft = () => {
    alert(`Draft saved for ${Object.keys(ratings).length} employees`);
  };

  const handleSubmitFinal = async () => {
    if (confirm(`Submit ratings for all ${Object.keys(ratings).length} employees?`)) {
      try {
        // In real implementation, submit to API
        alert('Ratings submitted successfully!');
        // Reset form
        setRatings({});
        setCurrentIndex(0);
      } catch (error) {
        alert('Failed to submit ratings');
      }
    }
  };

  const riskKeywords = ['struggling', 'burnout', 'leaving', 'frustrated', 'overwhelmed'];
  const hasRiskKeyword = riskKeywords.some((kw) => currentRating.notes.toLowerCase().includes(kw));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Manager Rating Forms</h1>
        <p className="text-text-secondary">Monthly performance ratings for your team</p>
      </div>

      {/* Progress */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">Progress</span>
          <span className="text-sm font-mono font-bold text-white">
            {currentIndex + 1} / {employees.length}
          </span>
        </div>
        <div className="relative h-2 bg-white/[0.05] rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/30 to-white/20 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / employees.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Rating Form */}
      {currentEmployee && (
        <div className="glass-card p-6">
          {/* Employee Info */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/[0.06]">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center text-2xl font-bold text-white">
              {currentEmployee.name?.[0]?.toUpperCase() || 'E'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">{currentEmployee.name}</h2>
              <p className="text-text-secondary">{currentEmployee.role} · {currentEmployee.department}</p>
              <p className="text-sm text-text-muted mt-1">Period: March 2026</p>
            </div>
          </div>

          {/* Rating Questions */}
          <div className="space-y-6">
            {/* Quality */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">
                Q1: Quality of deliverables this period?
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={currentRating.quality}
                onChange={(e) => handleRatingChange('quality', Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-text-muted mt-2">
                <span>1 (Poor)</span>
                <span className="font-mono font-bold text-white text-base">{currentRating.quality}/10</span>
                <span>10 (Excellent)</span>
              </div>
            </div>

            {/* Output */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">
                Q2: Volume/output met expectations?
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={currentRating.output}
                onChange={(e) => handleRatingChange('output', Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-text-muted mt-2">
                <span>1 (Poor)</span>
                <span className="font-mono font-bold text-white text-base">{currentRating.output}/10</span>
                <span>10 (Excellent)</span>
              </div>
            </div>

            {/* Collaboration */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">
                Q3: Collaboration and communication?
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={currentRating.collaboration}
                onChange={(e) => handleRatingChange('collaboration', Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-text-muted mt-2">
                <span>1 (Poor)</span>
                <span className="font-mono font-bold text-white text-base">{currentRating.collaboration}/10</span>
                <span>10 (Excellent)</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Notes (optional)
              </label>
              <textarea
                value={currentRating.notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Free-form notes about this employee's performance and development areas..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/[0.1] text-text-primary placeholder:text-text-muted outline-none focus:border-white/30 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.1)] transition-all resize-none"
              />
            </div>

            {/* Keyword Warning */}
            {hasRiskKeyword && (
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/30 animate-pulse-amber">
                <div className="flex items-start gap-3">
                  <div>
                    <div className="text-sm font-medium text-warning mb-1">Keyword detected</div>
                    <div className="text-xs text-text-secondary">
                      Your notes contain risk keywords. Would you like to schedule a 1:1 or flag this employee for review?
                    </div>
                    <button className="mt-2 text-xs text-warning hover:text-warning/80 transition-colors underline">
                      Log a 1:1 meeting
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.06]">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button 
              onClick={handleSaveDraft}
              className="px-4 py-2 rounded-lg border border-white/[0.1] hover:bg-white/[0.04] text-text-secondary text-sm transition-colors"
            >
              Save Draft
            </button>
            {currentIndex < employees.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-medium transition-colors"
              >
                Next →
              </button>
            ) : (
              <button 
                onClick={handleSubmitFinal}
                className="px-6 py-2 rounded-lg bg-success hover:bg-success/90 text-white text-sm font-medium transition-colors"
              >
                Submit Final
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      <div className="glass-card p-4">
        <div className="text-sm text-text-secondary">
          Rated {Object.keys(ratings).length} of {employees.length} team members
        </div>
      </div>
    </div>
  );
}
