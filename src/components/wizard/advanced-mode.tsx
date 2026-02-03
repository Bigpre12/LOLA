"use client";

import { useState } from "react";
import { ModelPipeline, PipelineStep } from "@/types";
import { cn } from "@/lib/utils";

interface AdvancedModeProps {
  pipeline: ModelPipeline;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function AdvancedMode({ pipeline, enabled, onToggle }: AdvancedModeProps) {
  return (
    <div className="mt-8 pt-6 border-t border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-slate-300">Advanced mode</h3>
          <p className="text-xs text-slate-500">View the underlying pipeline configuration</p>
        </div>
        <button
          onClick={() => onToggle(!enabled)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            enabled ? "bg-violet-500" : "bg-slate-700"
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              enabled ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
      </div>

      {enabled && (
        <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium text-slate-300">Under the hood</span>
              <span className="text-xs text-slate-500 ml-auto">{pipeline.steps.length} steps</span>
            </div>
          </div>
          
          <div className="p-4">
            <PipelineStepsList steps={pipeline.steps} />
          </div>
        </div>
      )}
    </div>
  );
}

interface PipelineStepsListProps {
  steps: PipelineStep[];
}

function PipelineStepsList({ steps }: PipelineStepsListProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden"
        >
          <button
            onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-700/30 transition-colors"
          >
            {/* Step number */}
            <div className="w-6 h-6 bg-violet-500/20 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-violet-400">{index + 1}</span>
            </div>
            
            {/* Step info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {step.label || step.id.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </p>
              <p className="text-xs text-slate-500">
                {step.type} • {step.model || "fal"}
              </p>
            </div>

            {/* Expand icon */}
            <svg
              className={cn(
                "w-4 h-4 text-slate-400 transition-transform",
                expandedStep === step.id && "rotate-180"
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Expanded content */}
          {expandedStep === step.id && (
            <div className="px-3 pb-3 pt-0">
              <div className="bg-slate-900/50 rounded-lg p-3 mt-2">
                <p className="text-xs text-slate-500 mb-1">Prompt template:</p>
                <p className="text-sm text-slate-300 font-mono whitespace-pre-wrap break-all">
                  {step.promptTemplate}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// JSON view for full pipeline
interface PipelineJsonViewProps {
  pipeline: ModelPipeline;
}

export function PipelineJsonView({ pipeline }: PipelineJsonViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(pipeline, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-700/50 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-mono">pipeline.json</span>
        <button
          onClick={handleCopy}
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 text-xs text-slate-300 font-mono overflow-x-auto">
        {JSON.stringify(pipeline, null, 2)}
      </pre>
    </div>
  );
}
