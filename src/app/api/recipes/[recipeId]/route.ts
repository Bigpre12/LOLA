import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/recipes/:recipeId - Get a single recipe
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ recipeId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { recipeId } = await params;

    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
      include: {
        template: {
          select: { id: true, name: true, slug: true, category: true },
        },
      },
    });

    if (!recipe) {
      return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
    }

    if (recipe.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Get recipe error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/recipes/:recipeId - Update a recipe
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ recipeId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { recipeId } = await params;
    const body = await request.json();
    const { name, description, inputs, options } = body;

    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
    }

    if (recipe.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const updated = await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(inputs && { inputs }),
        ...(options && { options }),
      },
    });

    return NextResponse.json({ recipe: updated });
  } catch (error) {
    console.error("Update recipe error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/recipes/:recipeId - Delete a recipe
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ recipeId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { recipeId } = await params;

    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
    }

    if (recipe.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await prisma.recipe.delete({ where: { id: recipeId } });

    return NextResponse.json({ message: "Recipe deleted" });
  } catch (error) {
    console.error("Delete recipe error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/recipes/:recipeId/use - Mark recipe as used (increment counter)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ recipeId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { recipeId } = await params;

    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      return NextResponse.json({ message: "Recipe not found" }, { status: 404 });
    }

    if (recipe.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        timesUsed: { increment: 1 },
        lastUsedAt: new Date(),
      },
    });

    return NextResponse.json({ message: "Recipe usage tracked" });
  } catch (error) {
    console.error("Use recipe error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
