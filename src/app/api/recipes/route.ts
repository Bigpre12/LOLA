import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/recipes - List user's recipes
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get("templateId");

    const where: { userId: string; templateId?: string } = { userId: session.user.id };
    if (templateId) {
      where.templateId = templateId;
    }

    const recipes = await prisma.recipe.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        template: {
          select: { id: true, name: true, slug: true, category: true },
        },
      },
    });

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error("List recipes error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/recipes - Create a new recipe
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { templateId, name, description, inputs, options, runId } = body;

    if (!templateId || !name) {
      return NextResponse.json(
        { message: "Template ID and name are required" },
        { status: 400 }
      );
    }

    // If creating from a run, get inputs/options from the run
    let recipeInputs = inputs || {};
    let recipeOptions = options || {};

    if (runId) {
      const run = await prisma.run.findUnique({
        where: { id: runId },
        select: { inputs: true, options: true, userId: true },
      });

      if (!run || run.userId !== session.user.id) {
        return NextResponse.json({ message: "Run not found" }, { status: 404 });
      }

      recipeInputs = run.inputs as object;
      recipeOptions = run.options as object;
    }

    // Remove image URLs from inputs (can't save those)
    const sanitizedInputs = { ...recipeInputs };
    for (const key in sanitizedInputs) {
      const value = sanitizedInputs[key as keyof typeof sanitizedInputs];
      if (typeof value === "string" && (value.startsWith("http") || value.startsWith("data:"))) {
        delete sanitizedInputs[key as keyof typeof sanitizedInputs];
      }
    }

    const recipe = await prisma.recipe.create({
      data: {
        userId: session.user.id,
        templateId,
        name,
        description,
        inputs: sanitizedInputs,
        options: recipeOptions,
      },
      include: {
        template: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Create recipe error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
