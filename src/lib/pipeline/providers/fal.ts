import { AIProvider, AIProviderName, ImageGenerationOptions } from "@/types";

// fal.ai provider
export class FalProvider implements AIProvider {
  name: AIProviderName = "fal";
  private apiKey: string;
  private baseUrl = "https://fal.run";

  constructor() {
    this.apiKey = process.env.FAL_KEY || "";
  }

  async generateImage(prompt: string, options?: ImageGenerationOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error("FAL_KEY environment variable is not set");
    }

    const response = await fetch(`${this.baseUrl}/fal-ai/flux/dev`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${this.apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        image_size: {
          width: options?.width || 1024,
          height: options?.height || 1024,
        },
        num_inference_steps: options?.numInferenceSteps || 28,
        seed: options?.seed,
        num_images: 1,
        enable_safety_checker: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`fal.ai API error: ${error}`);
    }

    const data = await response.json();
    
    if (!data.images || data.images.length === 0) {
      throw new Error("No images returned from fal.ai");
    }

    return data.images[0].url;
  }
}

export const falProvider = new FalProvider();
