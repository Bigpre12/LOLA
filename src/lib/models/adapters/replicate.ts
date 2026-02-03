// ============================================
// REPLICATE PROVIDER ADAPTER
// ============================================

import { BaseProviderAdapter } from "./base";
import { ModelEntry, ModelInput, ModelOutput, ProviderId } from "../types";

export class ReplicateAdapter extends BaseProviderAdapter {
  providerId: ProviderId = "replicate";
  
  private apiKey: string;
  
  constructor() {
    super();
    this.apiKey = process.env.REPLICATE_API_TOKEN || "";
  }
  
  canHandle(model: ModelEntry): boolean {
    return model.provider === "replicate";
  }
  
  async generate(model: ModelEntry, input: ModelInput): Promise<ModelOutput> {
    const startTime = Date.now();
    
    if (!this.apiKey) {
      return this.createErrorOutput(model, "REPLICATE_API_TOKEN not configured", 0);
    }
    
    try {
      if (input.type === "image_generate") {
        return await this.generateImage(model, input);
      }
      
      return this.createErrorOutput(
        model,
        `Unsupported input type: ${input.type}`,
        Date.now() - startTime
      );
    } catch (error) {
      return this.createErrorOutput(model, error as Error, Date.now() - startTime);
    }
  }
  
  private async generateImage(
    model: ModelEntry,
    input: ModelInput
  ): Promise<ModelOutput> {
    const startTime = Date.now();
    const params = this.getImageParams(input, model);
    
    // Build input for Replicate
    const replicateInput: Record<string, unknown> = {
      prompt: params.prompt,
      width: params.width,
      height: params.height,
    };
    
    if (params.negativePrompt) replicateInput.negative_prompt = params.negativePrompt;
    if (params.seed !== undefined) replicateInput.seed = params.seed;
    if (params.steps) replicateInput.num_inference_steps = params.steps;
    if (params.guidanceScale) replicateInput.guidance_scale = params.guidanceScale;
    
    // Add any extra params
    if (params.extra) {
      Object.assign(replicateInput, params.extra);
    }
    
    // Determine if using versioned model or official model
    const isVersioned = model.endpoint.includes(":");
    const url = isVersioned
      ? "https://api.replicate.com/v1/predictions"
      : `https://api.replicate.com/v1/models/${model.endpoint}/predictions`;
    
    const body: Record<string, unknown> = { input: replicateInput };
    if (isVersioned) {
      body.version = model.endpoint.split(":")[1];
    }
    
    // Create prediction
    const createResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    if (!createResponse.ok) {
      const error = await createResponse.text();
      return this.createErrorOutput(model, `Replicate API error: ${error}`, Date.now() - startTime);
    }
    
    let prediction = await createResponse.json();
    
    // Poll for completion
    const maxAttempts = 60;
    for (let i = 0; i < maxAttempts; i++) {
      if (prediction.status === "succeeded") break;
      if (prediction.status === "failed" || prediction.status === "canceled") {
        return this.createErrorOutput(
          model,
          prediction.error || "Generation failed",
          Date.now() - startTime
        );
      }
      
      await this.sleep(2000);
      
      const statusResponse = await fetch(prediction.urls.get, {
        headers: { "Authorization": `Bearer ${this.apiKey}` },
      });
      prediction = await statusResponse.json();
    }
    
    if (prediction.status !== "succeeded") {
      return this.createErrorOutput(model, "Generation timed out", Date.now() - startTime);
    }
    
    // Extract output
    const output = prediction.output;
    const outputs = Array.isArray(output) ? output : [output];
    
    return this.createOutput(model, {
      success: true,
      outputs: outputs.map((url: string) => ({
        url,
        type: "image" as const,
        width: params.width,
        height: params.height,
      })),
      latencyMs: Date.now() - startTime,
      cost: model.costPerUnit,
      rawResponse: prediction,
    });
  }
}
