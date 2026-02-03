import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user has export permissions (Starter+ plan)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    });

    if (!user || user.plan === "FREE") {
      return NextResponse.json(
        { message: "Pipeline export requires Starter plan or higher" },
        { status: 403 }
      );
    }

    const { templateId } = await params;

    // Try finding by ID first, then by slug
    let template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      template = await prisma.template.findUnique({
        where: { slug: templateId },
      });
    }

    if (!template) {
      return NextResponse.json({ message: "Template not found" }, { status: 404 });
    }

    const exportData = {
      name: template.name,
      slug: template.slug,
      version: "1.0",
      exportedAt: new Date().toISOString(),
      exportedFrom: "LOLA",
      category: template.category,
      description: template.description,
      inputSchema: template.inputSchema,
      optionsSchema: template.optionsSchema,
      pipeline: template.modelPipeline,
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error("Export template error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
