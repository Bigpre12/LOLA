import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { runPipeline } from "@/lib/pipeline/runner";
import { Template } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { templateId, inputs, options } = body;

    if (!templateId) {
      return NextResponse.json(
        { message: "Template ID is required" },
        { status: 400 }
      );
    }

    // Get the template
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      // Try finding by slug
      const templateBySlug = await prisma.template.findUnique({
        where: { slug: templateId },
      });
      
      if (!templateBySlug) {
        return NextResponse.json(
          { message: "Template not found" },
          { status: 404 }
        );
      }
    }

    const foundTemplate = template || await prisma.template.findUnique({
      where: { slug: templateId },
    });

    if (!foundTemplate) {
      return NextResponse.json(
        { message: "Template not found" },
        { status: 404 }
      );
    }

    // Check user credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.credits < foundTemplate.estimatedCredits) {
      return NextResponse.json(
        { message: "Insufficient credits" },
        { status: 402 }
      );
    }

    // Create the run
    const run = await prisma.run.create({
      data: {
        userId: session.user.id,
        templateId: foundTemplate.id,
        status: "RUNNING",
        inputs: inputs || {},
        options: options || {},
      },
    });

    // Run the pipeline asynchronously
    runPipelineAsync(run.id, foundTemplate as unknown as Template, inputs, options, session.user.id);

    return NextResponse.json({
      runId: run.id,
      status: "RUNNING",
    });
  } catch (error) {
    console.error("Run template error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Run pipeline in background
async function runPipelineAsync(
  runId: string,
  template: Template,
  inputs: Record<string, unknown>,
  options: Record<string, unknown>,
  userId: string
) {
  try {
    const result = await runPipeline(template, inputs, options);

    if (result.success) {
      // Update run with outputs
      await prisma.run.update({
        where: { id: runId },
        data: {
          status: "COMPLETED",
          outputs: result.outputs as unknown as object[],
        },
      });

      // Deduct credits
      await prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            decrement: template.estimatedCredits,
          },
        },
      });
    } else {
      // Mark run as failed
      await prisma.run.update({
        where: { id: runId },
        data: {
          status: "FAILED",
          error: result.error,
        },
      });
    }
  } catch (error) {
    console.error("Pipeline error:", error);
    await prisma.run.update({
      where: { id: runId },
      data: {
        status: "FAILED",
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}
