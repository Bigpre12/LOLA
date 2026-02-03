// Bundle export utilities for organizing outputs by platform/group

export interface OutputAsset {
  stepId: string;
  url: string;
  meta?: {
    prompt?: string;
    group?: string;
    variant?: string;
    label?: string;
  };
}

export interface BundleGroup {
  name: string;
  folder: string;
  assets: {
    filename: string;
    url: string;
    variant?: string;
  }[];
}

// Platform-specific naming conventions
const platformNames: Record<string, { folder: string; prefix: string }> = {
  "Amazon Gallery": { folder: "01_Amazon", prefix: "amazon" },
  "Lifestyle": { folder: "02_Lifestyle", prefix: "lifestyle" },
  "Social Ads": { folder: "03_Social_Ads", prefix: "ad" },
  "Thumbnails": { folder: "04_Thumbnails", prefix: "thumb" },
  "Platform Crops": { folder: "05_Platform_Crops", prefix: "crop" },
};

// Generate clean filename from step ID and variant
function generateFilename(stepId: string, variant?: string, index?: number): string {
  // Clean up step ID for filename
  const base = stepId
    .replace(/_/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "");
  
  const parts = [base];
  if (variant) parts.push(`variant-${variant}`);
  if (index !== undefined) parts.push(`${index + 1}`);
  
  return `${parts.join("_")}.jpg`;
}

// Organize outputs into platform-specific bundles
export function organizeIntoBundles(
  outputs: OutputAsset[],
  productName: string
): BundleGroup[] {
  const groups: Map<string, BundleGroup> = new Map();
  
  // Create slug from product name
  const productSlug = productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 30);

  for (const output of outputs) {
    const groupName = output.meta?.group || "Other";
    const platform = platformNames[groupName] || { folder: "99_Other", prefix: "output" };
    
    if (!groups.has(groupName)) {
      groups.set(groupName, {
        name: groupName,
        folder: `${productSlug}/${platform.folder}`,
        assets: [],
      });
    }

    const group = groups.get(groupName)!;
    const filename = generateFilename(
      output.stepId,
      output.meta?.variant,
      group.assets.length
    );

    group.assets.push({
      filename,
      url: output.url,
      variant: output.meta?.variant,
    });
  }

  // Sort groups by folder name
  return Array.from(groups.values()).sort((a, b) => 
    a.folder.localeCompare(b.folder)
  );
}

// Generate manifest for the bundle
export function generateManifest(
  bundles: BundleGroup[],
  productName: string,
  runId: string
): string {
  const totalAssets = bundles.reduce((sum, g) => sum + g.assets.length, 0);
  const variantA = bundles.reduce(
    (sum, g) => sum + g.assets.filter(a => a.variant === "A").length, 0
  );
  const variantB = bundles.reduce(
    (sum, g) => sum + g.assets.filter(a => a.variant === "B").length, 0
  );

  let manifest = `# LOLA Asset Bundle
# Generated: ${new Date().toISOString()}
# Run ID: ${runId}
# Product: ${productName}

## Summary
- Total Assets: ${totalAssets}
- Variant A: ${variantA}
- Variant B: ${variantB}

## Contents
`;

  for (const bundle of bundles) {
    manifest += `\n### ${bundle.name} (${bundle.assets.length} files)\n`;
    manifest += `Folder: ${bundle.folder}/\n`;
    for (const asset of bundle.assets) {
      const variantTag = asset.variant ? ` [${asset.variant}]` : "";
      manifest += `  - ${asset.filename}${variantTag}\n`;
    }
  }

  manifest += `
## A/B Testing Guide
- Variant A: Primary/safe creative direction
- Variant B: Alternative/experimental direction
- Drop both into your A/B test platform to compare performance

## Platform Guide
- 01_Amazon: Use for Amazon product listings (main + gallery)
- 02_Lifestyle: Use for website hero, social organic, PR
- 03_Social_Ads: Ready for Facebook/Instagram/TikTok ad manager
- 04_Thumbnails: Optimized for grid/search display
`;

  return manifest;
}

// Generate download URL with platform grouping info
export function getDownloadFilename(
  stepId: string,
  group?: string,
  variant?: string
): string {
  const platform = group ? platformNames[group]?.prefix || "output" : "output";
  const cleanId = stepId.replace(/_/g, "-");
  const variantSuffix = variant ? `-${variant}` : "";
  return `${platform}_${cleanId}${variantSuffix}.jpg`;
}
