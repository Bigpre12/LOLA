import { NextRequest, NextResponse } from "next/server";
import { validateApiKey, hasPermission } from "@/lib/api-auth";
import prisma from "@/lib/prisma";

// GET /api/v1/templates - List all templates
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
    const category = searchParams.get("category");

    const where = category ? { category: category as "ECOMMERCE" | "ADS" | "BRAND" } : {};

    const templates = await prisma.template.findMany({
      where: { ...where, isPublic: true },
      orderBy: { totalRuns: "desc" },
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        description: true,
        estimatedCredits: true,
        costPerRun: true,
        avgRating: true,
        totalRuns: true,
        inputSchema: true,
        optionsSchema: true,
      },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("API list templates error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
