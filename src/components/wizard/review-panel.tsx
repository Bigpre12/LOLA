"use client";

import { Template } from "@/types";
import { Badge } from "@/components/ui";

interface ReviewPanelProps {
  template: Template;
  inputs: Record<string, unknown>;
  options: Record<string, unknown>;
}

export function ReviewPanel({ template, inputs, options }: ReviewPanelProps) {
  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Run Summary</h3>
        
        <div className="space-y-4">
          {/* Template */}
          <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
            <span className="text-slate-400">Template</span>
            <span className="text-white font-medium">{template.name}</span>
          </div>

          {/* Inputs */}
          <div className="py-2 border-b border-slate-700/50">
            <span className="text-slate-400 text-sm">Inputs</span>
            <div className="mt-2 space-y-2">
              {template.inputSchema.fields.map((field) => {
                const value = inputs[field.key];
                return (
                  <div key={field.key} className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{field.label}</span>
                    <span className="text-sm text-white">
                      {field.type === "image" ? (
                        value ? (
                          <Badge variant="success">Uploaded</Badge>
                        ) : (
                          <Badge variant="warning">Not set</Badge>
                        )
                      ) : (
                        <span className="truncate max-w-[200px] inline-block">
                          {(value as string) || <Badge variant="warning">Not set</Badge>}
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Options */}
          <div className="py-2 border-b border-slate-700/50">
            <span className="text-slate-400 text-sm">Options</span>
            <div className="mt-2 space-y-2">
              {template.optionsSchema.fields.map((field) => {
                const value = options[field.key] ?? field.default;
                return (
                  <div key={field.key} className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{field.label}</span>
                    <span className="text-sm text-violet-400 font-medium">{String(value)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pipeline steps */}
          <div className="py-2">
            <span className="text-slate-400 text-sm">Pipeline steps</span>
            <div className="mt-2">
              <span className="text-white">{template.modelPipeline.steps.length} steps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Credit estimate */}
      <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl p-6 border border-violet-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Estimated cost</h4>
            <p className="text-sm text-slate-400">Based on pipeline complexity</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-violet-400">
              ~{template.estimatedCredits}
            </span>
            <span className="text-slate-400 ml-1">credits</span>
          </div>
        </div>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl">
        <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-slate-400">
          Under the hood this is a multi-step AI pipeline, but you don&apos;t have to see a node graph.
          Results typically take 30-60 seconds depending on pipeline complexity.
        </p>
      </div>
    </div>
  );
}
