import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/share/:shareLinkId/comments - Add a comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shareLinkId: string }> }
) {
  try {
    const { shareLinkId } = await params;
    const body = await request.json();
    const { content, authorName, authorEmail, assetId } = body;

    if (!content || !authorName) {
      return NextResponse.json(
        { message: "Content and author name are required" },
        { status: 400 }
      );
    }

    // Verify share link exists and allows comments
    const shareLink = await prisma.shareLink.findUnique({
      where: { id: shareLinkId },
    });

    if (!shareLink) {
      return NextResponse.json(
        { message: "Share link not found" },
        { status: 404 }
      );
    }

    if (!shareLink.allowComments) {
      return NextResponse.json(
        { message: "Comments are disabled for this share" },
        { status: 403 }
      );
    }

    const comment = await prisma.shareComment.create({
      data: {
        shareLinkId,
        content,
        authorName,
        authorEmail: authorEmail || null,
        assetId: assetId || null,
      },
    });

    return NextResponse.json({ comment });
  } catch (error) {
    console.error("Add comment error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/share/:shareLinkId/comments - List comments
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shareLinkId: string }> }
) {
  try {
    const { shareLinkId } = await params;

    const comments = await prisma.shareComment.findMany({
      where: { shareLinkId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("List comments error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
