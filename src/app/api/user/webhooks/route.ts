import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

// GET /api/user/webhooks - List user's webhooks
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const webhooks = await prisma.webhook.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        url: true,
        events: true,
        isActive: true,
        lastError: true,
        lastTriggeredAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ webhooks });
  } catch (error) {
    console.error("List webhooks error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/user/webhooks - Create a new webhook
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
        { message: "Webhooks require Pro plan or higher" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, url, events = ["run.completed", "run.failed"] } = body;

    if (!name || !url) {
      return NextResponse.json(
        { message: "Name and URL are required" },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { message: "Invalid webhook URL" },
        { status: 400 }
      );
    }

    // Generate secret for signature verification
    const secret = crypto.randomBytes(32).toString("hex");

    const webhook = await prisma.webhook.create({
      data: {
        userId: session.user.id,
        name,
        url,
        secret,
        events,
      },
      select: {
        id: true,
        name: true,
        url: true,
        secret: true,
        events: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      webhook,
      message: "Webhook created. Store the secret securely for signature verification.",
    });
  } catch (error) {
    console.error("Create webhook error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/user/webhooks - Update a webhook
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, url, events, isActive } = body;

    if (!id) {
      return NextResponse.json({ message: "Webhook ID required" }, { status: 400 });
    }

    const webhook = await prisma.webhook.findUnique({
      where: { id },
    });

    if (!webhook || webhook.userId !== session.user.id) {
      return NextResponse.json({ message: "Webhook not found" }, { status: 404 });
    }

    const updated = await prisma.webhook.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(url && { url }),
        ...(events && { events }),
        ...(isActive !== undefined && { isActive }),
      },
      select: {
        id: true,
        name: true,
        url: true,
        events: true,
        isActive: true,
      },
    });

    return NextResponse.json({ webhook: updated });
  } catch (error) {
    console.error("Update webhook error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/user/webhooks - Delete a webhook
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const webhookId = searchParams.get("id");

    if (!webhookId) {
      return NextResponse.json({ message: "Webhook ID required" }, { status: 400 });
    }

    const webhook = await prisma.webhook.findUnique({
      where: { id: webhookId },
    });

    if (!webhook || webhook.userId !== session.user.id) {
      return NextResponse.json({ message: "Webhook not found" }, { status: 404 });
    }

    await prisma.webhook.delete({ where: { id: webhookId } });

    return NextResponse.json({ message: "Webhook deleted" });
  } catch (error) {
    console.error("Delete webhook error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
