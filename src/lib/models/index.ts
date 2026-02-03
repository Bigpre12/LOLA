// ============================================
// UNIFIED MODEL LAYER - PUBLIC API
// ============================================

// Types
export * from "./types";

// Registry
export {
  MODEL_REGISTRY,
  getModel,
  getModelsByType,
  getModelsByProvider,
  findModels,
  selectBestModel,
  getActiveModels,
  estimateCost,
} from "./registry";

// Router
export { ModelRouter, modelRouter } from "./router";

// Adapters (for advanced usage / custom adapters)
export {
  BaseProviderAdapter,
  getAllAdapters,
  getAdapterByProvider,
  registerAdapter,
} from "./adapters";

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

import { modelRouter } from "./router";
import { ModelInput, ModelOutput, ModelSelectionCriteria } from "./types";

/**
 * Generate an image using the default image model
 */
export async function generateImage(
  prompt: string,
  options?: {
    modelId?: string;
    width?: number;
    height?: number;
    seed?: number;
    negativePrompt?: string;
  }
): Promise<ModelOutput> {
  const modelId = options?.modelId || "flux-schnell";
  
  return modelRouter.generate(modelId, {
    type: "image_generate",
    params: {
      prompt,
      width: options?.width,
      height: options?.height,
      seed: options?.seed,
      negativePrompt: options?.negativePrompt,
    },
  });
}

/**
 * Generate an image using auto-selected model
 */
export async function generateImageAuto(
  prompt: string,
  options?: {
    preferFast?: boolean;
    preferQuality?: boolean;
    maxCost?: number;
    width?: number;
    height?: number;
  }
): Promise<ModelOutput> {
  const criteria: ModelSelectionCriteria = {
    type: "image_generate",
    preferFast: options?.preferFast,
    preferQuality: options?.preferQuality,
    maxCost: options?.maxCost,
  };
  
  return modelRouter.generateAuto(criteria, {
    type: "image_generate",
    params: {
      prompt,
      width: options?.width,
      height: options?.height,
    },
  });
}

/**
 * Generate text using the default text model
 */
export async function generateText(
  prompt: string,
  options?: {
    modelId?: string;
    systemPrompt?: string;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<ModelOutput> {
  const modelId = options?.modelId || "gpt-4o";
  
  return modelRouter.generate(modelId, {
    type: "text_generate",
    params: {
      prompt,
      systemPrompt: options?.systemPrompt,
      maxTokens: options?.maxTokens,
      temperature: options?.temperature,
    },
  });
}

/**
 * Run any model with any input
 */
export async function runModel(
  modelId: string,
  input: ModelInput
): Promise<ModelOutput> {
  return modelRouter.generate(modelId, input);
}

/**
 * Run model with automatic fallback on failure
 */
export async function runModelSafe(
  modelId: string,
  input: ModelInput
): Promise<ModelOutput> {
  return modelRouter.generateWithAutoFallback(modelId, input);
}
