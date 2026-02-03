import { AIProvider, AIProviderName, ImageGenerationOptions } from "@/types";

// OpenAI DALL-E provider
export class OpenAIProvider implements AIProvider {
  name: AIProviderName = "openai";
  private apiKey: string;
  private baseUrl = "https://api.openai.com/v1";

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || "";
  }

  async generateImage(prompt: string, options?: ImageGenerationOptions): Promise<string> {
    if (!this.apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    // Map sizes to DALL-E 3 supported sizes
    let size: "1024x1024" | "1792x1024" | "1024x1792" = "1024x1024";
    if (options?.width && options?.height) {
      if (options.width > options.height) {
        size = "1792x1024";
      } else if (options.height > options.width) {
        size = "1024x1792";
      }
    }

    const response = await fetch(`${this.baseUrl}/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size,
        quality: "standard",
        response_format: "url",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || "Unknown error"}`);
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      throw new Error("No images returned from OpenAI");
    }

    return data.data[0].url;
  }
}

export const openAIProvider = new OpenAIProvider();
