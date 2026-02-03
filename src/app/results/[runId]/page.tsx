"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent } from "@/components/ui";
import { RunProgress, AssetCard, BundleExportButton, EvalSummary } from "@/components/results";
import { FeedbackModal, FeedbackPrompt } from "@/components/feedback";
import { formatDate, cn } from "@/lib/utils";

interface Output {
  stepId: string;
  url: string;
  meta?: {
    prompt?: string;
    group?: string;
    variant?: string;
    label?: string;
  };
}

interface PipelineStep {
  id: string;
  label?: string;
  group?: string;
  variant?: string;
}

interface Run {
  id: string;
  status: "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED";
  outputs: Output[] | null;
  error: string | null;
  createdAt: string;
  inputs: Record<string, unknown>;
  template: {
    id: string;
    name: string;
    slug: string;
    modelPipeline: { steps: PipelineStep[] };
  };
}

export default function ResultsPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = use(params);
  const _router = useRouter();
  void _router; // Available for future navigation
  const [run, setRun] = useState<Run | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<Record<string, "keep" | "trash" | "more" | null>>({});
  const [showFeedbackPrompt, setShowFeedbackPrompt] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [activeVariant, setActiveVariant] = useState<"all" | "A" | "B">("all");

  // Fetch run data
  useEffect(() => {
    const fetchRun = async () => {
      try {
        const response = await fetch(`/api/runs/${runId}`);
        if (!response.ok) throw new Error("Failed to fetch run");
        const data = await response.json();
        setRun(data);

        // Show feedback prompt after completion
        if (data.status === "COMPLETED" && !feedbackSubmitted) {
          setTimeout(() => setShowFeedbackPrompt(true), 2000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load run");
      }
    };

    fetchRun();
    
    // Poll if running
    const interval = setInterval(() => {
      if (run?.status === "QUEUED" || run?.status === "RUNNING") {
        fetchRun();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [runId, run?.status, feedbackSubmitted]);

  // Handle evaluation
  const handleEval = (stepId: string, evalType: "keep" | "trash" | "more") => {
    setEvaluations(prev => ({
      ...prev,
      [stepId]: prev[stepId] === evalType ? null : evalType,
    }));
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async (feedback: { rating: number; hitTheMark: boolean; feedback?: string; issues?: string[] }) => {
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          runId,
          ...feedback,
        }),
      });
      setFeedbackSubmitted(true);
      setShowFeedbackModal(false);
      setShowFeedbackPrompt(false);
    } catch (err) {
      console.error("Feedback submit error:", err);
    }
  };

  // Get outputs with metadata from pipeline
  const getEnhancedOutputs = (): Output[] => {
    if (!run?.outputs || !run.template.modelPipeline?.steps) return [];
    
    const stepMeta = new Map(
      run.template.modelPipeline.steps.map(s => [s.id, { group: s.group, variant: s.variant, label: s.label }])
    );

    return run.outputs.map(output => ({
      ...output,
      meta: {
        ...output.meta,
        ...stepMeta.get(output.stepId),
      },
    }));
  };

  const enhancedOutputs = getEnhancedOutputs();

  // Get unique groups
  const groups = Array.from(new Set(enhancedOutputs.map(o => o.meta?.group).filter(Boolean))) as string[];

  // Filter outputs
  const filteredOutputs = enhancedOutputs.filter(output => {
    if (activeGroup && output.meta?.group !== activeGroup) return false;
    if (activeVariant !== "all" && output.meta?.variant !== activeVariant) return false;
    return true;
  });

  // Group outputs by group
  const groupedOutputs = groups.length > 0
    ? groups.map(group => ({
        group,
        outputs: filteredOutputs.filter(o => o.meta?.group === group),
      }))
    : [{ group: "All", outputs: filteredOutputs }];

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Error loading results</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <Link href="/dashboard">
              <Button className="w-full">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  const isRunning = run.status === "QUEUED" || run.status === "RUNNING";
  const isCompleted = run.status === "COMPLETED";
  const productName = (run.inputs.productName as string) || (run.inputs.productDescription as string)?.slice(0, 40) || "Product";

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/start" className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-white font-semibold">{productName}</h1>
                <p className="text-sm text-slate-400">{run.template.name} • {formatDate(run.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isCompleted && (
                <BundleExportButton runId={runId} />
              )}
              <Link href={`/run/${run.template.slug}?remix=${runId}`}>
                <Button variant="outline">Remix</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Running state */}
      {isRunning && (
        <div className="max-w-2xl mx-auto px-4 py-16">
          <RunProgress
            status={run.status}
            totalSteps={run.template.modelPipeline?.steps?.length || 0}
            currentStep={run.outputs?.length || 0}
          />
        </div>
      )}

      {/* Failed state */}
      {run.status === "FAILED" && (
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="border-red-500/50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Run failed</h2>
              <p className="text-slate-400 mb-6">{run.error || "Something went wrong"}</p>
              <Link href={`/run/${run.template.slug}`}>
                <Button>Try again</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Completed state - Asset gallery */}
      {isCompleted && enhancedOutputs.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Feedback prompt */}
          {showFeedbackPrompt && !feedbackSubmitted && (
            <div className="mb-6">
              <FeedbackPrompt
                onOpenModal={() => {
                  setShowFeedbackPrompt(false);
                  setShowFeedbackModal(true);
                }}
                onDismiss={() => setShowFeedbackPrompt(false)}
              />
            </div>
          )}

          {/* Filter bar */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Group filters */}
              <button
                onClick={() => setActiveGroup(null)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm transition-colors",
                  activeGroup === null
                    ? "bg-violet-500 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                )}
              >
                All ({enhancedOutputs.length})
              </button>
              {groups.map(group => (
                <button
                  key={group}
                  onClick={() => setActiveGroup(activeGroup === group ? null : group)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm transition-colors",
                    activeGroup === group
                      ? "bg-violet-500 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  )}
                >
                  {group} ({enhancedOutputs.filter(o => o.meta?.group === group).length})
                </button>
              ))}
            </div>

            {/* Variant filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Variant:</span>
              <div className="flex items-center bg-slate-800 rounded-lg p-1">
                {(["all", "A", "B"] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setActiveVariant(v)}
                    className={cn(
                      "px-3 py-1 rounded-md text-sm transition-colors",
                      activeVariant === v
                        ? v === "A" ? "bg-blue-500 text-white" : v === "B" ? "bg-orange-500 text-white" : "bg-violet-500 text-white"
                        : "text-slate-300 hover:bg-slate-700"
                    )}
                  >
                    {v === "all" ? "All" : v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Eval summary */}
          <div className="mb-6">
            <EvalSummary evaluations={evaluations} total={enhancedOutputs.length} />
          </div>

          {/* Assets by group */}
          {groupedOutputs.filter(g => g.outputs.length > 0).map(({ group, outputs }) => (
            <div key={group} className="mb-8">
              {groups.length > 0 && (
                <h2 className="text-lg font-semibold text-white mb-4">{group}</h2>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {outputs.map(output => (
                  <AssetCard
                    key={output.stepId}
                    url={output.url}
                    stepId={output.stepId}
                    label={output.meta?.label}
                    group={output.meta?.group}
                    variant={output.meta?.variant}
                    evaluation={evaluations[output.stepId]}
                    onEval={(evalType) => handleEval(output.stepId, evalType)}
                    onView={() => setLightboxImage(output.url)}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Download kept only */}
          {Object.values(evaluations).some(e => e === "keep") && (
            <div className="mt-8 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Ready to export your selections?</p>
                  <p className="text-sm text-slate-400">
                    {Object.values(evaluations).filter(e => e === "keep").length} assets marked as keep
                  </p>
                </div>
                <BundleExportButton runId={runId} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-slate-300 transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxImage}
            alt="Full size"
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Feedback modal */}
      {showFeedbackModal && (
        <FeedbackModal
          runId={runId}
          templateId={run.template.id}
          templateName={run.template.name}
          onSubmit={handleFeedbackSubmit}
          onDismiss={() => setShowFeedbackModal(false)}
        />
      )}
    </div>
  );
}
