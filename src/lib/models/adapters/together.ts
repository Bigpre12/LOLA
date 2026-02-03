// ============================================
// TOGETHER AI PROVIDER ADAPTER
// ============================================

import { BaseProviderAdapter } from "./base";
import { ModelEntry, ModelInput, ModelOutput, ProviderId } from "../types";

export class TogetherAdapter extends BaseProviderAdapter {
  providerId: ProviderId = "together";
  
  private apiKey: string;
  
  constructor() {
    super();
    this.apiKey = process.env.TOGETHER_API_KEY || "";
  }
  
  canHandle(model: ModelEntry): boolean {
    return model.provider === "together";
  }
  
  async generate(model: ModelEntry, input: ModelInput): Promise<ModelOutput> {
    const startTime = Date.now();
    
    if (!this.apiKey) {
      return this.createErrorOutput(model, "TOGETHER_API_KEY not configured", 0);
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
    
    const body: Record<string, unknown> = {
      model: model.endpoint,
      prompt: params.prompt,
      width: params.width,
      height: params.height,
      n: 1,
    };
    
    if (params.negativePrompt) body.negative_prompt = params.negativePrompt;
    if (params.seed !== undefined) body.seed = params.seed;
    if (params.steps) body.steps = params.steps;
    
    // Add any extra params
    if (params.extra) {
      Object.assign(body, params.extra);
    }
    
    const response = await fetch("https://api.together.xyz/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const error = await response.text();
      return this.createErrorOutput(model, `Together API error: ${error}`, Date.now() - startTime);
    }
    
    const result = await response.json();
    const images = result.data || [];
    
    if (images.length === 0) {
      return this.createErrorOutput(model, "No image in response", Date.now() - startTime);
    }
    
    return this.createOutput(model, {
      success: true,
      outputs: images.map((img: { url?: string; b64_json?: string }) => {
        const url = img.url || (img.b64_json ? `data:image/png;base64,${img.b64_json}` : "");
        return {
          url,
          type: "image" as const,
          width: params.width,
          height: params.height,
        };
      }),
      seed: result.seed,
      latencyMs: Date.now() - startTime,
      cost: model.costPerUnit,
      rawResponse: result,
    });
  }
}
