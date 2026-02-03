// LOLA Type Definitions

// ============================================
// Enums (matching Prisma schema)
// ============================================

export type Plan = "FREE" | "PRO";
export type Category = "ECOMMERCE" | "ADS" | "BRAND";
export type RunStatus = "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED";

// ============================================
// Input Schema Types
// ============================================

export type InputFieldType = "text" | "textarea" | "image";

export interface InputField {
  key: string;
  type: InputFieldType;
  label: string;
  required: boolean;
  placeholder?: string;
}

export interface InputSchema {
  fields: InputField[];
}

// ============================================
// Options Schema Types
// ============================================

export type OptionFieldType = "slider" | "select" | "checkbox";

export interface BaseOptionField {
  key: string;
  label: string;
}

export interface SliderOptionField extends BaseOptionField {
  type: "slider";
  default: number;
  min: number;
  max: number;
  step?: number;
}

export interface SelectOptionField extends BaseOptionField {
  type: "select";
  default: string;
  options: { value: string; label: string }[];
}

export interface CheckboxOptionField extends BaseOptionField {
  type: "checkbox";
  default: boolean;
}

export type OptionField = SliderOptionField | SelectOptionField | CheckboxOptionField;

export interface OptionsSchema {
  fields: OptionField[];
}

// ============================================
// Pipeline Types
// ============================================

export type PipelineStepType = "image_generate" | "image_edit" | "video_generate";
export type AIProviderName = "fal" | "replicate" | "openai" | "mock";

export interface PipelineStep {
  id: string;
  type: PipelineStepType;
  model?: AIProviderName;
  promptTemplate: string;
  label?: string;
}

export interface ModelPipeline {
  steps: PipelineStep[];
}

// ============================================
// Output Types
// ============================================

export interface OutputMeta {
  prompt: string;
  seed?: number;
  model?: string;
  duration_ms?: number;
}

export interface Output {
  stepId: string;
  url: string;
  meta: OutputMeta;
}

// ============================================
// Template Types
// ============================================

export interface Template {
  id: string;
  slug: string;
  name: string;
  category: Category;
  description: string;
  inputSchema: InputSchema;
  optionsSchema: OptionsSchema;
  modelPipeline: ModelPipeline;
  estimatedCredits: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Run Types
// ============================================

export interface Run {
  id: string;
  userId: string;
  templateId: string;
  status: RunStatus;
  inputs: Record<string, unknown>;
  options: Record<string, unknown>;
  outputs: Output[] | null;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
  template?: Template;
}

// ============================================
// User Types
// ============================================

export interface UserPreferences {
  primaryUseCase?: "ecommerce" | "social_ads" | "brand_visuals" | "not_sure";
  usedAdvancedTools?: boolean;
  onboardingCompleted?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  plan: Plan;
  credits: number;
  preferences: UserPreferences | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// API Request/Response Types
// ============================================

export interface RunTemplateRequest {
  templateId: string;
  inputs: Record<string, unknown>;
  options: Record<string, unknown>;
}

export interface RunTemplateResponse {
  runId: string;
  status: RunStatus;
}

export interface UpdatePreferencesRequest {
  primaryUseCase?: UserPreferences["primaryUseCase"];
  usedAdvancedTools?: boolean;
  onboardingCompleted?: boolean;
}

// ============================================
// AI Provider Types
// ============================================

export interface ImageGenerationOptions {
  width?: number;
  height?: number;
  seed?: number;
  numInferenceSteps?: number;
}

export interface AIProvider {
  name: AIProviderName;
  generateImage(prompt: string, options?: ImageGenerationOptions): Promise<string>;
}
