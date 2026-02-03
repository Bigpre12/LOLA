// ============================================
// UNIFIED MODEL LAYER - TYPE DEFINITIONS
// ============================================

/**
 * Model capability types - what a model can do
 */
export type ModelType =
  | "image_generate"      // Text-to-image
  | "image_edit"          // Inpainting, outpainting
  | "image_upscale"       // Super-resolution
  | "image_background"    // Background removal/replacement
  | "image_variation"     // Image variations
  | "video_generate"      // Text-to-video
  | "video_edit"          // Video editing
  | "video_extend"        // Extend video duration
  | "audio_generate"      // Text-to-audio/music
  | "audio_transcribe"    // Speech-to-text
  | "text_generate"       // LLM text generation
  | "3d_generate";        // Text-to-3D

/**
 * Provider identifiers
 */
export type ProviderId =
  | "fal"
  | "replicate"
  | "openai"
  | "together"
  | "runway"
  | "stability"
  | "midjourney"
  | "ideogram"
  | "kling"
  | "pika"
  | "luma"
  | "anthropic"
  | "google"
  | "custom_http"
  | "self_hosted"
  | "mock";

/**
 * Model capability tags for filtering
 */
export type ModelCapability =
  | "photoreal"           // Photorealistic output
  | "artistic"            // Artistic/stylized output
  | "logos"               // Good at logos/graphics
  | "text_in_image"       // Can render text accurately
  | "faces"               // Good at faces/portraits
  | "products"            // Good at product photography
  | "fast"                // Quick generation (<10s)
  | "high_res"            // Supports high resolution
  | "controlnet"          // Supports ControlNet/guidance
  | "lora"                // Supports LoRA adapters
  | "inpainting"          // Can do inpainting
  | "outpainting"         // Can extend images
  | "consistent_char"     // Consistent characters
  | "long_form"           // Long video/audio
  | "realtime";           // Near-realtime generation

/**
 * Model status in the registry
 */
export type ModelStatus = "active" | "beta" | "deprecated" | "disabled";

/**
 * Model registry entry - describes a single model
 */
export interface ModelEntry {
  // Identity
  id: string;                       // Your internal ID: "flux-dev", "sdxl-turbo"
  name: string;                     // Display name: "Flux Dev"
  description?: string;             // Short description
  
  // Classification
  type: ModelType;                  // What it does
  provider: ProviderId;             // Who provides it
  capabilities: ModelCapability[];  // What it's good at
  
  // Provider-specific
  endpoint: string;                 // Provider's model ID or URL
  version?: string;                 // Model version if applicable
  
  // Cost & performance
  costPerUnit: number;              // Cost in USD (per image, per 1k tokens, per second)
  costUnit: "image" | "1k_tokens" | "second" | "request";
  avgLatencyMs?: number;            // Average generation time
  
  // Limits
  maxWidth?: number;
  maxHeight?: number;
  maxDuration?: number;             // For video/audio in seconds
  maxTokens?: number;               // For text models
  
  // Configuration
  defaultParams?: Record<string, unknown>;  // Default parameters
  supportedParams?: string[];       // List of supported parameters
  
  // Status
  status: ModelStatus;
  addedAt: string;                  // ISO date
  updatedAt: string;
}

/**
 * Input for image generation
 */
export interface ImageGenerateInput {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  seed?: number;
  steps?: number;
  guidanceScale?: number;
  scheduler?: string;
  imageUrl?: string;                // Reference image
  controlImage?: string;            // ControlNet image
  loraWeights?: Array<{ url: string; scale: number }>;
  extra?: Record<string, unknown>;  // Provider-specific extras
}

/**
 * Input for image editing (inpaint/outpaint)
 */
export interface ImageEditInput {
  imageUrl: string;
  prompt: string;
  maskUrl?: string;                 // Mask for inpainting
  negativePrompt?: string;
  strength?: number;                // Edit strength (0-1)
  seed?: number;
  extra?: Record<string, unknown>;
}

/**
 * Input for image upscaling
 */
export interface ImageUpscaleInput {
  imageUrl: string;
  scale?: number;                   // 2x, 4x
  creativity?: number;              // For generative upscalers
  extra?: Record<string, unknown>;
}

/**
 * Input for video generation
 */
export interface VideoGenerateInput {
  prompt: string;
  negativePrompt?: string;
  imageUrl?: string;                // Starting frame
  duration?: number;                // Seconds
  fps?: number;
  aspectRatio?: string;
  seed?: number;
  extra?: Record<string, unknown>;
}

/**
 * Input for text generation
 */
export interface TextGenerateInput {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stopSequences?: string[];
  extra?: Record<string, unknown>;
}

/**
 * Union of all input types
 */
export type ModelInput =
  | { type: "image_generate"; params: ImageGenerateInput }
  | { type: "image_edit"; params: ImageEditInput }
  | { type: "image_upscale"; params: ImageUpscaleInput }
  | { type: "video_generate"; params: VideoGenerateInput }
  | { type: "text_generate"; params: TextGenerateInput };

/**
 * Standard output from any model call
 */
export interface ModelOutput {
  success: boolean;
  modelId: string;
  provider: ProviderId;
  
  // Output URLs (uploaded to our storage)
  outputs: Array<{
    url: string;
    type: "image" | "video" | "audio" | "text" | "3d";
    width?: number;
    height?: number;
    duration?: number;
  }>;
  
  // Metadata
  seed?: number;
  latencyMs: number;
  cost: number;
  
  // Error info
  error?: string;
  errorCode?: string;
  
  // Raw provider response (for debugging)
  rawResponse?: unknown;
}

/**
 * Model selection criteria for auto-routing
 */
export interface ModelSelectionCriteria {
  type: ModelType;
  capabilities?: ModelCapability[];
  maxCost?: number;
  preferFast?: boolean;
  preferQuality?: boolean;
  excludeProviders?: ProviderId[];
  excludeModels?: string[];
}

/**
 * Provider adapter interface - all providers implement this
 */
export interface ProviderAdapter {
  providerId: ProviderId;
  
  // Check if this adapter can handle a model
  canHandle(model: ModelEntry): boolean;
  
  // Generate content
  generate(model: ModelEntry, input: ModelInput): Promise<ModelOutput>;
  
  // Check availability/health
  healthCheck?(): Promise<boolean>;
}

/**
 * Custom HTTP model configuration
 */
export interface CustomHttpConfig {
  method: "GET" | "POST";
  url: string;
  headers?: Record<string, string>;
  bodyTemplate: string;             // JSON template with {{variable}} placeholders
  responseMediaPath: string;        // JSON path to media URL in response
  responseErrorPath?: string;       // JSON path to error message
  authType?: "bearer" | "api_key" | "basic" | "none";
  authEnvVar?: string;              // Env var name for auth token
}
