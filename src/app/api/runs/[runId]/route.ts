import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { runId } = await params;

    const run = await prisma.run.findUnique({
      where: { id: runId },
      include: {
        template: true,
      },
    });

    if (!run) {
      return NextResponse.json(
        { message: "Run not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (run.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json(run);
  } catch (error) {
    console.error("Get run error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
