// ============================================
// OPENAI PROVIDER ADAPTER
// ============================================

import { BaseProviderAdapter } from "./base";
import { ModelEntry, ModelInput, ModelOutput, ProviderId } from "../types";

export class OpenAIAdapter extends BaseProviderAdapter {
  providerId: ProviderId = "openai";
  
  private apiKey: string;
  
  constructor() {
    super();
    this.apiKey = process.env.OPENAI_API_KEY || "";
  }
  
  canHandle(model: ModelEntry): boolean {
    return model.provider === "openai";
  }
  
  async generate(model: ModelEntry, input: ModelInput): Promise<ModelOutput> {
    const startTime = Date.now();
    
    if (!this.apiKey) {
      return this.createErrorOutput(model, "OPENAI_API_KEY not configured", 0);
    }
    
    try {
      if (input.type === "image_generate") {
        return await this.generateImage(model, input);
      }
      
      if (input.type === "text_generate") {
        return await this.generateText(model, input);
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
    const defaults = (model.defaultParams || {}) as Record<string, unknown>;
    
    // Map size to DALL-E format
    let size = "1024x1024";
    if (params.width === 1792 && params.height === 1024) size = "1792x1024";
    else if (params.width === 1024 && params.height === 1792) size = "1024x1792";
    
    const body: Record<string, unknown> = {
      model: model.endpoint,
      prompt: params.prompt,
      n: 1,
      size,
      quality: defaults.quality || "standard",
    };
    
    if (params.extra?.style) body.style = params.extra.style;
    
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return this.createErrorOutput(
        model,
        error.error?.message || "OpenAI API error",
        Date.now() - startTime
      );
    }
    
    const result = await response.json();
    const images = result.data || [];
    
    if (images.length === 0) {
      return this.createErrorOutput(model, "No image in response", Date.now() - startTime);
    }
    
    return this.createOutput(model, {
      success: true,
      outputs: images.map((img: { url: string; revised_prompt?: string }) => ({
        url: img.url,
        type: "image" as const,
        width: parseInt(size.split("x")[0]),
        height: parseInt(size.split("x")[1]),
      })),
      latencyMs: Date.now() - startTime,
      cost: model.costPerUnit,
      rawResponse: result,
    });
  }
  
  private async generateText(
    model: ModelEntry,
    input: ModelInput
  ): Promise<ModelOutput> {
    const startTime = Date.now();
    
    if (input.type !== "text_generate") {
      throw new Error("Expected text_generate input");
    }
    
    const params = input.params;
    
    const messages: Array<{ role: string; content: string }> = [];
    if (params.systemPrompt) {
      messages.push({ role: "system", content: params.systemPrompt });
    }
    messages.push({ role: "user", content: params.prompt });
    
    const body: Record<string, unknown> = {
      model: model.endpoint,
      messages,
      max_tokens: params.maxTokens || 1000,
    };
    
    if (params.temperature !== undefined) body.temperature = params.temperature;
    if (params.topP !== undefined) body.top_p = params.topP;
    if (params.stopSequences) body.stop = params.stopSequences;
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return this.createErrorOutput(
        model,
        error.error?.message || "OpenAI API error",
        Date.now() - startTime
      );
    }
    
    const result = await response.json();
    const text = result.choices?.[0]?.message?.content || "";
    
    return this.createOutput(model, {
      success: true,
      outputs: [{
        url: `data:text/plain;base64,${Buffer.from(text).toString("base64")}`,
        type: "text" as const,
      }],
      latencyMs: Date.now() - startTime,
      cost: (result.usage?.total_tokens || 0) / 1000 * model.costPerUnit,
      rawResponse: result,
    });
  }
}
