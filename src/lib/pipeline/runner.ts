import { Template, Output, PipelineStep, AIProviderName } from "@/types";
import { getProvider, getDefaultProvider } from "./providers";
import { PipelineResult } from "./types";

// Render a prompt template by replacing {{variable}} placeholders
function renderPromptTemplate(
  template: string,
  context: Record<string, unknown>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = context[key];
    if (value === undefined || value === null) {
      return "";
    }
    // Handle File objects (uploaded images) - we'd need to upload them first
    if (value instanceof File) {
      return "[uploaded image]";
    }
    return String(value);
  });
}

export async function runPipeline(
  template: Template,
  inputs: Record<string, unknown>,
  options: Record<string, unknown>,
  onProgress?: (step: number, total: number) => void
): Promise<PipelineResult> {
  const outputs: Output[] = [];
  const context = { ...inputs, ...options };
  const steps = template.modelPipeline.steps;

  try {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Report progress
      onProgress?.(i + 1, steps.length);

      // Render the prompt template
      const prompt = renderPromptTemplate(step.promptTemplate, context);

      // Get the appropriate provider
      const providerName = (step.model || "fal") as AIProviderName;
      let provider = getProvider(providerName);

      // Try the specified provider, fall back to default if it fails
      let url: string;
      try {
        url = await provider.generateImage(prompt);
      } catch {
        console.warn(`Provider ${providerName} failed, trying default provider`);
        provider = getDefaultProvider();
        url = await provider.generateImage(prompt);
      }

      outputs.push({
        stepId: step.id,
        url,
        meta: {
          prompt,
          model: provider.name,
        },
      });
    }

    return {
      success: true,
      outputs,
    };
  } catch (error) {
    return {
      success: false,
      outputs,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Run a single step (useful for testing)
export async function runStep(
  step: PipelineStep,
  context: Record<string, unknown>
): Promise<Output> {
  const prompt = renderPromptTemplate(step.promptTemplate, context);
  const providerName = (step.model || "fal") as AIProviderName;
  const provider = getProvider(providerName);
  
  const url = await provider.generateImage(prompt);

  return {
    stepId: step.id,
    url,
    meta: {
      prompt,
      model: provider.name,
    },
  };
}
