import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { runId, rating, hitTheMark, feedback, issues } = body;

    if (!runId || rating === undefined || hitTheMark === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the run to verify ownership and get templateId
    const run = await prisma.run.findUnique({
      where: { id: runId },
      select: { userId: true, templateId: true },
    });

    if (!run) {
      return NextResponse.json({ message: "Run not found" }, { status: 404 });
    }

    if (run.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Check if feedback already exists
    const existingFeedback = await prisma.runFeedback.findUnique({
      where: { runId },
    });

    if (existingFeedback) {
      return NextResponse.json(
        { message: "Feedback already submitted" },
        { status: 400 }
      );
    }

    // Create feedback
    const runFeedback = await prisma.runFeedback.create({
      data: {
        runId,
        userId: session.user.id,
        templateId: run.templateId,
        rating,
        hitTheMark,
        feedback: feedback || null,
        issues: issues || [],
      },
    });

    // Update template analytics
    const template = await prisma.template.findUnique({
      where: { id: run.templateId },
      select: { avgRating: true, totalRatings: true },
    });

    if (template) {
      const newTotalRatings = template.totalRatings + 1;
      const newAvgRating =
        (template.avgRating * template.totalRatings + rating) / newTotalRatings;

      await prisma.template.update({
        where: { id: run.templateId },
        data: {
          avgRating: newAvgRating,
          totalRatings: newTotalRatings,
        },
      });
    }

    return NextResponse.json({
      id: runFeedback.id,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const runId = searchParams.get("runId");

    if (!runId) {
      return NextResponse.json(
        { message: "Run ID required" },
        { status: 400 }
      );
    }

    const feedback = await prisma.runFeedback.findUnique({
      where: { runId },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Get feedback error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
