import { NextRequest, NextResponse } from "next/server";
import { validateApiKey, hasPermission } from "@/lib/api-auth";
import prisma from "@/lib/prisma";

// GET /api/v1/runs/:runId - Get a single run
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
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

    const { runId } = await params;

    const run = await prisma.run.findUnique({
      where: { id: runId },
      include: {
        template: {
          select: {
            id: true,
            slug: true,
            name: true,
            category: true,
          },
        },
      },
    });

    if (!run) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }

    if (run.userId !== apiKey.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({
      id: run.id,
      status: run.status,
      template: run.template,
      inputs: run.inputs,
      options: run.options,
      outputs: run.outputs,
      error: run.error,
      durationMs: run.durationMs,
      creditsUsed: run.creditsUsed,
      createdAt: run.createdAt,
      updatedAt: run.updatedAt,
    });
  } catch (error) {
    console.error("API get run error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
