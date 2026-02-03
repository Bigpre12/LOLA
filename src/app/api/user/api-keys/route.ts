import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateApiKey, hashApiKey } from "@/lib/api-auth";

// GET /api/user/api-keys - List user's API keys
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        keyPreview: true,
        permissions: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ apiKeys });
  } catch (error) {
    console.error("List API keys error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/user/api-keys - Create a new API key
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check if user has API access (Pro+ plan)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    });

    if (!user || !["PRO", "ENTERPRISE"].includes(user.plan)) {
      return NextResponse.json(
        { message: "API access requires Pro plan or higher" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, permissions = ["read", "run"], expiresInDays } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    // Generate new API key
    const { key, preview } = generateApiKey();
    const hashedKey = hashApiKey(key);

    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    await prisma.apiKey.create({
      data: {
        userId: session.user.id,
        name,
        key: hashedKey,
        keyPreview: preview,
        permissions,
        expiresAt,
      },
    });

    // Return the unhashed key only once
    return NextResponse.json({
      key, // Only returned on creation!
      preview,
      message: "API key created. Store it securely - you won't see it again.",
    });
  } catch (error) {
    console.error("Create API key error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/user/api-keys/:id - Delete an API key
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get("id");

    if (!keyId) {
      return NextResponse.json({ message: "Key ID required" }, { status: 400 });
    }

    const apiKey = await prisma.apiKey.findUnique({
      where: { id: keyId },
    });

    if (!apiKey || apiKey.userId !== session.user.id) {
      return NextResponse.json({ message: "API key not found" }, { status: 404 });
    }

    await prisma.apiKey.delete({ where: { id: keyId } });

    return NextResponse.json({ message: "API key deleted" });
  } catch (error) {
    console.error("Delete API key error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
