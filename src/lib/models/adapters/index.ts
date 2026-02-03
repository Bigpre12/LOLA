// ============================================
// PROVIDER ADAPTERS INDEX
// ============================================

export { BaseProviderAdapter } from "./base";
export { FalAdapter } from "./fal";
export { ReplicateAdapter } from "./replicate";
export { OpenAIAdapter } from "./openai";
export { TogetherAdapter } from "./together";
export { CustomHttpAdapter } from "./custom-http";
export { MockAdapter } from "./mock";

import { ProviderAdapter, ProviderId } from "../types";
import { FalAdapter } from "./fal";
import { ReplicateAdapter } from "./replicate";
import { OpenAIAdapter } from "./openai";
import { TogetherAdapter } from "./together";
import { CustomHttpAdapter } from "./custom-http";
import { MockAdapter } from "./mock";

// Singleton instances of all adapters
const adapters: ProviderAdapter[] = [
  new FalAdapter(),
  new ReplicateAdapter(),
  new OpenAIAdapter(),
  new TogetherAdapter(),
  new CustomHttpAdapter(),
  new MockAdapter(),
];

/**
 * Get all registered adapters
 */
export function getAllAdapters(): ProviderAdapter[] {
  return adapters;
}

/**
 * Get adapter by provider ID
 */
export function getAdapterByProvider(providerId: ProviderId): ProviderAdapter | undefined {
  return adapters.find((a) => a.providerId === providerId);
}

/**
 * Register a custom adapter
 */
export function registerAdapter(adapter: ProviderAdapter): void {
  // Remove existing adapter for same provider if present
  const index = adapters.findIndex((a) => a.providerId === adapter.providerId);
  if (index >= 0) {
    adapters[index] = adapter;
  } else {
    adapters.push(adapter);
  }
}
