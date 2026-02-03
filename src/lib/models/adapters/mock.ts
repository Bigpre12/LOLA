// ============================================
// MOCK PROVIDER ADAPTER
// For testing without real API calls
// ============================================

import { BaseProviderAdapter } from "./base";
import { ModelEntry, ModelInput, ModelOutput, ProviderId } from "../types";

export class MockAdapter extends BaseProviderAdapter {
  providerId: ProviderId = "mock";
  
  canHandle(model: ModelEntry): boolean {
    return model.provider === "mock";
  }
  
  async generate(model: ModelEntry, input: ModelInput): Promise<ModelOutput> {
    const startTime = Date.now();
    
    // Simulate some latency
    await this.sleep(500);
    
    if (input.type === "image_generate") {
      const params = this.getImageParams(input, model);
      
      // Generate placeholder image URL
      const width = params.width || 1024;
      const height = params.height || 1024;
      const seed = params.seed || Math.floor(Math.random() * 10000);
      
      // Use Picsum for realistic placeholder images
      const url = `https://picsum.photos/seed/${seed}/${width}/${height}`;
      
      return this.createOutput(model, {
        success: true,
        outputs: [{
          url,
          type: "image",
          width,
          height,
        }],
        seed,
        latencyMs: Date.now() - startTime,
        cost: 0,
      });
    }
    
    if (input.type === "text_generate") {
      const params = input.params;
      const mockText = `Mock response to: "${params.prompt.slice(0, 100)}..."`;
      
      return this.createOutput(model, {
        success: true,
        outputs: [{
          url: `data:text/plain;base64,${Buffer.from(mockText).toString("base64")}`,
          type: "text",
        }],
        latencyMs: Date.now() - startTime,
        cost: 0,
      });
    }
    
    if (input.type === "video_generate") {
      // Return a sample video URL
      return this.createOutput(model, {
        success: true,
        outputs: [{
          url: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
          type: "video",
          duration: 5,
        }],
        latencyMs: Date.now() - startTime,
        cost: 0,
      });
    }
    
    return this.createErrorOutput(
      model,
      `Mock adapter doesn't support: ${input.type}`,
      Date.now() - startTime
    );
  }
}
