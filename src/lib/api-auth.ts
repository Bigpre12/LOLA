import { NextRequest } from "next/server";
import prisma from "./prisma";
import crypto from "crypto";

export interface ApiKeyPayload {
  userId: string;
  keyId: string;
  permissions: string[];
}

// Hash API key for storage
export function hashApiKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

// Generate a new API key
export function generateApiKey(): { key: string; preview: string } {
  const key = `ff_${crypto.randomBytes(32).toString("hex")}`;
  const preview = key.slice(-4);
  return { key, preview };
}

// Validate API key from request
export async function validateApiKey(
  request: NextRequest
): Promise<ApiKeyPayload | null> {
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const key = authHeader.slice(7);
  const hashedKey = hashApiKey(key);

  try {
    const apiKey = await prisma.apiKey.findUnique({
      where: { key: hashedKey },
      include: { user: { select: { id: true, plan: true } } },
    });

    if (!apiKey) {
      return null;
    }

    // Check if expired
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return null;
    }

    // Update last used
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return {
      userId: apiKey.userId,
      keyId: apiKey.id,
      permissions: apiKey.permissions,
    };
  } catch (error) {
    console.error("API key validation error:", error);
    return null;
  }
}

// Check if payload has required permission
export function hasPermission(
  payload: ApiKeyPayload,
  required: string
): boolean {
  return payload.permissions.includes(required) || payload.permissions.includes("all");
}
