"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface FeedbackModalProps {
  runId: string;
  templateId: string;
  templateName: string;
  onSubmit: (feedback: FeedbackData) => Promise<void>;
  onDismiss: () => void;
}

interface FeedbackData {
  rating: number;
  hitTheMark: boolean;
  feedback?: string;
  issues?: string[];
}

const issueOptions = [
  { id: "wrong_style", label: "Wrong style/look" },
  { id: "low_quality", label: "Low quality" },
  { id: "missing_element", label: "Missing elements" },
  { id: "wrong_composition", label: "Wrong composition" },
  { id: "text_issues", label: "Text rendering issues" },
  { id: "too_slow", label: "Too slow" },
];

export function FeedbackModal({
  runId: _runId,
  templateId: _templateId,
  templateName,
  onSubmit,
  onDismiss,
}: FeedbackModalProps) {
  // runId and templateId are used by parent component for API calls
  void _runId;
  void _templateId;
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [hitTheMark, setHitTheMark] = useState<boolean | null>(null);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0 || hitTheMark === null) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        rating,
        hitTheMark,
        feedback: feedback || undefined,
        issues: selectedIssues.length > 0 ? selectedIssues : undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleIssue = (issueId: string) => {
    setSelectedIssues((prev) =>
      prev.includes(issueId)
        ? prev.filter((id) => id !== issueId)
        : [...prev, issueId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl max-w-md w-full border border-slate-700/50 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Quick feedback</h2>
            <button
              onClick={onDismiss}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Help us improve &ldquo;{templateName}&rdquo;
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              {/* Hit the mark question */}
              <div>
                <p className="text-white font-medium mb-3">
                  Did this output hit what you needed?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setHitTheMark(true)}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2",
                      hitTheMark === true
                        ? "border-green-500 bg-green-500/10 text-green-400"
                        : "border-slate-700 text-slate-300 hover:border-slate-600"
                    )}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Yes!
                  </button>
                  <button
                    onClick={() => setHitTheMark(false)}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2",
                      hitTheMark === false
                        ? "border-amber-500 bg-amber-500/10 text-amber-400"
                        : "border-slate-700 text-slate-300 hover:border-slate-600"
                    )}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Not quite
                  </button>
                </div>
              </div>

              {/* Star rating */}
              <div>
                <p className="text-white font-medium mb-3">Rate the output quality</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <svg
                        className={cn(
                          "w-8 h-8 transition-colors",
                          star <= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600"
                        )}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Issue tags */}
              {hitTheMark === false && (
                <div>
                  <p className="text-white font-medium mb-3">What went wrong? (optional)</p>
                  <div className="flex flex-wrap gap-2">
                    {issueOptions.map((issue) => (
                      <button
                        key={issue.id}
                        onClick={() => toggleIssue(issue.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm transition-all",
                          selectedIssues.includes(issue.id)
                            ? "bg-violet-500 text-white"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        )}
                      >
                        {issue.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Free text feedback */}
              <div>
                <p className="text-white font-medium mb-3">Any other feedback? (optional)</p>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us how we can improve this template..."
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700/50 flex items-center justify-between">
          {step === 1 ? (
            <>
              <Button variant="ghost" onClick={onDismiss}>
                Skip
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={rating === 0 || hitTheMark === null}
              >
                Continue
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit feedback"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Mini feedback prompt shown after run completes
export function FeedbackPrompt({
  onOpenModal,
  onDismiss,
}: {
  onOpenModal: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl p-4 border border-violet-500/20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-violet-500/20 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-white font-medium">Did this hit the mark?</p>
          <p className="text-sm text-slate-400">Quick feedback helps us improve</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          Skip
        </Button>
        <Button size="sm" onClick={onOpenModal}>
          Rate this
        </Button>
      </div>
    </div>
  );
}
