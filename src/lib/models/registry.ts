// ============================================
// MODEL REGISTRY - All supported models
// ============================================

import {
  ModelEntry,
  ModelType,
  ModelSelectionCriteria,
  ProviderId,
} from "./types";

/**
 * The master model registry
 * Add new models here - they're automatically available in pipelines
 */
export const MODEL_REGISTRY: ModelEntry[] = [
  // ============================================
  // FAL.AI MODELS
  // ============================================
  {
    id: "flux-dev",
    name: "Flux Dev",
    description: "High-quality image generation with excellent prompt following",
    type: "image_generate",
    provider: "fal",
    capabilities: ["photoreal", "artistic", "text_in_image", "high_res"],
    endpoint: "fal-ai/flux/dev",
    costPerUnit: 0.025,
    costUnit: "image",
    avgLatencyMs: 15000,
    maxWidth: 1440,
    maxHeight: 1440,
    status: "active",
    defaultParams: { num_inference_steps: 28, guidance_scale: 3.5 },
    supportedParams: ["prompt", "width", "height", "seed", "num_inference_steps", "guidance_scale"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "flux-schnell",
    name: "Flux Schnell",
    description: "Fast image generation, 4 steps",
    type: "image_generate",
    provider: "fal",
    capabilities: ["photoreal", "artistic", "fast"],
    endpoint: "fal-ai/flux/schnell",
    costPerUnit: 0.003,
    costUnit: "image",
    avgLatencyMs: 3000,
    maxWidth: 1440,
    maxHeight: 1440,
    status: "active",
    defaultParams: { num_inference_steps: 4 },
    supportedParams: ["prompt", "width", "height", "seed"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "flux-pro",
    name: "Flux Pro",
    description: "Highest quality Flux model",
    type: "image_generate",
    provider: "fal",
    capabilities: ["photoreal", "artistic", "text_in_image", "high_res", "faces"],
    endpoint: "fal-ai/flux-pro",
    costPerUnit: 0.05,
    costUnit: "image",
    avgLatencyMs: 20000,
    maxWidth: 2048,
    maxHeight: 2048,
    status: "active",
    defaultParams: { guidance_scale: 3.5 },
    supportedParams: ["prompt", "width", "height", "seed", "guidance_scale"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "fal-sdxl",
    name: "SDXL (Fal)",
    description: "Stable Diffusion XL via Fal",
    type: "image_generate",
    provider: "fal",
    capabilities: ["photoreal", "artistic", "lora", "controlnet"],
    endpoint: "fal-ai/fast-sdxl",
    costPerUnit: 0.01,
    costUnit: "image",
    avgLatencyMs: 8000,
    maxWidth: 1024,
    maxHeight: 1024,
    status: "active",
    defaultParams: { num_inference_steps: 25, guidance_scale: 7.5 },
    supportedParams: ["prompt", "negative_prompt", "width", "height", "seed", "num_inference_steps", "guidance_scale"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "fal-sd3",
    name: "Stable Diffusion 3",
    description: "SD3 Medium via Fal",
    type: "image_generate",
    provider: "fal",
    capabilities: ["photoreal", "artistic", "text_in_image"],
    endpoint: "fal-ai/stable-diffusion-v3-medium",
    costPerUnit: 0.035,
    costUnit: "image",
    avgLatencyMs: 12000,
    maxWidth: 1536,
    maxHeight: 1536,
    status: "active",
    supportedParams: ["prompt", "negative_prompt", "width", "height", "seed"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },

  // ============================================
  // REPLICATE MODELS
  // ============================================
  {
    id: "replicate-sdxl",
    name: "SDXL (Replicate)",
    description: "Stable Diffusion XL via Replicate",
    type: "image_generate",
    provider: "replicate",
    capabilities: ["photoreal", "artistic", "lora"],
    endpoint: "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
    costPerUnit: 0.012,
    costUnit: "image",
    avgLatencyMs: 10000,
    maxWidth: 1024,
    maxHeight: 1024,
    status: "active",
    defaultParams: { num_inference_steps: 25, guidance_scale: 7.5 },
    supportedParams: ["prompt", "negative_prompt", "width", "height", "seed", "num_inference_steps", "guidance_scale"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "replicate-flux-dev",
    name: "Flux Dev (Replicate)",
    description: "Flux Dev via Replicate",
    type: "image_generate",
    provider: "replicate",
    capabilities: ["photoreal", "artistic", "text_in_image", "high_res"],
    endpoint: "black-forest-labs/flux-dev",
    costPerUnit: 0.03,
    costUnit: "image",
    avgLatencyMs: 18000,
    maxWidth: 1440,
    maxHeight: 1440,
    status: "active",
    supportedParams: ["prompt", "width", "height", "seed", "guidance", "num_inference_steps"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "replicate-flux-schnell",
    name: "Flux Schnell (Replicate)",
    description: "Fast Flux via Replicate",
    type: "image_generate",
    provider: "replicate",
    capabilities: ["photoreal", "artistic", "fast"],
    endpoint: "black-forest-labs/flux-schnell",
    costPerUnit: 0.003,
    costUnit: "image",
    avgLatencyMs: 4000,
    maxWidth: 1440,
    maxHeight: 1440,
    status: "active",
    supportedParams: ["prompt", "width", "height", "seed"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },

  // ============================================
  // OPENAI MODELS
  // ============================================
  {
    id: "dall-e-3",
    name: "DALL-E 3",
    description: "OpenAI's latest image model",
    type: "image_generate",
    provider: "openai",
    capabilities: ["photoreal", "artistic", "text_in_image", "logos"],
    endpoint: "dall-e-3",
    costPerUnit: 0.04,
    costUnit: "image",
    avgLatencyMs: 15000,
    maxWidth: 1792,
    maxHeight: 1024,
    status: "active",
    defaultParams: { quality: "standard" },
    supportedParams: ["prompt", "size", "quality", "style"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "dall-e-3-hd",
    name: "DALL-E 3 HD",
    description: "DALL-E 3 with HD quality",
    type: "image_generate",
    provider: "openai",
    capabilities: ["photoreal", "artistic", "text_in_image", "logos", "high_res"],
    endpoint: "dall-e-3",
    costPerUnit: 0.08,
    costUnit: "image",
    avgLatencyMs: 20000,
    maxWidth: 1792,
    maxHeight: 1024,
    status: "active",
    defaultParams: { quality: "hd" },
    supportedParams: ["prompt", "size", "quality", "style"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "OpenAI's multimodal model",
    type: "text_generate",
    provider: "openai",
    capabilities: ["fast"],
    endpoint: "gpt-4o",
    costPerUnit: 0.005,
    costUnit: "1k_tokens",
    avgLatencyMs: 2000,
    maxTokens: 128000,
    status: "active",
    supportedParams: ["prompt", "system_prompt", "max_tokens", "temperature"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },

  // ============================================
  // TOGETHER AI MODELS
  // ============================================
  {
    id: "together-flux-schnell",
    name: "Flux Schnell (Together)",
    description: "Fast Flux via Together AI",
    type: "image_generate",
    provider: "together",
    capabilities: ["photoreal", "artistic", "fast"],
    endpoint: "black-forest-labs/FLUX.1-schnell-Free",
    costPerUnit: 0.0,
    costUnit: "image",
    avgLatencyMs: 5000,
    maxWidth: 1440,
    maxHeight: 1440,
    status: "active",
    supportedParams: ["prompt", "width", "height", "seed", "steps"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "together-sdxl-turbo",
    name: "SDXL Turbo (Together)",
    description: "Ultra-fast SDXL via Together AI",
    type: "image_generate",
    provider: "together",
    capabilities: ["artistic", "fast"],
    endpoint: "stabilityai/sdxl-turbo",
    costPerUnit: 0.002,
    costUnit: "image",
    avgLatencyMs: 2000,
    maxWidth: 1024,
    maxHeight: 1024,
    status: "active",
    defaultParams: { steps: 4 },
    supportedParams: ["prompt", "width", "height", "seed", "steps"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },

  // ============================================
  // STABILITY AI MODELS
  // ============================================
  {
    id: "stability-sd3-turbo",
    name: "SD3 Turbo",
    description: "Fast SD3 from Stability",
    type: "image_generate",
    provider: "stability",
    capabilities: ["photoreal", "artistic", "fast", "text_in_image"],
    endpoint: "sd3-turbo",
    costPerUnit: 0.04,
    costUnit: "image",
    avgLatencyMs: 4000,
    maxWidth: 1536,
    maxHeight: 1536,
    status: "active",
    supportedParams: ["prompt", "negative_prompt", "width", "height", "seed"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "stability-upscale",
    name: "Stability Upscale",
    description: "4x image upscaling",
    type: "image_upscale",
    provider: "stability",
    capabilities: ["high_res"],
    endpoint: "esrgan-v1-x2plus",
    costPerUnit: 0.02,
    costUnit: "image",
    avgLatencyMs: 5000,
    status: "active",
    supportedParams: ["image"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },

  // ============================================
  // IDEOGRAM MODELS
  // ============================================
  {
    id: "ideogram-v2",
    name: "Ideogram V2",
    description: "Excellent at text rendering in images",
    type: "image_generate",
    provider: "ideogram",
    capabilities: ["text_in_image", "logos", "artistic", "photoreal"],
    endpoint: "V_2",
    costPerUnit: 0.08,
    costUnit: "image",
    avgLatencyMs: 12000,
    maxWidth: 2048,
    maxHeight: 2048,
    status: "beta",
    supportedParams: ["prompt", "aspect_ratio", "style_type", "magic_prompt_option"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "ideogram-v2-turbo",
    name: "Ideogram V2 Turbo",
    description: "Fast Ideogram with good text",
    type: "image_generate",
    provider: "ideogram",
    capabilities: ["text_in_image", "logos", "artistic", "fast"],
    endpoint: "V_2_TURBO",
    costPerUnit: 0.05,
    costUnit: "image",
    avgLatencyMs: 6000,
    maxWidth: 2048,
    maxHeight: 2048,
    status: "beta",
    supportedParams: ["prompt", "aspect_ratio", "style_type"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },

  // ============================================
  // VIDEO MODELS
  // ============================================
  {
    id: "runway-gen3",
    name: "Runway Gen-3",
    description: "High-quality video generation",
    type: "video_generate",
    provider: "runway",
    capabilities: ["photoreal", "consistent_char"],
    endpoint: "gen3a_turbo",
    costPerUnit: 0.25,
    costUnit: "second",
    avgLatencyMs: 60000,
    maxDuration: 10,
    status: "beta",
    supportedParams: ["prompt", "image_url", "duration", "aspect_ratio"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "kling-v1",
    name: "Kling 1.0",
    description: "Kuaishou's video model",
    type: "video_generate",
    provider: "kling",
    capabilities: ["photoreal", "long_form"],
    endpoint: "kling-video/v1/videos/image2video",
    costPerUnit: 0.15,
    costUnit: "second",
    avgLatencyMs: 120000,
    maxDuration: 5,
    status: "beta",
    supportedParams: ["prompt", "image_url", "duration", "aspect_ratio"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "luma-dream-machine",
    name: "Luma Dream Machine",
    description: "Luma AI video generation",
    type: "video_generate",
    provider: "luma",
    capabilities: ["photoreal", "artistic"],
    endpoint: "dream-machine",
    costPerUnit: 0.20,
    costUnit: "second",
    avgLatencyMs: 90000,
    maxDuration: 5,
    status: "beta",
    supportedParams: ["prompt", "image_url", "aspect_ratio"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "pika-v1",
    name: "Pika 1.0",
    description: "Pika Labs video generation",
    type: "video_generate",
    provider: "pika",
    capabilities: ["artistic", "fast"],
    endpoint: "v1",
    costPerUnit: 0.10,
    costUnit: "second",
    avgLatencyMs: 45000,
    maxDuration: 3,
    status: "beta",
    supportedParams: ["prompt", "image_url"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },

  // ============================================
  // MOCK/TEST MODEL
  // ============================================
  {
    id: "mock-image",
    name: "Mock Image Generator",
    description: "Returns placeholder images for testing",
    type: "image_generate",
    provider: "mock",
    capabilities: ["fast"],
    endpoint: "mock",
    costPerUnit: 0,
    costUnit: "image",
    avgLatencyMs: 500,
    maxWidth: 2048,
    maxHeight: 2048,
    status: "active",
    supportedParams: ["prompt", "width", "height"],
    addedAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
];

/**
 * Get a model by ID
 */
export function getModel(modelId: string): ModelEntry | undefined {
  return MODEL_REGISTRY.find((m) => m.id === modelId);
}

/**
 * Get all models of a specific type
 */
export function getModelsByType(type: ModelType): ModelEntry[] {
  return MODEL_REGISTRY.filter((m) => m.type === type && m.status !== "disabled");
}

/**
 * Get all models from a specific provider
 */
export function getModelsByProvider(provider: ProviderId): ModelEntry[] {
  return MODEL_REGISTRY.filter((m) => m.provider === provider && m.status !== "disabled");
}

/**
 * Find models matching selection criteria
 */
export function findModels(criteria: ModelSelectionCriteria): ModelEntry[] {
  return MODEL_REGISTRY.filter((m) => {
    // Must match type
    if (m.type !== criteria.type) return false;
    
    // Must not be disabled
    if (m.status === "disabled") return false;
    
    // Check capabilities
    if (criteria.capabilities) {
      const hasAll = criteria.capabilities.every((cap) =>
        m.capabilities.includes(cap)
      );
      if (!hasAll) return false;
    }
    
    // Check cost
    if (criteria.maxCost !== undefined && m.costPerUnit > criteria.maxCost) {
      return false;
    }
    
    // Check excluded providers
    if (criteria.excludeProviders?.includes(m.provider)) {
      return false;
    }
    
    // Check excluded models
    if (criteria.excludeModels?.includes(m.id)) {
      return false;
    }
    
    return true;
  });
}

/**
 * Select the best model for given criteria
 */
export function selectBestModel(criteria: ModelSelectionCriteria): ModelEntry | undefined {
  const candidates = findModels(criteria);
  
  if (candidates.length === 0) return undefined;
  
  // Sort by preference
  return candidates.sort((a, b) => {
    // Prefer active over beta
    if (a.status === "active" && b.status !== "active") return -1;
    if (b.status === "active" && a.status !== "active") return 1;
    
    if (criteria.preferFast) {
      // Sort by latency
      return (a.avgLatencyMs || 99999) - (b.avgLatencyMs || 99999);
    }
    
    if (criteria.preferQuality) {
      // Sort by cost (higher cost often = higher quality)
      return b.costPerUnit - a.costPerUnit;
    }
    
    // Default: sort by cost (cheaper first)
    return a.costPerUnit - b.costPerUnit;
  })[0];
}

/**
 * Get all active models for display
 */
export function getActiveModels(): ModelEntry[] {
  return MODEL_REGISTRY.filter((m) => m.status === "active" || m.status === "beta");
}

/**
 * Estimate cost for a run based on model and parameters
 */
export function estimateCost(
  modelId: string,
  params?: { count?: number; duration?: number; tokens?: number }
): number {
  const model = getModel(modelId);
  if (!model) return 0;
  
  const count = params?.count || 1;
  const duration = params?.duration || 1;
  const tokens = params?.tokens || 1000;
  
  switch (model.costUnit) {
    case "image":
    case "request":
      return model.costPerUnit * count;
    case "second":
      return model.costPerUnit * duration;
    case "1k_tokens":
      return model.costPerUnit * (tokens / 1000);
    default:
      return model.costPerUnit;
  }
}
