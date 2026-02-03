// ============================================
// PIPELINE RUNNER V2
// Uses the unified model layer
// ============================================

import { Template } from "@/types";
import { modelRouter, getModel, estimateCost } from "../models";
import { ModelOutput } from "../models/types";

export interface PipelineStepV2 {
  id: string;
  type: string;
  model?: string;              // Model ID from registry
  modelAuto?: {                // Auto-select model
    type: string;
    capabilities?: string[];
    preferFast?: boolean;
    preferQuality?: boolean;
    maxCost?: number;
  };
  label?: string;
  group?: string;
  variant?: string;
  promptTemplate: string;
  dependsOn?: string[];        // IDs of steps this depends on
  condition?: string;          // JS expression for conditional execution
}

export interface PipelineResultV2 {
  success: boolean;
  outputs: Array<{
    stepId: string;
    url: string;
    type: string;
    meta: {
      prompt: string;
      model: string;
      cost: number;
      latencyMs: number;
      group?: string;
      variant?: string;
      label?: string;
    };
  }>;
  totalCost: number;
  totalLatencyMs: number;
  error?: string;
  failedSteps?: string[];
}

/**
 * Render a prompt template with variables
 */
function renderPrompt(
  template: string,
  inputs: Record<string, unknown>,
  options: Record<string, unknown>,
  previousOutputs: Map<string, string>
): string {
  let prompt = template;
  
  // Replace input variables {{varName}}
  for (const [key, value] of Object.entries(inputs)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    prompt = prompt.replace(regex, String(value || ""));
  }
  
  // Replace option variables
  for (const [key, value] of Object.entries(options)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    prompt = prompt.replace(regex, String(value || ""));
  }
  
  // Replace previous step outputs {{step:stepId}}
  previousOutputs.forEach((url, stepId) => {
    const regex = new RegExp(`\\{\\{step:${stepId}\\}\\}`, "g");
    prompt = prompt.replace(regex, url);
  });
  
  // Clean up any remaining unreplaced variables
  prompt = prompt.replace(/\{\{[^}]+\}\}/g, "");
  
  return prompt.trim();
}

/**
 * Check if a condition is met
 */
function evaluateCondition(
  condition: string,
  inputs: Record<string, unknown>,
  options: Record<string, unknown>
): boolean {
  if (!condition) return true;
  
  try {
    // Create a safe evaluation context
    const context = { ...inputs, ...options };
    const fn = new Function(...Object.keys(context), `return ${condition}`);
    return Boolean(fn(...Object.values(context)));
  } catch {
    console.warn(`Failed to evaluate condition: ${condition}`);
    return true;
  }
}

/**
 * Run a pipeline with the unified model layer
 */
export async function runPipelineV2(
  template: Template,
  inputs: Record<string, unknown>,
  options: Record<string, unknown>
): Promise<PipelineResultV2> {
  const pipeline = template.modelPipeline as { steps: PipelineStepV2[] };
  const steps = pipeline?.steps || [];
  
  if (steps.length === 0) {
    return {
      success: false,
      outputs: [],
      totalCost: 0,
      totalLatencyMs: 0,
      error: "Pipeline has no steps",
    };
  }
  
  const outputs: PipelineResultV2["outputs"] = [];
  const stepOutputs = new Map<string, string>();
  const completedSteps = new Set<string>();
  const failedSteps: string[] = [];
  
  let totalCost = 0;
  const startTime = Date.now();
  
  // Process steps (respecting dependencies)
  const pendingSteps = [...steps];
  const maxIterations = steps.length * 2; // Prevent infinite loops
  let iterations = 0;
  
  while (pendingSteps.length > 0 && iterations < maxIterations) {
    iterations++;
    
    // Find steps that can be executed (all dependencies satisfied)
    const readySteps = pendingSteps.filter((step) => {
      if (!step.dependsOn || step.dependsOn.length === 0) return true;
      return step.dependsOn.every((dep) => completedSteps.has(dep));
    });
    
    if (readySteps.length === 0) {
      // No steps can proceed - check for circular dependencies
      const remaining = pendingSteps.map((s) => s.id).join(", ");
      return {
        success: false,
        outputs,
        totalCost,
        totalLatencyMs: Date.now() - startTime,
        error: `Circular dependency detected. Stuck on: ${remaining}`,
        failedSteps,
      };
    }
    
    // Execute ready steps in parallel
    const results = await Promise.all(
      readySteps.map(async (step) => {
        // Check condition
        if (step.condition && !evaluateCondition(step.condition, inputs, options)) {
          return { step, skipped: true };
        }
        
        // Render prompt
        const prompt = renderPrompt(step.promptTemplate, inputs, options, stepOutputs);
        
        // Determine model
        let result: ModelOutput;
        
        if (step.modelAuto) {
          // Auto-select model
          result = await modelRouter.generateAuto(
            {
              type: step.modelAuto.type as "image_generate",
              capabilities: step.modelAuto.capabilities as [],
              preferFast: step.modelAuto.preferFast,
              preferQuality: step.modelAuto.preferQuality,
              maxCost: step.modelAuto.maxCost,
            },
            {
              type: "image_generate",
              params: { prompt },
            }
          );
        } else {
          // Use specific model
          const modelId = step.model || "flux-schnell";
          result = await modelRouter.generateWithAutoFallback(modelId, {
            type: "image_generate",
            params: { prompt },
          });
        }
        
        return { step, result };
      })
    );
    
    // Process results
    for (const { step, result, skipped } of results) {
      // Remove from pending
      const idx = pendingSteps.findIndex((s) => s.id === step.id);
      if (idx >= 0) pendingSteps.splice(idx, 1);
      
      if (skipped) {
        completedSteps.add(step.id);
        continue;
      }
      
      if (!result) continue;
      
      completedSteps.add(step.id);
      
      if (result.success && result.outputs.length > 0) {
        const output = result.outputs[0];
        stepOutputs.set(step.id, output.url);
        
        outputs.push({
          stepId: step.id,
          url: output.url,
          type: output.type,
          meta: {
            prompt: renderPrompt(step.promptTemplate, inputs, options, stepOutputs),
            model: result.modelId,
            cost: result.cost,
            latencyMs: result.latencyMs,
            group: step.group,
            variant: step.variant,
            label: step.label,
          },
        });
        
        totalCost += result.cost;
      } else {
        failedSteps.push(step.id);
        console.error(`Step ${step.id} failed:`, result?.error);
      }
    }
  }
  
  return {
    success: failedSteps.length === 0,
    outputs,
    totalCost,
    totalLatencyMs: Date.now() - startTime,
    failedSteps: failedSteps.length > 0 ? failedSteps : undefined,
  };
}

/**
 * Estimate total cost for a pipeline
 */
export function estimatePipelineCost(
  template: Template
): { totalCost: number; breakdown: Array<{ stepId: string; model: string; cost: number }> } {
  const pipeline = template.modelPipeline as { steps: PipelineStepV2[] };
  const steps = pipeline?.steps || [];
  
  const breakdown: Array<{ stepId: string; model: string; cost: number }> = [];
  let totalCost = 0;
  
  for (const step of steps) {
    const modelId = step.model || "flux-schnell";
    const cost = estimateCost(modelId);
    
    breakdown.push({
      stepId: step.id,
      model: modelId,
      cost,
    });
    
    totalCost += cost;
  }
  
  return { totalCost, breakdown };
}

/**
 * Validate a pipeline configuration
 */
export function validatePipeline(
  template: Template
): { valid: boolean; errors: string[] } {
  const pipeline = template.modelPipeline as { steps: PipelineStepV2[] };
  const steps = pipeline?.steps || [];
  const errors: string[] = [];
  
  if (steps.length === 0) {
    errors.push("Pipeline has no steps");
    return { valid: false, errors };
  }
  
  const stepIds = new Set<string>();
  
  for (const step of steps) {
    // Check for duplicate IDs
    if (stepIds.has(step.id)) {
      errors.push(`Duplicate step ID: ${step.id}`);
    }
    stepIds.add(step.id);
    
    // Check model exists
    if (step.model && !step.modelAuto) {
      const model = getModel(step.model);
      if (!model) {
        errors.push(`Unknown model in step ${step.id}: ${step.model}`);
      }
    }
    
    // Check dependencies exist
    if (step.dependsOn) {
      for (const dep of step.dependsOn) {
        const depStep = steps.find((s) => s.id === dep);
        if (!depStep) {
          errors.push(`Step ${step.id} depends on unknown step: ${dep}`);
        }
      }
    }
    
    // Check prompt template exists
    if (!step.promptTemplate) {
      errors.push(`Step ${step.id} has no promptTemplate`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}
