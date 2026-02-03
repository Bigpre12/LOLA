import { AIProviderName, ImageGenerationOptions, Output } from "@/types";

export interface AIProvider {
  name: AIProviderName;
  generateImage(prompt: string, options?: ImageGenerationOptions): Promise<string>;
}

export interface PipelineContext {
  inputs: Record<string, unknown>;
  options: Record<string, unknown>;
  outputs: Output[];
}

export interface PipelineResult {
  success: boolean;
  outputs: Output[];
  error?: string;
}

export interface StepResult {
  stepId: string;
  url: string;
  meta: {
    prompt: string;
    model?: string;
    duration_ms?: number;
  };
}
