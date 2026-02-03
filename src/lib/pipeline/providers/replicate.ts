import { AIProvider, AIProviderName, ImageGenerationOptions } from "@/types";

// Replicate provider
export class ReplicateProvider implements AIProvider {
  name: AIProviderName = "replicate";
  private apiKey: string;
  private baseUrl = "https://api.replicate.com/v1";

  constructor() {
    this.apiKey = process.env.REPLICATE_API_TOKEN || "";
  }

  async generateImage(prompt: string, options?: ImageGenerationOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error("REPLICATE_API_TOKEN environment variable is not set");
    }

    // Start prediction
    const createResponse = await fetch(`${this.baseUrl}/predictions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${this.apiKey}`,
      },
      body: JSON.stringify({
        // Using SDXL model
        version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        input: {
          prompt,
          width: options?.width || 1024,
          height: options?.height || 1024,
          num_inference_steps: options?.numInferenceSteps || 50,
          seed: options?.seed,
        },
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      throw new Error(`Replicate API error: ${error}`);
    }

    const prediction = await createResponse.json();

    // Poll for completion
    let result = prediction;
    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(`${this.baseUrl}/predictions/${result.id}`, {
        headers: {
          Authorization: `Token ${this.apiKey}`,
        },
      });
      
      result = await statusResponse.json();
    }

    if (result.status === "failed") {
      throw new Error(`Replicate prediction failed: ${result.error}`);
    }

    if (!result.output || result.output.length === 0) {
      throw new Error("No images returned from Replicate");
    }

    return Array.isArray(result.output) ? result.output[0] : result.output;
  }
}

export const replicateProvider = new ReplicateProvider();
