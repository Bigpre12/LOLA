"use client";

import { RunStatus } from "@/types";
import { cn } from "@/lib/utils";

interface RunStatusBadgeProps {
  status: RunStatus;
  className?: string;
}

const statusConfig: Record<RunStatus, { label: string; color: string; icon: React.ReactNode }> = {
  QUEUED: {
    label: "Queued",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: (
      <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  RUNNING: {
    label: "Running",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: (
      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  FAILED: {
    label: "Failed",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
};

export function RunStatusBadge({ status, className }: RunStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border",
        config.color,
        className
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

interface RunProgressProps {
  status: RunStatus;
  currentStep?: number;
  totalSteps?: number;
}

export function RunProgress({ status, currentStep = 0, totalSteps = 1 }: RunProgressProps) {
  const progress = status === "COMPLETED" ? 100 : (currentStep / totalSteps) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <RunStatusBadge status={status} />
        {status === "RUNNING" && (
          <span className="text-sm text-slate-400">
            Step {currentStep} of {totalSteps}
          </span>
        )}
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-500",
            status === "COMPLETED" ? "bg-green-500" :
            status === "FAILED" ? "bg-red-500" :
            "bg-violet-500"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
