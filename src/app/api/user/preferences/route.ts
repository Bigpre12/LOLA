import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { preferences: true },
    });

    return NextResponse.json(user?.preferences || {});
  } catch (error) {
    console.error("Get preferences error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const { primaryUseCase, usedAdvancedTools, onboardingCompleted } = body;

    // Get current preferences
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { preferences: true },
    });

    const currentPreferences = (user?.preferences as Record<string, unknown>) || {};

    // Merge with new preferences
    const updatedPreferences = {
      ...currentPreferences,
      ...(primaryUseCase !== undefined && { primaryUseCase }),
      ...(usedAdvancedTools !== undefined && { usedAdvancedTools }),
      ...(onboardingCompleted !== undefined && { onboardingCompleted }),
    };

    await prisma.user.update({
      where: { id: session.user.id },
      data: { preferences: updatedPreferences },
    });

    return NextResponse.json(updatedPreferences);
  } catch (error) {
    console.error("Update preferences error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
