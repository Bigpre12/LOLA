"use client";

import { cn } from "@/lib/utils";

interface PricingDisplayProps {
  creditsRequired: number;
  costPerRun: number;
  userCredits?: number;
  className?: string;
  showComparison?: boolean;
}

export function PricingDisplay({
  creditsRequired,
  costPerRun,
  userCredits,
  className,
  showComparison = false,
}: PricingDisplayProps) {
  const hasEnoughCredits = userCredits !== undefined && userCredits >= creditsRequired;

  return (
    <div className={cn("bg-slate-800/50 rounded-xl p-4 border border-slate-700/50", className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-400">Cost for this run</span>
        {showComparison && (
          <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
            ~60% cheaper than Weavy
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white">{creditsRequired}</span>
        <span className="text-slate-400">credits</span>
        <span className="text-slate-600 mx-2">•</span>
        <span className="text-lg text-slate-300">${costPerRun.toFixed(2)}</span>
        <span className="text-sm text-slate-500">approx</span>
      </div>

      {userCredits !== undefined && (
        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Your balance</span>
            <span className={cn("font-medium", hasEnoughCredits ? "text-green-400" : "text-amber-400")}>
              {userCredits} credits
            </span>
          </div>
          {!hasEnoughCredits && (
            <p className="text-xs text-amber-400 mt-2">
              You need {creditsRequired - userCredits} more credits.{" "}
              <a href="/pricing" className="underline hover:text-amber-300">
                Upgrade plan
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface CostBreakdownProps {
  steps: { id: string; label?: string; model?: string }[];
  costPerStep?: number;
}

export function CostBreakdown({ steps, costPerStep = 0.10 }: CostBreakdownProps) {
  const totalCost = steps.length * costPerStep;

  return (
    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
      <h4 className="text-sm font-medium text-slate-300 mb-3">Cost breakdown</h4>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              {i + 1}. {step.label || step.id}
            </span>
            <span className="text-slate-500">${costPerStep.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">Total</span>
        <span className="text-lg font-bold text-white">${totalCost.toFixed(2)}</span>
      </div>
    </div>
  );
}
