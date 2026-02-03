import { AIProvider, AIProviderName, ImageGenerationOptions } from "@/types";

// Mock provider for development/testing
export class MockProvider implements AIProvider {
  name: AIProviderName = "mock";

  async generateImage(prompt: string, options?: ImageGenerationOptions): Promise<string> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Generate a unique seed based on prompt
    const seed = prompt.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Use Picsum for placeholder images
    const width = options?.width || 512;
    const height = options?.height || 512;
    
    return `https://picsum.photos/seed/${seed}/${width}/${height}`;
  }
}

export const mockProvider = new MockProvider();
