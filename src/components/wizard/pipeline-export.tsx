"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { ModelPipeline } from "@/types";

interface PipelineExportProps {
  pipeline: ModelPipeline;
  templateName: string;
  templateSlug: string;
}

export function PipelineExport({ pipeline, templateName, templateSlug }: PipelineExportProps) {
  const [copied, setCopied] = useState(false);

  const exportData = {
    name: templateName,
    slug: templateSlug,
    version: "1.0",
    exportedAt: new Date().toISOString(),
    exportedFrom: "LOLA",
    pipeline,
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${templateSlug}-pipeline.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="text-sm font-medium text-slate-300">Export Pipeline</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy JSON"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            Download
          </Button>
        </div>
      </div>
      <pre className="p-4 text-xs text-slate-400 font-mono overflow-x-auto max-h-64">
        {JSON.stringify(exportData, null, 2)}
      </pre>
    </div>
  );
}

interface PipelineImportProps {
  onImport: (pipeline: ModelPipeline) => void;
}

export function PipelineImport({ onImport }: PipelineImportProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.pipeline && data.pipeline.steps) {
          onImport(data.pipeline);
          setError(null);
        } else {
          setError("Invalid pipeline format. Expected { pipeline: { steps: [...] } }");
        }
      } catch {
        setError("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/json") {
      handleFile(file);
    } else {
      setError("Please drop a JSON file");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-6">
      <h3 className="text-sm font-medium text-slate-300 mb-4">Import Pipeline</h3>
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          isDragging
            ? "border-violet-500 bg-violet-500/10"
            : "border-slate-700 hover:border-slate-600"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <svg
          className="mx-auto h-10 w-10 text-slate-500 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-sm text-slate-400">
          Drop a pipeline JSON file here, or{" "}
          <label className="text-violet-400 hover:text-violet-300 cursor-pointer">
            browse
            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleInputChange}
            />
          </label>
        </p>
        {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
      </div>
    </div>
  );
}
