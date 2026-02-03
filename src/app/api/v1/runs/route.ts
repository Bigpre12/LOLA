import { NextRequest, NextResponse } from "next/server";
import { validateApiKey, hasPermission } from "@/lib/api-auth";
import prisma from "@/lib/prisma";
import { runPipeline } from "@/lib/pipeline/runner";
import { triggerWebhooks } from "@/lib/webhooks";
import { Template } from "@/types";

// POST /api/v1/runs - Create a new run via API
export async function POST(request: NextRequest) {
  try {
    const apiKey = await validateApiKey(request);

    if (!apiKey) {
      return NextResponse.json(
        { error: "Invalid or missing API key" },
        { status: 401 }
      );
    }

    if (!hasPermission(apiKey, "run")) {
      return NextResponse.json(
        { error: "API key does not have 'run' permission" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { templateId, inputs, options } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: "templateId is required" },
        { status: 400 }
      );
    }

    // Get template
    let template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      template = await prisma.template.findUnique({
        where: { slug: templateId },
      });
    }

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Check user credits
    const user = await prisma.user.findUnique({
      where: { id: apiKey.userId },
    });

    if (!user || user.credits < template.estimatedCredits) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    // Create run
    const run = await prisma.run.create({
      data: {
        userId: apiKey.userId,
        templateId: template.id,
        status: "RUNNING",
        inputs: inputs || {},
        options: options || {},
        apiKeyId: apiKey.keyId,
      },
    });

    // Trigger webhook for run started
    await triggerWebhooks(apiKey.userId, "run.started", {
      runId: run.id,
      templateId: template.id,
      templateSlug: template.slug,
    });

    // Run pipeline async
    runPipelineAsync(run.id, template as unknown as Template, inputs || {}, options || {}, apiKey.userId);

    return NextResponse.json({
      id: run.id,
      status: run.status,
      templateId: template.id,
      createdAt: run.createdAt,
    });
  } catch (error) {
    console.error("API run error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/v1/runs - List runs
export async function GET(request: NextRequest) {
  try {
    const apiKey = await validateApiKey(request);

    if (!apiKey) {
      return NextResponse.json(
        { error: "Invalid or missing API key" },
        { status: 401 }
      );
    }

    if (!hasPermission(apiKey, "read")) {
      return NextResponse.json(
        { error: "API key does not have 'read' permission" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("status");

    const where: { userId: string; status?: "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED" } = { userId: apiKey.userId };
    if (status && ["QUEUED", "RUNNING", "COMPLETED", "FAILED"].includes(status)) {
      where.status = status as "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED";
    }

    const [runs, total] = await Promise.all([
      prisma.run.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        select: {
          id: true,
          status: true,
          templateId: true,
          createdAt: true,
          updatedAt: true,
          outputs: true,
          error: true,
        },
      }),
      prisma.run.count({ where }),
    ]);

    return NextResponse.json({
      runs,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + runs.length < total,
      },
    });
  } catch (error) {
    console.error("API list runs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Async pipeline execution
async function runPipelineAsync(
  runId: string,
  template: Template,
  inputs: Record<string, unknown>,
  options: Record<string, unknown>,
  userId: string
) {
  const startTime = Date.now();

  try {
    const result = await runPipeline(template, inputs, options);

    if (result.success) {
      await prisma.run.update({
        where: { id: runId },
        data: {
          status: "COMPLETED",
          outputs: result.outputs as unknown as object[],
          durationMs: Date.now() - startTime,
          creditsUsed: template.estimatedCredits,
        },
      });

      // Deduct credits
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: template.estimatedCredits } },
      });

      // Update template stats
      await prisma.template.update({
        where: { id: template.id },
        data: { totalRuns: { increment: 1 } },
      });

      // Trigger webhook
      await triggerWebhooks(userId, "run.completed", {
        runId,
        templateId: template.id,
        outputs: result.outputs,
        durationMs: Date.now() - startTime,
      });
    } else {
      await prisma.run.update({
        where: { id: runId },
        data: {
          status: "FAILED",
          error: result.error,
          durationMs: Date.now() - startTime,
        },
      });

      // Trigger webhook
      await triggerWebhooks(userId, "run.failed", {
        runId,
        templateId: template.id,
        error: result.error,
      });
    }
  } catch (error) {
    await prisma.run.update({
      where: { id: runId },
      data: {
        status: "FAILED",
        error: error instanceof Error ? error.message : "Unknown error",
        durationMs: Date.now() - startTime,
      },
    });

    await triggerWebhooks(userId, "run.failed", {
      runId,
      templateId: template.id,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
