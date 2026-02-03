"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface OnboardingModalProps {
  onComplete: (preferences: {
    primaryUseCase: string;
    usedAdvancedTools: boolean;
  }) => void;
  onSkip: () => void;
}

const useCaseOptions = [
  {
    id: "ecommerce",
    label: "Ecommerce product photos",
    description: "Product galleries, lifestyle shots, Amazon listings",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    id: "social_ads",
    label: "Social media ads",
    description: "Instagram, Facebook, TikTok ad creatives",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
  },
  {
    id: "brand_visuals",
    label: "Brand visuals",
    description: "Marketing materials, brand assets, promotional content",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    id: "not_sure",
    label: "Not sure yet",
    description: "I want to explore what's possible",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export function OnboardingModal({ onComplete, onSkip }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null);
  const [usedAdvancedTools, setUsedAdvancedTools] = useState<boolean | null>(null);

  const handleNext = () => {
    if (step === 1 && selectedUseCase) {
      setStep(2);
    } else if (step === 2 && usedAdvancedTools !== null) {
      onComplete({
        primaryUseCase: selectedUseCase!,
        usedAdvancedTools,
      });
    }
  };

  const canProceed =
    (step === 1 && selectedUseCase !== null) ||
    (step === 2 && usedAdvancedTools !== null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-700/50 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <span className="font-semibold text-white">LOLA</span>
            </div>
            <button
              onClick={onSkip}
              className="text-slate-400 hover:text-white text-sm transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2">
            <div className={cn("h-1 flex-1 rounded-full", step >= 1 ? "bg-violet-500" : "bg-slate-700")} />
            <div className={cn("h-1 flex-1 rounded-full", step >= 2 ? "bg-violet-500" : "bg-slate-700")} />
          </div>
          <p className="text-xs text-slate-500 mt-2">Step {step} of 2</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                What are you here to make?
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                This helps us show you the most relevant templates first.
              </p>

              <div className="space-y-3">
                {useCaseOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedUseCase(option.id)}
                    className={cn(
                      "w-full flex items-start gap-4 p-4 rounded-xl border transition-all text-left",
                      selectedUseCase === option.id
                        ? "bg-violet-500/10 border-violet-500"
                        : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        selectedUseCase === option.id
                          ? "bg-violet-500/20 text-violet-400"
                          : "bg-slate-700 text-slate-400"
                      )}
                    >
                      {option.icon}
                    </div>
                    <div>
                      <p className="text-white font-medium">{option.label}</p>
                      <p className="text-sm text-slate-400">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Have you used Weavy, ComfyUI, or node-based tools?
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                If yes, we&apos;ll show you an &ldquo;Advanced mode&rdquo; toggle that reveals the underlying pipeline.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setUsedAdvancedTools(true)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                    usedAdvancedTools === true
                      ? "bg-violet-500/10 border-violet-500"
                      : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                      usedAdvancedTools === true
                        ? "bg-violet-500/20 text-violet-400"
                        : "bg-slate-700 text-slate-400"
                    )}
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Yes, I&apos;m familiar with them</p>
                    <p className="text-sm text-slate-400">Show me advanced options when available</p>
                  </div>
                </button>

                <button
                  onClick={() => setUsedAdvancedTools(false)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                    usedAdvancedTools === false
                      ? "bg-violet-500/10 border-violet-500"
                      : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                      usedAdvancedTools === false
                        ? "bg-violet-500/20 text-violet-400"
                        : "bg-slate-700 text-slate-400"
                    )}
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">No, I&apos;m new to this</p>
                    <p className="text-sm text-slate-400">Keep it simple for now</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700/50">
          <div className="flex items-center justify-between">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <div />
            )}
            <Button onClick={handleNext} disabled={!canProceed}>
              {step === 2 ? "Get started" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
