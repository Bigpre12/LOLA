"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface AssetCardProps {
  url: string;
  stepId: string;
  label?: string;
  group?: string;
  variant?: string;
  onEval?: (evalType: "keep" | "trash" | "more") => void;
  evaluation?: "keep" | "trash" | "more" | null;
  onView?: () => void;
}

export function AssetCard({
  url,
  stepId,
  label,
  group,
  variant,
  onEval,
  evaluation,
  onView,
}: AssetCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${stepId}${variant ? `-${variant}` : ""}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div
      className="relative group rounded-xl overflow-hidden bg-slate-800/50 border border-slate-700/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Variant badge */}
      {variant && (
        <div className={cn(
          "absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-xs font-bold",
          variant === "A" ? "bg-blue-500 text-white" : "bg-orange-500 text-white"
        )}>
          {variant}
        </div>
      )}

      {/* Group badge */}
      {group && (
        <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full text-xs bg-slate-900/80 text-slate-300 backdrop-blur-sm">
          {group}
        </div>
      )}

      {/* Evaluation indicator */}
      {evaluation && (
        <div className={cn(
          "absolute inset-0 z-5 border-4 rounded-xl pointer-events-none",
          evaluation === "keep" ? "border-green-500 bg-green-500/10" :
          evaluation === "trash" ? "border-red-500 bg-red-500/10 opacity-50" :
          "border-yellow-500 bg-yellow-500/10"
        )} />
      )}

      {/* Image */}
      <button
        onClick={onView}
        className="w-full aspect-square cursor-pointer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={label || stepId}
          className={cn(
            "w-full h-full object-cover transition-all",
            evaluation === "trash" && "grayscale opacity-40"
          )}
        />
      </button>

      {/* Hover actions */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 transition-opacity",
        isHovered ? "opacity-100" : "opacity-0"
      )}>
        <p className="text-white text-sm font-medium truncate mb-2">
          {label || stepId}
        </p>
        
        {/* Quick eval buttons */}
        {onEval && (
          <div className="flex items-center gap-1 mb-2">
            <button
              onClick={() => onEval("keep")}
              className={cn(
                "flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1",
                evaluation === "keep"
                  ? "bg-green-500 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-green-500/20 hover:text-green-400"
              )}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Keep
            </button>
            <button
              onClick={() => onEval("trash")}
              className={cn(
                "flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1",
                evaluation === "trash"
                  ? "bg-red-500 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-red-500/20 hover:text-red-400"
              )}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Trash
            </button>
            <button
              onClick={() => onEval("more")}
              className={cn(
                "flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1",
                evaluation === "more"
                  ? "bg-yellow-500 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-yellow-500/20 hover:text-yellow-400"
              )}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              More
            </button>
          </div>
        )}

        {/* Download button */}
        <button
          onClick={handleDownload}
          className="w-full py-1.5 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </div>
    </div>
  );
}
