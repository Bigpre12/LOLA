// ============================================
// CUSTOM HTTP PROVIDER ADAPTER
// For integrating any HTTP API model
// ============================================

import { BaseProviderAdapter } from "./base";
import { ModelEntry, ModelInput, ModelOutput, ProviderId, CustomHttpConfig } from "../types";

/**
 * Generic HTTP adapter that can call any REST API
 * Configure via the model's endpoint field (JSON config)
 */
export class CustomHttpAdapter extends BaseProviderAdapter {
  providerId: ProviderId = "custom_http";
  
  canHandle(model: ModelEntry): boolean {
    return model.provider === "custom_http" || model.provider === "self_hosted";
  }
  
  async generate(model: ModelEntry, input: ModelInput): Promise<ModelOutput> {
    const startTime = Date.now();
    
    try {
      // Parse config from endpoint (JSON string)
      const config = this.parseConfig(model.endpoint);
      
      // Build request
      const { url, options } = this.buildRequest(config, model, input);
      
      // Make request
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        return this.createErrorOutput(
          model,
          `HTTP ${response.status}: ${errorText}`,
          Date.now() - startTime
        );
      }
      
      const result = await response.json();
      
      // Extract media URL from response
      const mediaUrl = this.extractPath(result, config.responseMediaPath);
      
      if (!mediaUrl) {
        // Check for error
        const errorMsg = config.responseErrorPath
          ? this.extractPath(result, config.responseErrorPath)
          : null;
        return this.createErrorOutput(
          model,
          errorMsg || "No media URL in response",
          Date.now() - startTime
        );
      }
      
      // Determine output type from model type
      const outputType = this.getOutputType(model.type);
      
      return this.createOutput(model, {
        success: true,
        outputs: [{
          url: mediaUrl,
          type: outputType,
        }],
        latencyMs: Date.now() - startTime,
        cost: model.costPerUnit,
        rawResponse: result,
      });
    } catch (error) {
      return this.createErrorOutput(model, error as Error, Date.now() - startTime);
    }
  }
  
  /**
   * Parse config from endpoint JSON string
   */
  private parseConfig(endpoint: string): CustomHttpConfig {
    try {
      return JSON.parse(endpoint) as CustomHttpConfig;
    } catch {
      throw new Error(`Invalid custom HTTP config: ${endpoint}`);
    }
  }
  
  /**
   * Build HTTP request from config and input
   */
  private buildRequest(
    config: CustomHttpConfig,
    model: ModelEntry,
    input: ModelInput
  ): { url: string; options: RequestInit } {
    // Get variables for template substitution
    const variables = this.getVariables(input, model);
    
    // Build URL with variable substitution
    const url = this.substituteVariables(config.url, variables);
    
    // Build headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...config.headers,
    };
    
    // Add auth
    if (config.authType && config.authType !== "none") {
      const authToken = config.authEnvVar ? process.env[config.authEnvVar] : "";
      
      if (!authToken) {
        throw new Error(`Auth token not found in env: ${config.authEnvVar}`);
      }
      
      switch (config.authType) {
        case "bearer":
          headers["Authorization"] = `Bearer ${authToken}`;
          break;
        case "api_key":
          headers["X-API-Key"] = authToken;
          break;
        case "basic":
          headers["Authorization"] = `Basic ${Buffer.from(authToken).toString("base64")}`;
          break;
      }
    }
    
    // Build body
    let body: string | undefined;
    if (config.method === "POST" && config.bodyTemplate) {
      const bodyObj = JSON.parse(this.substituteVariables(config.bodyTemplate, variables));
      body = JSON.stringify(bodyObj);
    }
    
    return {
      url,
      options: {
        method: config.method,
        headers,
        body,
      },
    };
  }
  
  /**
   * Get variables for template substitution
   */
  private getVariables(input: ModelInput, model: ModelEntry): Record<string, string> {
    const vars: Record<string, string> = {
      model_id: model.id,
      model_endpoint: model.endpoint,
    };
    
    // Add input params
    if (input.type === "image_generate") {
      const params = input.params;
      vars.prompt = params.prompt;
      if (params.negativePrompt) vars.negative_prompt = params.negativePrompt;
      vars.width = String(params.width || 1024);
      vars.height = String(params.height || 1024);
      if (params.seed !== undefined) vars.seed = String(params.seed);
      if (params.steps) vars.steps = String(params.steps);
      if (params.guidanceScale) vars.guidance_scale = String(params.guidanceScale);
      if (params.imageUrl) vars.image_url = params.imageUrl;
    }
    
    return vars;
  }
  
  /**
   * Substitute {{variable}} placeholders in a string
   */
  private substituteVariables(template: string, vars: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      return vars[key] || "";
    });
  }
  
  /**
   * Extract a value from an object using a dot-notation path
   */
  private extractPath(obj: unknown, path: string): string | null {
    const parts = path.split(".");
    let current: unknown = obj;
    
    for (const part of parts) {
      if (current === null || current === undefined) return null;
      
      // Handle array indexing like "images[0]"
      const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
      if (arrayMatch) {
        const [, key, index] = arrayMatch;
        current = (current as Record<string, unknown>)[key];
        if (Array.isArray(current)) {
          current = current[parseInt(index)];
        }
      } else {
        current = (current as Record<string, unknown>)[part];
      }
    }
    
    return typeof current === "string" ? current : null;
  }
  
  /**
   * Map model type to output type
   */
  private getOutputType(modelType: string): "image" | "video" | "audio" | "text" | "3d" {
    if (modelType.startsWith("image")) return "image";
    if (modelType.startsWith("video")) return "video";
    if (modelType.startsWith("audio")) return "audio";
    if (modelType.startsWith("text")) return "text";
    if (modelType.startsWith("3d")) return "3d";
    return "image";
  }
}
