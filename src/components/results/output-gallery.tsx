"use client";

import { useState } from "react";
import { Output, PipelineStep } from "@/types";
import { Button } from "@/components/ui";

interface OutputGalleryProps {
  outputs: Output[];
  steps: PipelineStep[];
}

export function OutputGallery({ outputs, steps }: OutputGalleryProps) {
  const [selectedOutput, setSelectedOutput] = useState<Output | null>(null);

  // Group outputs by step
  const outputsByStep = outputs.reduce((acc, output) => {
    if (!acc[output.stepId]) {
      acc[output.stepId] = [];
    }
    acc[output.stepId].push(output);
    return acc;
  }, {} as Record<string, Output[]>);

  const getStepLabel = (stepId: string) => {
    const step = steps.find((s) => s.id === stepId);
    return step?.label || stepId.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: open in new tab
      window.open(url, "_blank");
    }
  };

  const handleDownloadAll = async () => {
    // Download all outputs sequentially
    for (let i = 0; i < outputs.length; i++) {
      const output = outputs[i];
      await handleDownload(output.url, `output-${output.stepId}-${i + 1}.png`);
      // Small delay between downloads
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  return (
    <div>
      {/* Download all button */}
      <div className="flex justify-end mb-6">
        <Button variant="outline" onClick={handleDownloadAll}>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download all
        </Button>
      </div>

      {/* Outputs grouped by step */}
      <div className="space-y-8">
        {Object.entries(outputsByStep).map(([stepId, stepOutputs]) => (
          <div key={stepId}>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-violet-500 rounded-full" />
              {getStepLabel(stepId)}
              <span className="text-sm font-normal text-slate-500">
                ({stepOutputs.length} {stepOutputs.length === 1 ? "output" : "outputs"})
              </span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {stepOutputs.map((output, index) => (
                <OutputCard
                  key={`${output.stepId}-${index}`}
                  output={output}
                  index={index}
                  onSelect={() => setSelectedOutput(output)}
                  onDownload={() => handleDownload(output.url, `${output.stepId}-${index + 1}.png`)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox modal */}
      {selectedOutput && (
        <OutputLightbox
          output={selectedOutput}
          onClose={() => setSelectedOutput(null)}
          onDownload={() => handleDownload(selectedOutput.url, `${selectedOutput.stepId}.png`)}
        />
      )}
    </div>
  );
}

interface OutputCardProps {
  output: Output;
  index: number;
  onSelect: () => void;
  onDownload: () => void;
}

function OutputCard({ output, onSelect, onDownload }: OutputCardProps) {
  return (
    <div className="group relative bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/50 hover:border-violet-500/50 transition-all">
      <div className="aspect-square cursor-pointer" onClick={onSelect}>
        <img
          src={output.url}
          alt={`Output ${output.stepId}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          title="View"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          title="Download"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

interface OutputLightboxProps {
  output: Output;
  onClose: () => void;
  onDownload: () => void;
}

function OutputLightbox({ output, onClose, onDownload }: OutputLightboxProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <img
          src={output.url}
          alt={`Output ${output.stepId}`}
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
        />

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-slate-400">
            {output.meta.prompt && (
              <p className="max-w-lg truncate" title={output.meta.prompt}>
                Prompt: {output.meta.prompt}
              </p>
            )}
          </div>
          <Button onClick={onDownload}>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
