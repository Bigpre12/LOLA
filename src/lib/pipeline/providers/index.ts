import { AIProvider, AIProviderName } from "@/types";
import { mockProvider } from "./mock";
import { falProvider } from "./fal";
import { replicateProvider } from "./replicate";
import { openAIProvider } from "./openai";

const providers: Record<AIProviderName, AIProvider> = {
  mock: mockProvider,
  fal: falProvider,
  replicate: replicateProvider,
  openai: openAIProvider,
};

export function getProvider(name: AIProviderName): AIProvider {
  const provider = providers[name];
  if (!provider) {
    console.warn(`Provider ${name} not found, falling back to mock`);
    return mockProvider;
  }
  return provider;
}

// Get the default provider based on available API keys
export function getDefaultProvider(): AIProvider {
  if (process.env.FAL_KEY) {
    return falProvider;
  }
  if (process.env.REPLICATE_API_TOKEN) {
    return replicateProvider;
  }
  if (process.env.OPENAI_API_KEY) {
    return openAIProvider;
  }
  return mockProvider;
}

export { mockProvider, falProvider, replicateProvider, openAIProvider };
