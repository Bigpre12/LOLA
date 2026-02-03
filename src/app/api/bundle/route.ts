import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { organizeIntoBundles, generateManifest, OutputAsset } from "@/lib/bundle-export";
import JSZip from "jszip";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const runId = searchParams.get("runId");

    if (!runId) {
      return NextResponse.json({ message: "Run ID required" }, { status: 400 });
    }

    // Get run with outputs
    const run = await prisma.run.findUnique({
      where: { id: runId },
      include: {
        template: { select: { name: true, modelPipeline: true } },
      },
    });

    if (!run) {
      return NextResponse.json({ message: "Run not found" }, { status: 404 });
    }

    if (run.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    if (run.status !== "COMPLETED" || !run.outputs) {
      return NextResponse.json(
        { message: "Run not completed or has no outputs" },
        { status: 400 }
      );
    }

    // Get product name from inputs
    const inputs = run.inputs as Record<string, unknown>;
    const productName = (inputs.productName as string) || 
                       (inputs.productDescription as string)?.slice(0, 30) || 
                       "product";

    // Get pipeline steps to extract group/variant info
    const pipeline = run.template.modelPipeline as { steps: Array<{ id: string; group?: string; variant?: string; label?: string }> };
    const stepMeta = new Map(
      pipeline.steps.map(s => [s.id, { group: s.group, variant: s.variant, label: s.label }])
    );

    // Enhance outputs with metadata
    const outputs = (run.outputs as Array<{ stepId: string; url: string; meta?: Record<string, unknown> }>).map(o => ({
      ...o,
      meta: {
        ...o.meta,
        ...stepMeta.get(o.stepId),
      },
    })) as OutputAsset[];

    // Organize into bundles
    const bundles = organizeIntoBundles(outputs, productName);

    // Create zip file
    const zip = new JSZip();

    // Add manifest
    const manifest = generateManifest(bundles, productName, runId);
    zip.file("README.md", manifest);

    // Add each bundle folder with images
    for (const bundle of bundles) {
      const folder = zip.folder(bundle.folder);
      if (!folder) continue;

      for (const asset of bundle.assets) {
        try {
          // Fetch image
          const response = await fetch(asset.url);
          if (response.ok) {
            const buffer = await response.arrayBuffer();
            folder.file(asset.filename, buffer);
          }
        } catch (error) {
          console.error(`Failed to fetch ${asset.url}:`, error);
        }
      }
    }

    // Generate zip
    const zipBuffer = await zip.generateAsync({ type: "arraybuffer" });

    // Return zip file
    const filename = `flowforge_${productName.replace(/[^a-z0-9]/gi, "-")}_${runId.slice(0, 8)}.zip`;

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Bundle export error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
