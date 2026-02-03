// ============================================
// BASE PROVIDER ADAPTER
// ============================================

import {
  ProviderAdapter,
  ModelEntry,
  ModelInput,
  ModelOutput,
  ProviderId,
  ImageGenerateInput,
} from "../types";

/**
 * Base class for provider adapters
 * Handles common functionality like error normalization and output formatting
 */
export abstract class BaseProviderAdapter implements ProviderAdapter {
  abstract providerId: ProviderId;
  
  abstract canHandle(model: ModelEntry): boolean;
  abstract generate(model: ModelEntry, input: ModelInput): Promise<ModelOutput>;
  
  /**
   * Create a standardized output object
   */
  protected createOutput(
    model: ModelEntry,
    data: Partial<ModelOutput>
  ): ModelOutput {
    return {
      success: data.success ?? false,
      modelId: model.id,
      provider: model.provider,
      outputs: data.outputs ?? [],
      seed: data.seed,
      latencyMs: data.latencyMs ?? 0,
      cost: data.cost ?? model.costPerUnit,
      error: data.error,
      errorCode: data.errorCode,
      rawResponse: data.rawResponse,
    };
  }
  
  /**
   * Create an error output
   */
  protected createErrorOutput(
    model: ModelEntry,
    error: Error | string,
    latencyMs: number = 0
  ): ModelOutput {
    const errorMessage = error instanceof Error ? error.message : error;
    return this.createOutput(model, {
      success: false,
      error: errorMessage,
      latencyMs,
    });
  }
  
  /**
   * Extract image generation params with defaults
   */
  protected getImageParams(
    input: ModelInput,
    model: ModelEntry
  ): ImageGenerateInput & { width: number; height: number } {
    if (input.type !== "image_generate") {
      throw new Error(`Expected image_generate input, got ${input.type}`);
    }
    
    const params = input.params;
    const defaults = (model.defaultParams || {}) as Record<string, unknown>;
    
    return {
      prompt: params.prompt,
      negativePrompt: params.negativePrompt,
      width: params.width || (defaults.width as number) || 1024,
      height: params.height || (defaults.height as number) || 1024,
      seed: params.seed,
      steps: params.steps || (defaults.num_inference_steps as number),
      guidanceScale: params.guidanceScale || (defaults.guidance_scale as number),
      scheduler: params.scheduler,
      imageUrl: params.imageUrl,
      controlImage: params.controlImage,
      loraWeights: params.loraWeights,
      extra: params.extra,
    };
  }
  
  /**
   * Sleep helper for polling
   */
  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
