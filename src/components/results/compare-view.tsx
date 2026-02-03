"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface CompareViewProps {
  outputs: Array<{
    stepId: string;
    url: string;
    meta?: {
      label?: string;
      variant?: string;
      group?: string;
    };
  }>;
  onClose: () => void;
}

type CompareMode = "side-by-side" | "slider" | "grid";

export function CompareView({ outputs, onClose }: CompareViewProps) {
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>(
    outputs.slice(0, 2).map(o => o.stepId)
  );
  const [mode, setMode] = useState<CompareMode>("side-by-side");
  const [sliderPosition, setSliderPosition] = useState(50);

  const toggleSelect = (stepId: string) => {
    if (selectedOutputs.includes(stepId)) {
      if (selectedOutputs.length > 2) {
        setSelectedOutputs(prev => prev.filter(id => id !== stepId));
      }
    } else if (selectedOutputs.length < 4) {
      setSelectedOutputs(prev => [...prev, stepId]);
    }
  };

  const selectedImages = outputs.filter(o => selectedOutputs.includes(o.stepId));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-white">Compare Outputs</h2>
          <span className="text-sm text-slate-400">
            {selectedOutputs.length} of {outputs.length} selected (max 4)
          </span>
        </div>

        {/* Mode switcher */}
        <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
          {([
            { id: "side-by-side", icon: "◫", label: "Side by Side" },
            { id: "slider", icon: "⟷", label: "Slider" },
            { id: "grid", icon: "⊞", label: "Grid" },
          ] as const).map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm transition-colors",
                mode === m.id
                  ? "bg-violet-500 text-white"
                  : "text-slate-400 hover:text-white"
              )}
              title={m.label}
            >
              {m.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Main compare area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Thumbnail sidebar */}
        <div className="w-32 border-r border-slate-800 overflow-y-auto p-2 space-y-2">
          {outputs.map(output => (
            <button
              key={output.stepId}
              onClick={() => toggleSelect(output.stepId)}
              className={cn(
                "w-full aspect-square rounded-lg overflow-hidden border-2 transition-all relative",
                selectedOutputs.includes(output.stepId)
                  ? "border-violet-500 ring-2 ring-violet-500/30"
                  : "border-slate-700 hover:border-slate-600"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={output.url} alt={output.meta?.label || output.stepId} className="w-full h-full object-cover" />
              {selectedOutputs.includes(output.stepId) && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {selectedOutputs.indexOf(output.stepId) + 1}
                </div>
              )}
              {output.meta?.variant && (
                <div className={cn(
                  "absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-xs font-bold",
                  output.meta.variant === "A" ? "bg-blue-500 text-white" : "bg-orange-500 text-white"
                )}>
                  {output.meta.variant}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Compare canvas */}
        <div className="flex-1 p-4 overflow-hidden">
          {mode === "side-by-side" && (
            <div className="h-full flex gap-4">
              {selectedImages.map(img => (
                <div key={img.stepId} className="flex-1 flex flex-col">
                  <div className="flex-1 relative rounded-xl overflow-hidden bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.meta?.label || img.stepId}
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-white font-medium">{img.meta?.label || img.stepId}</p>
                    {img.meta?.variant && (
                      <span className={cn(
                        "inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold",
                        img.meta.variant === "A" ? "bg-blue-500 text-white" : "bg-orange-500 text-white"
                      )}>
                        Variant {img.meta.variant}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {mode === "slider" && selectedImages.length >= 2 && (
            <div className="h-full flex flex-col">
              <div className="flex-1 relative rounded-xl overflow-hidden bg-slate-900">
                {/* Base image (second selected) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImages[1].url}
                  alt={selectedImages[1].meta?.label || selectedImages[1].stepId}
                  className="absolute inset-0 w-full h-full object-contain"
                />
                
                {/* Overlay image (first selected) with clip */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedImages[0].url}
                    alt={selectedImages[0].meta?.label || selectedImages[0].stepId}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>

                {/* Slider handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
                  style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-sm text-white">
                  {selectedImages[0].meta?.label || selectedImages[0].stepId}
                </div>
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-sm text-white">
                  {selectedImages[1].meta?.label || selectedImages[1].stepId}
                </div>
              </div>

              {/* Slider control */}
              <div className="mt-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {mode === "grid" && (
            <div className="h-full grid grid-cols-2 gap-4">
              {selectedImages.map(img => (
                <div key={img.stepId} className="relative rounded-xl overflow-hidden bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.meta?.label || img.stepId}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
                    <p className="text-white font-medium text-sm">{img.meta?.label || img.stepId}</p>
                    {img.meta?.variant && (
                      <span className={cn(
                        "inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold",
                        img.meta.variant === "A" ? "bg-blue-500 text-white" : "bg-orange-500 text-white"
                      )}>
                        Variant {img.meta.variant}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between">
        <div className="text-sm text-slate-400">
          Click thumbnails on the left to select images for comparison
        </div>
        <Button onClick={onClose}>Done</Button>
      </div>
    </div>
  );
}
