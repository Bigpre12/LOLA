// ============================================
// FAL.AI PROVIDER ADAPTER
// ============================================

import { BaseProviderAdapter } from "./base";
import { ModelEntry, ModelInput, ModelOutput, ProviderId } from "../types";

export class FalAdapter extends BaseProviderAdapter {
  providerId: ProviderId = "fal";
  
  private apiKey: string;
  
  constructor() {
    super();
    this.apiKey = process.env.FAL_KEY || "";
  }
  
  canHandle(model: ModelEntry): boolean {
    return model.provider === "fal";
  }
  
  async generate(model: ModelEntry, input: ModelInput): Promise<ModelOutput> {
    const startTime = Date.now();
    
    if (!this.apiKey) {
      return this.createErrorOutput(model, "FAL_KEY not configured", 0);
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
    
    // Build request body based on model
    const body: Record<string, unknown> = {
      prompt: params.prompt,
      image_size: {
        width: params.width,
        height: params.height,
      },
    };
    
    if (params.negativePrompt) body.negative_prompt = params.negativePrompt;
    if (params.seed !== undefined) body.seed = params.seed;
    if (params.steps) body.num_inference_steps = params.steps;
    if (params.guidanceScale) body.guidance_scale = params.guidanceScale;
    if (params.imageUrl) body.image_url = params.imageUrl;
    
    // Add any extra params
    if (params.extra) {
      Object.assign(body, params.extra);
    }
    
    // Submit to queue
    const submitResponse = await fetch(
      `https://queue.fal.run/${model.endpoint}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Key ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    
    if (!submitResponse.ok) {
      const error = await submitResponse.text();
      return this.createErrorOutput(model, `Fal API error: ${error}`, Date.now() - startTime);
    }
    
    const { request_id } = await submitResponse.json();
    
    // Poll for result
    let result: Record<string, unknown> | null = null;
    const maxAttempts = 60;
    
    for (let i = 0; i < maxAttempts; i++) {
      await this.sleep(2000);
      
      const statusResponse = await fetch(
        `https://queue.fal.run/${model.endpoint}/requests/${request_id}/status`,
        {
          headers: { "Authorization": `Key ${this.apiKey}` },
        }
      );
      
      const status = await statusResponse.json();
      
      if (status.status === "COMPLETED") {
        // Fetch result
        const resultResponse = await fetch(
          `https://queue.fal.run/${model.endpoint}/requests/${request_id}`,
          {
            headers: { "Authorization": `Key ${this.apiKey}` },
          }
        );
        result = await resultResponse.json();
        break;
      }
      
      if (status.status === "FAILED") {
        return this.createErrorOutput(
          model,
          status.error || "Generation failed",
          Date.now() - startTime
        );
      }
    }
    
    if (!result) {
      return this.createErrorOutput(model, "Generation timed out", Date.now() - startTime);
    }
    
    // Extract images from result
    const images = (result.images as Array<{ url: string; width?: number; height?: number }>) || [];
    const imageUrl = images[0]?.url || (result.image as { url: string })?.url;
    
    if (!imageUrl) {
      return this.createErrorOutput(model, "No image in response", Date.now() - startTime);
    }
    
    return this.createOutput(model, {
      success: true,
      outputs: images.length > 0
        ? images.map((img) => ({
            url: img.url,
            type: "image" as const,
            width: img.width || params.width,
            height: img.height || params.height,
          }))
        : [{
            url: imageUrl,
            type: "image" as const,
            width: params.width,
            height: params.height,
          }],
      seed: result.seed as number | undefined,
      latencyMs: Date.now() - startTime,
      cost: model.costPerUnit,
      rawResponse: result,
    });
  }
}
