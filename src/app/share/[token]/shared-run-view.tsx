"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";

interface Output {
  stepId: string;
  url: string;
  meta?: {
    label?: string;
    group?: string;
    variant?: string;
  };
}

interface PipelineStep {
  id: string;
  label?: string;
  group?: string;
  variant?: string;
}

interface Comment {
  id: string;
  authorName: string;
  content: string;
  assetId?: string | null;
  isResolved: boolean;
  createdAt: Date;
}

interface SharedRunViewProps {
  shareLink: {
    id: string;
    allowDownload: boolean;
    allowComments: boolean;
    requiresEmail: boolean;
  };
  run: {
    id: string;
    outputs: unknown;
    inputs: unknown;
    createdAt: Date;
  };
  template: {
    name: string;
    slug: string;
    modelPipeline: unknown;
  };
  comments: Comment[];
}

export function SharedRunView({ shareLink, run, template, comments: initialComments }: SharedRunViewProps) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const outputs = (run.outputs || []) as Output[];
  const inputs = run.inputs as Record<string, unknown>;
  const pipeline = template.modelPipeline as { steps: PipelineStep[] };

  // Enhance outputs with pipeline metadata
  const stepMeta = new Map(
    pipeline?.steps?.map(s => [s.id, { group: s.group, variant: s.variant, label: s.label }]) || []
  );
  
  const enhancedOutputs = outputs.map(o => ({
    ...o,
    meta: { ...o.meta, ...stepMeta.get(o.stepId) },
  }));

  const groups = Array.from(new Set(enhancedOutputs.map(o => o.meta?.group).filter(Boolean))) as string[];

  const handleDownload = async (url: string, filename: string) => {
    if (!shareLink.allowDownload) return;
    
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/share/${shareLink.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          authorName,
          assetId: selectedAsset,
        }),
      });

      if (response.ok) {
        const { comment } = await response.json();
        setComments(prev => [comment, ...prev]);
        setNewComment("");
        setSelectedAsset(null);
      }
    } catch (error) {
      console.error("Comment submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const productName = (inputs.productName as string) || template.name;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">{productName}</h1>
              <p className="text-sm text-slate-400">
                {template.name} • {enhancedOutputs.length} assets
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main gallery */}
          <div className="lg:col-span-2">
            {groups.length > 0 ? (
              groups.map(group => (
                <div key={group} className="mb-8">
                  <h2 className="text-lg font-semibold text-white mb-4">{group}</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {enhancedOutputs
                      .filter(o => o.meta?.group === group)
                      .map(output => (
                        <div
                          key={output.stepId}
                          className={cn(
                            "relative rounded-xl overflow-hidden bg-slate-800/50 border border-slate-700/50 group cursor-pointer",
                            selectedAsset === output.stepId && "ring-2 ring-violet-500"
                          )}
                          onClick={() => setSelectedAsset(
                            selectedAsset === output.stepId ? null : output.stepId
                          )}
                        >
                          {output.meta?.variant && (
                            <div className={cn(
                              "absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-xs font-bold",
                              output.meta.variant === "A" ? "bg-blue-500 text-white" : "bg-orange-500 text-white"
                            )}>
                              {output.meta.variant}
                            </div>
                          )}
                          
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={output.url}
                            alt={output.meta?.label || output.stepId}
                            className="w-full aspect-square object-cover"
                          />

                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-sm truncate">{output.meta?.label || output.stepId}</p>
                            {shareLink.allowDownload && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(output.url, `${output.stepId}.jpg`);
                                }}
                                className="mt-2 text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
                              >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {enhancedOutputs.map(output => (
                  <div
                    key={output.stepId}
                    className="relative rounded-xl overflow-hidden bg-slate-800/50 border border-slate-700/50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={output.url}
                      alt={output.meta?.label || output.stepId}
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments sidebar */}
          <div>
            {shareLink.allowComments && (
              <Card className="sticky top-4">
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-4">
                    Comments
                    {selectedAsset && (
                      <span className="text-sm text-violet-400 font-normal ml-2">
                        on {selectedAsset}
                      </span>
                    )}
                  </h3>

                  {/* Comment form */}
                  <form onSubmit={handleSubmitComment} className="mb-4 space-y-3">
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 px-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      required
                    />
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={selectedAsset ? `Comment on ${selectedAsset}...` : "Leave a comment..."}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 px-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                      rows={3}
                      required
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? "Sending..." : "Post Comment"}
                    </Button>
                  </form>

                  {/* Comment list */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {comments.length > 0 ? (
                      comments.map(comment => (
                        <div
                          key={comment.id}
                          className={cn(
                            "p-3 rounded-lg bg-slate-800/50",
                            comment.isResolved && "opacity-50"
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white text-sm font-medium">{comment.authorName}</span>
                            {comment.assetId && (
                              <span className="text-xs text-slate-500">on {comment.assetId}</span>
                            )}
                          </div>
                          <p className="text-slate-300 text-sm">{comment.content}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 text-center py-4">
                        No comments yet. Be the first!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CTA */}
            <div className="mt-4 p-4 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl border border-violet-500/20 text-center">
              <p className="text-white font-medium mb-2">Want to create assets like these?</p>
              <p className="text-sm text-slate-400 mb-4">
                LOLA generates 20+ platform-ready assets from one photo.
              </p>
              <Link href="/start">
                <Button className="w-full">Try LOLA Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
