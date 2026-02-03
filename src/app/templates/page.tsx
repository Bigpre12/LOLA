import { TemplateGrid } from "@/components/templates";
import { Footer } from "@/components/marketing";
import prisma from "@/lib/prisma";
import { Template } from "@/types";

async function getTemplates(): Promise<Template[]> {
  try {
    const templates = await prisma.template.findMany({
      orderBy: { createdAt: "desc" },
    });
    return templates as unknown as Template[];
  } catch {
    // Return mock templates if DB is not available
    return getMockTemplates();
  }
}

function getMockTemplates(): Template[] {
  return [
    {
      id: "1",
      slug: "product-gallery",
      name: "Product Gallery",
      category: "ECOMMERCE",
      description: "Generate an Amazon-style product gallery from one clean product photo. Perfect for ecommerce listings that need multiple angles and views.",
      inputSchema: {
        fields: [
          { key: "productImage", type: "image", label: "Product Photo", required: true },
          { key: "productDescription", type: "textarea", label: "Product Description", required: true },
        ],
      },
      optionsSchema: {
        fields: [
          { key: "numAngles", type: "slider", label: "Number of angles", default: 4, min: 2, max: 8 },
        ],
      },
      modelPipeline: {
        steps: [
          { id: "base_cleanup", type: "image_generate", promptTemplate: "Professional product photography of {{productDescription}}" },
          { id: "angle_front", type: "image_generate", promptTemplate: "Front view of {{productDescription}}" },
          { id: "angle_side", type: "image_generate", promptTemplate: "Side view of {{productDescription}}" },
          { id: "angle_detail", type: "image_generate", promptTemplate: "Detail close-up of {{productDescription}}" },
        ],
      },
      estimatedCredits: 8,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      slug: "lifestyle-set",
      name: "Lifestyle Set",
      category: "ECOMMERCE",
      description: "Create a lifestyle photography set from a studio product image. Show your product in real-world environments.",
      inputSchema: {
        fields: [
          { key: "productImage", type: "image", label: "Product Photo", required: true },
          { key: "environmentDescription", type: "textarea", label: "Environment Description", required: true },
        ],
      },
      optionsSchema: {
        fields: [
          { key: "numVariants", type: "slider", label: "Number of variants", default: 6, min: 2, max: 10 },
        ],
      },
      modelPipeline: {
        steps: [
          { id: "lifestyle_kitchen", type: "image_generate", promptTemplate: "{{productDescription}} in a modern kitchen setting" },
          { id: "lifestyle_office", type: "image_generate", promptTemplate: "{{productDescription}} in a professional office" },
          { id: "lifestyle_outdoor", type: "image_generate", promptTemplate: "{{productDescription}} in an outdoor setting" },
          { id: "lifestyle_living", type: "image_generate", promptTemplate: "{{productDescription}} in a cozy living room" },
          { id: "lifestyle_studio", type: "image_generate", promptTemplate: "{{productDescription}} in a minimalist studio" },
          { id: "lifestyle_natural", type: "image_generate", promptTemplate: "{{productDescription}} with natural lighting" },
        ],
      },
      estimatedCredits: 12,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      slug: "social-ad-pack",
      name: "Social Ad Pack",
      category: "ADS",
      description: "Generate a multi-format social ad pack from one hero image and tagline. Perfect for running ads across multiple platforms.",
      inputSchema: {
        fields: [
          { key: "heroImage", type: "image", label: "Hero Image", required: true },
          { key: "tagline", type: "text", label: "Tagline", required: true },
          { key: "brandVoice", type: "textarea", label: "Brand Voice", required: false },
        ],
      },
      optionsSchema: {
        fields: [
          { key: "numVariants", type: "slider", label: "Number of variants", default: 5, min: 3, max: 10 },
        ],
      },
      modelPipeline: {
        steps: [
          { id: "instagram_square", type: "image_generate", promptTemplate: "Instagram square ad: {{tagline}}" },
          { id: "story_vertical", type: "image_generate", promptTemplate: "Instagram/TikTok story: {{tagline}}" },
          { id: "facebook_landscape", type: "image_generate", promptTemplate: "Facebook landscape ad: {{tagline}}" },
          { id: "tiktok_vertical", type: "image_generate", promptTemplate: "TikTok vertical ad: {{tagline}}" },
          { id: "twitter_banner", type: "image_generate", promptTemplate: "Twitter banner: {{tagline}}" },
        ],
      },
      estimatedCredits: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}

export default async function TemplatesPage() {
  const templates = await getTemplates();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Templates</h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Choose from our library of pre-built templates. Each one encapsulates a multi-step
            AI pipeline tuned for specific outcomes.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TemplateGrid templates={templates} />
      </div>

      <Footer />
    </div>
  );
}
