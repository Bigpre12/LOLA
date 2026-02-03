// ============================================
// MODEL ROUTER
// Routes requests to the right model and adapter
// ============================================

import {
  ModelEntry,
  ModelInput,
  ModelOutput,
  ModelSelectionCriteria,
  ModelType,
} from "./types";
import {
  getModel,
  selectBestModel,
  findModels,
  estimateCost,
} from "./registry";
import { getAllAdapters } from "./adapters";

/**
 * The unified model router
 * This is the main entry point for all model calls
 */
export class ModelRouter {
  /**
   * Generate content using a specific model ID
   */
  async generate(modelId: string, input: ModelInput): Promise<ModelOutput> {
    const model = getModel(modelId);
    
    if (!model) {
      return {
        success: false,
        modelId,
        provider: "mock",
        outputs: [],
        latencyMs: 0,
        cost: 0,
        error: `Model not found: ${modelId}`,
        errorCode: "MODEL_NOT_FOUND",
      };
    }
    
    if (model.status === "disabled") {
      return {
        success: false,
        modelId,
        provider: model.provider,
        outputs: [],
        latencyMs: 0,
        cost: 0,
        error: `Model is disabled: ${modelId}`,
        errorCode: "MODEL_DISABLED",
      };
    }
    
    return this.executeWithModel(model, input);
  }
  
  /**
   * Generate content using auto-selected model based on criteria
   */
  async generateAuto(
    criteria: ModelSelectionCriteria,
    input: ModelInput
  ): Promise<ModelOutput> {
    const model = selectBestModel(criteria);
    
    if (!model) {
      return {
        success: false,
        modelId: "auto",
        provider: "mock",
        outputs: [],
        latencyMs: 0,
        cost: 0,
        error: `No model found matching criteria: ${JSON.stringify(criteria)}`,
        errorCode: "NO_MATCHING_MODEL",
      };
    }
    
    return this.executeWithModel(model, input);
  }
  
  /**
   * Generate with fallback - tries multiple models until one succeeds
   */
  async generateWithFallback(
    modelIds: string[],
    input: ModelInput
  ): Promise<ModelOutput> {
    let lastError: ModelOutput | null = null;
    
    for (const modelId of modelIds) {
      const result = await this.generate(modelId, input);
      
      if (result.success) {
        return result;
      }
      
      lastError = result;
      console.warn(`Model ${modelId} failed, trying next...`, result.error);
    }
    
    return lastError || {
      success: false,
      modelId: "fallback",
      provider: "mock",
      outputs: [],
      latencyMs: 0,
      cost: 0,
      error: "All models failed",
      errorCode: "ALL_MODELS_FAILED",
    };
  }
  
  /**
   * Generate with auto-fallback based on type
   */
  async generateWithAutoFallback(
    modelId: string,
    input: ModelInput
  ): Promise<ModelOutput> {
    const primaryModel = getModel(modelId);
    
    if (!primaryModel) {
      return this.generate(modelId, input);
    }
    
    // Try primary model first
    const result = await this.generate(modelId, input);
    
    if (result.success) {
      return result;
    }
    
    // Find fallback models of same type
    const fallbacks = findModels({
      type: primaryModel.type,
      excludeModels: [modelId],
    }).slice(0, 3);
    
    if (fallbacks.length === 0) {
      return result;
    }
    
    console.warn(`Primary model ${modelId} failed, trying fallbacks...`);
    return this.generateWithFallback(
      fallbacks.map((m) => m.id),
      input
    );
  }
  
  /**
   * Execute with a specific model
   */
  private async executeWithModel(
    model: ModelEntry,
    input: ModelInput
  ): Promise<ModelOutput> {
    // Find adapter that can handle this model
    const adapters = getAllAdapters();
    const adapter = adapters.find((a) => a.canHandle(model));
    
    if (!adapter) {
      return {
        success: false,
        modelId: model.id,
        provider: model.provider,
        outputs: [],
        latencyMs: 0,
        cost: 0,
        error: `No adapter found for provider: ${model.provider}`,
        errorCode: "NO_ADAPTER",
      };
    }
    
    return adapter.generate(model, input);
  }
  
  /**
   * Get estimated cost for a model call
   */
  getEstimatedCost(
    modelId: string,
    params?: { count?: number; duration?: number; tokens?: number }
  ): number {
    return estimateCost(modelId, params);
  }
  
  /**
   * Check if a model is available (has valid API key)
   */
  async isModelAvailable(modelId: string): Promise<boolean> {
    const model = getModel(modelId);
    if (!model || model.status === "disabled") return false;
    
    const adapters = getAllAdapters();
    const adapter = adapters.find((a) => a.canHandle(model));
    
    if (!adapter) return false;
    
    // Check if adapter has health check
    if (adapter.healthCheck) {
      return adapter.healthCheck();
    }
    
    return true;
  }
  
  /**
   * Get recommended model for a task type
   */
  getRecommendedModel(
    type: ModelType,
    preference: "fast" | "quality" | "cheap" = "cheap"
  ): ModelEntry | undefined {
    return selectBestModel({
      type,
      preferFast: preference === "fast",
      preferQuality: preference === "quality",
    });
  }
}

// Export singleton instance
export const modelRouter = new ModelRouter();
