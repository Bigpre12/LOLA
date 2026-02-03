import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

// GET /api/share - List user's share links
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const shareLinks = await prisma.shareLink.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        run: {
          select: {
            id: true,
            status: true,
            template: { select: { name: true } },
          },
        },
        _count: { select: { comments: true } },
      },
    });

    return NextResponse.json({ shareLinks });
  } catch (error) {
    console.error("List share links error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/share - Create a new share link
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      runId,
      allowDownload = true,
      allowComments = true,
      requiresEmail = false,
      password,
      expiresInDays,
      maxViews,
    } = body;

    if (!runId) {
      return NextResponse.json({ message: "Run ID required" }, { status: 400 });
    }

    // Verify run ownership
    const run = await prisma.run.findUnique({
      where: { id: runId },
      select: { userId: true, status: true },
    });

    if (!run || run.userId !== session.user.id) {
      return NextResponse.json({ message: "Run not found" }, { status: 404 });
    }

    if (run.status !== "COMPLETED") {
      return NextResponse.json(
        { message: "Can only share completed runs" },
        { status: 400 }
      );
    }

    // Generate unique token
    const token = crypto.randomBytes(16).toString("hex");

    // Calculate expiration
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const shareLink = await prisma.shareLink.create({
      data: {
        runId,
        userId: session.user.id,
        token,
        allowDownload,
        allowComments,
        requiresEmail,
        password: password || null,
        expiresAt,
        maxViews,
      },
    });

    const shareUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/share/${token}`;

    return NextResponse.json({
      shareLink,
      shareUrl,
    });
  } catch (error) {
    console.error("Create share link error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/share - Delete a share link
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const shareLinkId = searchParams.get("id");

    if (!shareLinkId) {
      return NextResponse.json(
        { message: "Share link ID required" },
        { status: 400 }
      );
    }

    const shareLink = await prisma.shareLink.findUnique({
      where: { id: shareLinkId },
    });

    if (!shareLink || shareLink.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Share link not found" },
        { status: 404 }
      );
    }

    await prisma.shareLink.delete({ where: { id: shareLinkId } });

    return NextResponse.json({ message: "Share link deleted" });
  } catch (error) {
    console.error("Delete share link error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
