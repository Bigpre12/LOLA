import crypto from "crypto";
import prisma from "./prisma";

export type WebhookEvent = "run.completed" | "run.failed" | "run.started";

interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: Record<string, unknown>;
}

// Generate signature for webhook payload
function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
}

// Trigger webhooks for a user
export async function triggerWebhooks(
  userId: string,
  event: WebhookEvent,
  data: Record<string, unknown>
): Promise<void> {
  try {
    const webhooks = await prisma.webhook.findMany({
      where: {
        userId,
        isActive: true,
        events: { has: event },
      },
    });

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    };

    const payloadString = JSON.stringify(payload);

    // Fire all webhooks concurrently
    await Promise.allSettled(
      webhooks.map(async (webhook) => {
        const signature = generateSignature(payloadString, webhook.secret);

        try {
          const response = await fetch(webhook.url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-LOLA-Signature": signature,
              "X-LOLA-Event": event,
            },
            body: payloadString,
          });

          // Update webhook status
          await prisma.webhook.update({
            where: { id: webhook.id },
            data: {
              lastTriggeredAt: new Date(),
              lastError: response.ok ? null : `HTTP ${response.status}`,
            },
          });
        } catch (error) {
          // Update webhook with error
          await prisma.webhook.update({
            where: { id: webhook.id },
            data: {
              lastTriggeredAt: new Date(),
              lastError: error instanceof Error ? error.message : "Unknown error",
            },
          });
        }
      })
    );
  } catch (error) {
    console.error("Webhook trigger error:", error);
  }
}
