"use client";

import { cn } from "@/lib/utils";

interface EvalSummaryProps {
  evaluations: Record<string, "keep" | "trash" | "more" | null>;
  total: number;
}

export function EvalSummary({ evaluations, total }: EvalSummaryProps) {
  const counts = {
    keep: Object.values(evaluations).filter(e => e === "keep").length,
    trash: Object.values(evaluations).filter(e => e === "trash").length,
    more: Object.values(evaluations).filter(e => e === "more").length,
    pending: total - Object.values(evaluations).filter(e => e !== null).length,
  };

  const hasEvals = counts.keep > 0 || counts.trash > 0 || counts.more > 0;

  if (!hasEvals) {
    return (
      <div className="text-sm text-slate-400 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Click keep/trash/more on each asset to sort them
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
          counts.keep > 0 ? "bg-green-500 text-white" : "bg-slate-700 text-slate-400"
        )}>
          {counts.keep}
        </div>
        <span className="text-sm text-slate-400">Keep</span>
      </div>
      <div className="flex items-center gap-2">
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
          counts.trash > 0 ? "bg-red-500 text-white" : "bg-slate-700 text-slate-400"
        )}>
          {counts.trash}
        </div>
        <span className="text-sm text-slate-400">Trash</span>
      </div>
      <div className="flex items-center gap-2">
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
          counts.more > 0 ? "bg-yellow-500 text-white" : "bg-slate-700 text-slate-400"
        )}>
          {counts.more}
        </div>
        <span className="text-sm text-slate-400">More</span>
      </div>
      {counts.pending > 0 && (
        <div className="flex items-center gap-2 text-slate-500">
          <span className="text-sm">({counts.pending} unsorted)</span>
        </div>
      )}
    </div>
  );
}
