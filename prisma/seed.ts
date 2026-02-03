import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const templates = [
  // ============================================
  // FLAGSHIP: FULL ASSET ENGINE
  // The "kill shot" - 1 photo → 20+ assets
  // ============================================
  {
    slug: "full-asset-engine",
    name: "Full Asset Engine",
    category: "ECOMMERCE" as const,
    description:
      "The ultimate one-click asset generator. From 1 product photo → full Amazon gallery, lifestyle shots, social ads, thumbnails, and all platform crops. 20+ ready-to-use assets.",
    inputSchema: {
      fields: [
        { key: "productImage", type: "image", label: "Product Photo", required: true },
        { key: "productName", type: "text", label: "Product Name", required: true, placeholder: "Premium Wireless Earbuds" },
        { key: "productDescription", type: "textarea", label: "Product Description", required: true, placeholder: "Premium wireless earbuds with active noise cancellation, 40-hour battery, and IPX5 water resistance" },
        { key: "keyFeatures", type: "textarea", label: "Key Features (one per line)", required: false, placeholder: "40-hour battery life\nActive noise cancellation\nIPX5 water resistant" },
        { key: "tagline", type: "text", label: "Tagline (for ads)", required: false, placeholder: "Hear everything. Miss nothing." },
      ],
    },
    optionsSchema: {
      fields: [
        { key: "style", type: "select", label: "Overall Style", default: "modern", options: [
          { value: "modern", label: "Modern & Clean" },
          { value: "premium", label: "Premium & Luxurious" },
          { value: "bold", label: "Bold & Vibrant" },
          { value: "minimal", label: "Minimalist" },
        ]},
        { key: "mood", type: "select", label: "Lifestyle Mood", default: "warm", options: [
          { value: "warm", label: "Warm & Cozy" },
          { value: "energetic", label: "Energetic & Dynamic" },
          { value: "calm", label: "Calm & Peaceful" },
          { value: "urban", label: "Urban & Trendy" },
        ]},
      ],
    },
    modelPipeline: {
      steps: [
        // === AMAZON GALLERY (5 images) ===
        { id: "amazon_main", type: "image_generate", model: "fal", label: "Amazon Main", group: "Amazon Gallery", variant: "A", promptTemplate: "Amazon main product image of {{productName}}, {{productDescription}}, pure white background, centered, professional product photography, high resolution, no text or graphics, ecommerce ready" },
        { id: "amazon_angle", type: "image_generate", model: "fal", label: "Amazon 45° Angle", group: "Amazon Gallery", variant: "A", promptTemplate: "Amazon product image 45 degree angle of {{productName}}, {{productDescription}}, clean white background, professional studio lighting, ecommerce photography" },
        { id: "amazon_detail", type: "image_generate", model: "fal", label: "Amazon Detail", group: "Amazon Gallery", variant: "A", promptTemplate: "Amazon product detail close-up of {{productName}}, macro photography showing quality and craftsmanship, white background, professional lighting" },
        { id: "amazon_lifestyle", type: "image_generate", model: "fal", label: "Amazon Lifestyle", group: "Amazon Gallery", variant: "A", promptTemplate: "Amazon lifestyle product image of {{productName}} being used naturally, aspirational setting, professional photography, high quality" },
        { id: "amazon_scale", type: "image_generate", model: "fal", label: "Amazon Scale", group: "Amazon Gallery", variant: "A", promptTemplate: "Amazon product scale reference image of {{productName}}, product next to common object for size comparison, white background, professional photography" },
        
        // === LIFESTYLE SET (6 images) ===
        { id: "lifestyle_kitchen", type: "image_generate", model: "fal", label: "Kitchen Scene", group: "Lifestyle", variant: "A", promptTemplate: "{{productName}} in a modern {{mood}} kitchen setting, natural morning light, lifestyle photography, aspirational home environment, product clearly visible" },
        { id: "lifestyle_office", type: "image_generate", model: "fal", label: "Office Scene", group: "Lifestyle", variant: "A", promptTemplate: "{{productName}} on a stylish modern desk in home office, natural lighting, {{mood}} atmosphere, lifestyle photography, professional yet personal" },
        { id: "lifestyle_outdoor", type: "image_generate", model: "fal", label: "Outdoor Scene", group: "Lifestyle", variant: "A", promptTemplate: "{{productName}} in outdoor patio or garden setting, golden hour lighting, {{mood}} atmosphere, lifestyle photography, relaxed aspirational feel" },
        { id: "lifestyle_living", type: "image_generate", model: "fal", label: "Living Room", group: "Lifestyle", variant: "A", promptTemplate: "{{productName}} in a beautiful living room, soft natural light, {{mood}} atmosphere, lifestyle photography, comfortable aspirational setting" },
        { id: "lifestyle_urban", type: "image_generate", model: "fal", label: "Urban Scene", group: "Lifestyle", variant: "B", promptTemplate: "{{productName}} in urban cafe or street setting, lifestyle photography, {{mood}} atmosphere, trendy and modern environment" },
        { id: "lifestyle_travel", type: "image_generate", model: "fal", label: "Travel Scene", group: "Lifestyle", variant: "B", promptTemplate: "{{productName}} in travel context, airport lounge or hotel room, lifestyle photography, {{mood}} atmosphere, aspirational travel vibes" },
        
        // === SOCIAL ADS (5 images) ===
        { id: "ad_instagram_feed", type: "image_generate", model: "fal", label: "Instagram Feed", group: "Social Ads", variant: "A", promptTemplate: "Instagram feed advertisement for {{productName}}, {{style}} style, {{tagline}}, square format, scroll-stopping design, professional ad creative, clean and engaging" },
        { id: "ad_instagram_story", type: "image_generate", model: "fal", label: "Instagram Story", group: "Social Ads", variant: "A", promptTemplate: "Instagram story advertisement for {{productName}}, {{style}} style, {{tagline}}, vertical 9:16 format, mobile-first design, engaging and dynamic" },
        { id: "ad_facebook", type: "image_generate", model: "fal", label: "Facebook Feed", group: "Social Ads", variant: "A", promptTemplate: "Facebook feed advertisement for {{productName}}, {{style}} style, {{tagline}}, 4:5 ratio, high engagement design, professional ad creative" },
        { id: "ad_tiktok", type: "image_generate", model: "fal", label: "TikTok Cover", group: "Social Ads", variant: "B", promptTemplate: "TikTok style advertisement thumbnail for {{productName}}, {{style}} style, {{tagline}}, vertical format, Gen-Z appeal, trendy and eye-catching" },
        { id: "ad_twitter", type: "image_generate", model: "fal", label: "Twitter/X Banner", group: "Social Ads", variant: "B", promptTemplate: "Twitter/X advertisement banner for {{productName}}, {{style}} style, {{tagline}}, landscape 16:9 format, clean professional design" },
        
        // === THUMBNAILS (4 images) ===
        { id: "thumb_hero", type: "image_generate", model: "fal", label: "Hero Thumbnail", group: "Thumbnails", variant: "A", promptTemplate: "Eye-catching product thumbnail of {{productName}}, {{style}} style, optimized for small display, high contrast, product centered, square format, scroll-stopping" },
        { id: "thumb_angle", type: "image_generate", model: "fal", label: "Angled Thumbnail", group: "Thumbnails", variant: "A", promptTemplate: "Dynamic angle product thumbnail of {{productName}}, {{style}} style, three-quarter view, attention-grabbing composition, square format" },
        { id: "thumb_lifestyle", type: "image_generate", model: "fal", label: "Lifestyle Thumbnail", group: "Thumbnails", variant: "B", promptTemplate: "Lifestyle context product thumbnail of {{productName}}, {{style}} style, product in use, aspirational feel, square format" },
        { id: "thumb_detail", type: "image_generate", model: "fal", label: "Detail Thumbnail", group: "Thumbnails", variant: "B", promptTemplate: "Detail-focused product thumbnail of {{productName}}, {{style}} style, showing key feature, macro style, square format" },
      ],
    },
    estimatedCredits: 40,
    costPerRun: 2.00,
    avgRating: 4.9,
    totalRuns: 0,
  },

  // ============================================
  // ECOMMERCE TEMPLATES (Core vertical)
  // ============================================
  {
    slug: "product-gallery",
    name: "Product Gallery",
    category: "ECOMMERCE" as const,
    description:
      "Generate an Amazon-style product gallery from one clean product photo. Get main image + multiple angles ready for marketplace listings.",
    inputSchema: {
      fields: [
        { key: "productImage", type: "image", label: "Product Photo", required: true },
        { key: "productDescription", type: "textarea", label: "Product Description", required: true, placeholder: "Premium wireless headphones with noise cancellation, matte black finish" },
      ],
    },
    optionsSchema: {
      fields: [
        { key: "numAngles", type: "slider", label: "Number of angles", default: 4, min: 2, max: 8 },
        { key: "style", type: "select", label: "Photography Style", default: "studio", options: [
          { value: "studio", label: "Studio White Background" },
          { value: "lifestyle", label: "Lifestyle Context" },
          { value: "dramatic", label: "Dramatic Lighting" },
        ]},
      ],
    },
    modelPipeline: {
      steps: [
        { id: "hero_shot", type: "image_generate", model: "fal", label: "Hero Shot", promptTemplate: "Professional product photography of {{productDescription}}, clean white background, studio lighting, high resolution, commercial photography, centered composition, {{style}} style" },
        { id: "angle_front", type: "image_generate", model: "fal", label: "Front View", promptTemplate: "Front view product photography of {{productDescription}}, clean white background, studio lighting, ecommerce style, sharp focus" },
        { id: "angle_45", type: "image_generate", model: "fal", label: "45° Angle", promptTemplate: "45 degree angle product photography of {{productDescription}}, clean white background, professional studio lighting, commercial quality" },
        { id: "angle_side", type: "image_generate", model: "fal", label: "Side View", promptTemplate: "Side profile product photography of {{productDescription}}, clean white background, studio lighting, detail visible" },
        { id: "detail_closeup", type: "image_generate", model: "fal", label: "Detail Close-up", promptTemplate: "Macro detail close-up product photography of {{productDescription}}, showing texture and craftsmanship, clean white background, studio lighting" },
      ],
    },
    estimatedCredits: 10,
    costPerRun: 0.50,
    avgRating: 4.7,
    totalRuns: 0,
  },
  {
    slug: "lifestyle-set",
    name: "Lifestyle Set",
    category: "ECOMMERCE" as const,
    description:
      "Transform a studio product shot into lifestyle photography. Show your product in real-world environments that resonate with customers.",
    inputSchema: {
      fields: [
        { key: "productImage", type: "image", label: "Product Photo", required: true },
        { key: "productDescription", type: "textarea", label: "Product Description", required: true, placeholder: "Minimalist ceramic coffee mug, matte white finish" },
        { key: "targetAudience", type: "text", label: "Target Audience", required: false, placeholder: "Young professionals, coffee enthusiasts" },
      ],
    },
    optionsSchema: {
      fields: [
        { key: "numVariants", type: "slider", label: "Number of lifestyle shots", default: 6, min: 3, max: 10 },
        { key: "mood", type: "select", label: "Mood", default: "warm", options: [
          { value: "warm", label: "Warm & Cozy" },
          { value: "modern", label: "Modern & Clean" },
          { value: "natural", label: "Natural & Organic" },
          { value: "luxury", label: "Premium & Luxurious" },
        ]},
      ],
    },
    modelPipeline: {
      steps: [
        { id: "lifestyle_kitchen", type: "image_generate", model: "fal", label: "Modern Kitchen", promptTemplate: "{{productDescription}} photographed in a modern minimalist kitchen, natural morning light, lifestyle photography, {{mood}} atmosphere, aspirational setting" },
        { id: "lifestyle_office", type: "image_generate", model: "fal", label: "Home Office", promptTemplate: "{{productDescription}} on a clean modern desk in a home office, natural lighting, lifestyle photography, {{mood}} atmosphere, professional but personal" },
        { id: "lifestyle_outdoor", type: "image_generate", model: "fal", label: "Outdoor Patio", promptTemplate: "{{productDescription}} in an outdoor patio setting, golden hour lighting, lifestyle photography, {{mood}} atmosphere, relaxed and inviting" },
        { id: "lifestyle_living", type: "image_generate", model: "fal", label: "Living Room", promptTemplate: "{{productDescription}} in a stylish living room, soft natural light, lifestyle photography, {{mood}} atmosphere, comfortable and aspirational" },
        { id: "lifestyle_bedroom", type: "image_generate", model: "fal", label: "Bedroom", promptTemplate: "{{productDescription}} in a cozy bedroom setting, soft morning light, lifestyle photography, {{mood}} atmosphere, peaceful and inviting" },
        { id: "lifestyle_cafe", type: "image_generate", model: "fal", label: "Café Setting", promptTemplate: "{{productDescription}} in a trendy café environment, ambient lighting, lifestyle photography, {{mood}} atmosphere, urban and stylish" },
      ],
    },
    estimatedCredits: 12,
    costPerRun: 0.60,
    avgRating: 4.8,
    totalRuns: 0,
  },
  {
    slug: "amazon-listing-pack",
    name: "Amazon Listing Pack",
    category: "ECOMMERCE" as const,
    description:
      "Complete Amazon-optimized image set: main image, infographics, lifestyle, and comparison shots. Everything you need for a high-converting listing.",
    inputSchema: {
      fields: [
        { key: "productImage", type: "image", label: "Product Photo", required: true },
        { key: "productName", type: "text", label: "Product Name", required: true, placeholder: "Premium Wireless Earbuds" },
        { key: "keyFeatures", type: "textarea", label: "Key Features (one per line)", required: true, placeholder: "40-hour battery life\nActive noise cancellation\nIPX5 water resistant" },
        { key: "productDescription", type: "textarea", label: "Product Description", required: true },
      ],
    },
    optionsSchema: {
      fields: [
        { key: "includeInfographics", type: "checkbox", label: "Include infographic-style images", default: true },
        { key: "includeLifestyle", type: "checkbox", label: "Include lifestyle images", default: true },
      ],
    },
    modelPipeline: {
      steps: [
        { id: "main_image", type: "image_generate", model: "fal", label: "Main Image (White BG)", promptTemplate: "Amazon main product image of {{productName}}, {{productDescription}}, pure white background, centered, professional product photography, high resolution, no text or graphics" },
        { id: "infographic_features", type: "image_generate", model: "fal", label: "Features Showcase", promptTemplate: "Product showcase of {{productName}} highlighting features: {{keyFeatures}}, clean infographic style, professional product photography, feature callouts visible" },
        { id: "lifestyle_use", type: "image_generate", model: "fal", label: "In-Use Lifestyle", promptTemplate: "{{productName}} being used in real life scenario, lifestyle photography, natural lighting, aspirational setting, person using the product naturally" },
        { id: "scale_reference", type: "image_generate", model: "fal", label: "Size Reference", promptTemplate: "{{productName}} shown with scale reference, product next to common object for size comparison, clean white background, professional photography" },
        { id: "packaging", type: "image_generate", model: "fal", label: "Package Contents", promptTemplate: "{{productName}} unboxed showing all package contents, accessories laid out neatly, clean white background, what's in the box style" },
        { id: "detail_quality", type: "image_generate", model: "fal", label: "Quality Detail", promptTemplate: "Extreme close-up of {{productName}} showing build quality and materials, macro photography, premium craftsmanship visible" },
        { id: "lifestyle_context", type: "image_generate", model: "fal", label: "Lifestyle Context", promptTemplate: "{{productName}} in aspirational lifestyle setting, beautiful environment, natural lighting, brand-building imagery" },
      ],
    },
    estimatedCredits: 14,
    costPerRun: 0.70,
    avgRating: 4.9,
    totalRuns: 0,
  },
  {
    slug: "product-thumbnails",
    name: "Product Thumbnails",
    category: "ECOMMERCE" as const,
    description:
      "Generate scroll-stopping thumbnails optimized for marketplace grids, search results, and category pages. Stand out in crowded listings.",
    inputSchema: {
      fields: [
        { key: "productImage", type: "image", label: "Product Photo", required: true },
        { key: "productDescription", type: "textarea", label: "Product Description", required: true },
      ],
    },
    optionsSchema: {
      fields: [
        { key: "numVariants", type: "slider", label: "Number of variants", default: 4, min: 2, max: 8 },
        { key: "emphasis", type: "select", label: "Emphasis Style", default: "clean", options: [
          { value: "clean", label: "Clean & Minimal" },
          { value: "bold", label: "Bold & Eye-catching" },
          { value: "premium", label: "Premium & Luxurious" },
        ]},
      ],
    },
    modelPipeline: {
      steps: [
        { id: "thumb_hero", type: "image_generate", model: "fal", label: "Hero Thumbnail", promptTemplate: "Eye-catching product thumbnail of {{productDescription}}, {{emphasis}} style, optimized for small display, high contrast, clear product visibility, square format" },
        { id: "thumb_angle", type: "image_generate", model: "fal", label: "Angled Thumbnail", promptTemplate: "Dynamic angle product thumbnail of {{productDescription}}, {{emphasis}} style, three-quarter view, attention-grabbing, square format" },
        { id: "thumb_lifestyle", type: "image_generate", model: "fal", label: "Lifestyle Thumbnail", promptTemplate: "Lifestyle context product thumbnail of {{productDescription}}, {{emphasis}} style, product in use, aspirational, square format" },
        { id: "thumb_detail", type: "image_generate", model: "fal", label: "Detail Thumbnail", promptTemplate: "Detail-focused product thumbnail of {{productDescription}}, {{emphasis}} style, showing key feature, macro style, square format" },
      ],
    },
    estimatedCredits: 8,
    costPerRun: 0.40,
    avgRating: 4.5,
    totalRuns: 0,
  },
  {
    slug: "platform-crops",
    name: "Platform-Ready Crops",
    category: "ECOMMERCE" as const,
    description:
      "One product photo → perfectly cropped versions for every platform: Amazon, Shopify, Instagram Shop, Pinterest, and more.",
    inputSchema: {
      fields: [
        { key: "productImage", type: "image", label: "Product Photo", required: true },
        { key: "productDescription", type: "textarea", label: "Product Description", required: true },
      ],
    },
    optionsSchema: {
      fields: [
        { key: "platforms", type: "select", label: "Primary Platform", default: "all", options: [
          { value: "all", label: "All Platforms" },
          { value: "amazon", label: "Amazon Focus" },
          { value: "shopify", label: "Shopify Focus" },
          { value: "social", label: "Social Commerce Focus" },
        ]},
      ],
    },
    modelPipeline: {
      steps: [
        { id: "amazon_main", type: "image_generate", model: "fal", label: "Amazon Main (1:1)", promptTemplate: "Amazon optimized product image of {{productDescription}}, square 1:1 ratio, pure white background, centered product, professional photography" },
        { id: "shopify_hero", type: "image_generate", model: "fal", label: "Shopify Hero (4:5)", promptTemplate: "Shopify hero product image of {{productDescription}}, 4:5 portrait ratio, clean background, professional product photography" },
        { id: "instagram_square", type: "image_generate", model: "fal", label: "Instagram Shop (1:1)", promptTemplate: "Instagram shop product image of {{productDescription}}, square format, lifestyle-influenced, clean and aspirational" },
        { id: "pinterest_pin", type: "image_generate", model: "fal", label: "Pinterest Pin (2:3)", promptTemplate: "Pinterest-optimized product image of {{productDescription}}, 2:3 vertical ratio, eye-catching, shareable style" },
        { id: "facebook_catalog", type: "image_generate", model: "fal", label: "Facebook Catalog (1:1)", promptTemplate: "Facebook catalog product image of {{productDescription}}, square format, clean white background, high clarity" },
      ],
    },
    estimatedCredits: 10,
    costPerRun: 0.50,
    avgRating: 4.6,
    totalRuns: 0,
  },

  // ============================================
  // ADS TEMPLATES (Core vertical)
  // ============================================
  {
    slug: "social-ad-pack",
    name: "Social Ad Pack",
    category: "ADS" as const,
    description:
      "Generate a complete multi-format ad pack from one hero image. Get Instagram, Facebook, TikTok, and Twitter-ready creatives in one run.",
    inputSchema: {
      fields: [
        { key: "heroImage", type: "image", label: "Hero Image", required: true },
        { key: "tagline", type: "text", label: "Tagline", required: true, placeholder: "Sleep better. Live better." },
        { key: "brandVoice", type: "textarea", label: "Brand Voice & Style", required: false, placeholder: "Modern, playful, premium feel" },
      ],
    },
    optionsSchema: {
      fields: [
        { key: "numVariants", type: "slider", label: "Variants per format", default: 2, min: 1, max: 4 },
        { key: "style", type: "select", label: "Visual Style", default: "modern", options: [
          { value: "modern", label: "Modern & Clean" },
          { value: "bold", label: "Bold & Vibrant" },
          { value: "minimal", label: "Minimalist" },
          { value: "premium", label: "Premium & Luxurious" },
        ]},
      ],
    },
    modelPipeline: {
      steps: [
        { id: "instagram_feed", type: "image_generate", model: "fal", label: "Instagram Feed (1:1)", promptTemplate: "Instagram feed advertisement, {{style}} style, {{tagline}}, {{brandVoice}}, square format, scroll-stopping design, professional ad creative" },
        { id: "instagram_story", type: "image_generate", model: "fal", label: "Instagram Story (9:16)", promptTemplate: "Instagram story advertisement, {{style}} style, {{tagline}}, {{brandVoice}}, vertical 9:16 format, mobile-first design, engaging visual" },
        { id: "facebook_feed", type: "image_generate", model: "fal", label: "Facebook Feed (4:5)", promptTemplate: "Facebook feed advertisement, {{style}} style, {{tagline}}, {{brandVoice}}, 4:5 ratio, high engagement design, professional ad creative" },
        { id: "tiktok_vertical", type: "image_generate", model: "fal", label: "TikTok (9:16)", promptTemplate: "TikTok style advertisement, {{style}} style, {{tagline}}, {{brandVoice}}, vertical 9:16 format, Gen-Z appeal, trendy and dynamic" },
        { id: "twitter_landscape", type: "image_generate", model: "fal", label: "Twitter/X (16:9)", promptTemplate: "Twitter/X advertisement banner, {{style}} style, {{tagline}}, {{brandVoice}}, landscape 16:9 format, clean professional design" },
      ],
    },
    estimatedCredits: 10,
    costPerRun: 0.50,
    avgRating: 4.7,
    totalRuns: 0,
  },
  {
    slug: "video-ad-stills",
    name: "Video Ad Stills & Hooks",
    category: "ADS" as const,
    description:
      "Generate scroll-stopping thumbnail stills and hook frames for your video ads. Perfect for TikTok, Reels, and YouTube Shorts.",
    inputSchema: {
      fields: [
        { key: "productImage", type: "image", label: "Product/Brand Image", required: true },
        { key: "hook", type: "text", label: "Hook/Opening Line", required: true, placeholder: "Wait until you see this..." },
        { key: "offer", type: "text", label: "Offer/CTA", required: false, placeholder: "50% off today only" },
        { key: "brandDescription", type: "textarea", label: "Brand/Product Description", required: true },
      ],
    },
    optionsSchema: {
      fields: [
        { key: "numHooks", type: "slider", label: "Number of hook variants", default: 4, min: 2, max: 8 },
        { key: "energy", type: "select", label: "Energy Level", default: "high", options: [
          { value: "high", label: "High Energy / Urgent" },
          { value: "medium", label: "Medium / Engaging" },
          { value: "calm", label: "Calm / Trust-building" },
        ]},
      ],
    },
    modelPipeline: {
      steps: [
        { id: "hook_curiosity", type: "image_generate", model: "fal", label: "Curiosity Hook", promptTemplate: "Video ad thumbnail, curiosity-driven hook style, {{hook}}, {{brandDescription}}, {{energy}} energy, scroll-stopping, vertical format, social media optimized" },
        { id: "hook_problem", type: "image_generate", model: "fal", label: "Problem Hook", promptTemplate: "Video ad thumbnail, problem-aware hook style, relatable pain point, {{brandDescription}}, {{energy}} energy, empathetic visual, vertical format" },
        { id: "hook_result", type: "image_generate", model: "fal", label: "Result Hook", promptTemplate: "Video ad thumbnail, transformation/result hook style, before-after implication, {{brandDescription}}, {{energy}} energy, aspirational, vertical format" },
        { id: "hook_social", type: "image_generate", model: "fal", label: "Social Proof Hook", promptTemplate: "Video ad thumbnail, social proof hook style, testimonial feel, {{brandDescription}}, {{energy}} energy, trustworthy, vertical format" },
        { id: "cta_frame", type: "image_generate", model: "fal", label: "CTA End Frame", promptTemplate: "Video ad end frame, clear call-to-action, {{offer}}, {{brandDescription}}, {{energy}} energy, action-driving design, vertical format" },
      ],
    },
    estimatedCredits: 10,
    costPerRun: 0.50,
    avgRating: 4.6,
    totalRuns: 0,
  },
  {
    slug: "retargeting-ads",
    name: "Retargeting Ad Set",
    category: "ADS" as const,
    description:
      "Create a sequence of retargeting ads: awareness, consideration, and conversion stages. Perfect for DPA and remarketing campaigns.",
    inputSchema: {
      fields: [
        { key: "productImage", type: "image", label: "Product Image", required: true },
        { key: "productName", type: "text", label: "Product Name", required: true },
        { key: "valueProps", type: "textarea", label: "Value Propositions", required: true, placeholder: "Free shipping\n30-day returns\n5-star reviews" },
        { key: "urgency", type: "text", label: "Urgency Message", required: false, placeholder: "Limited stock" },
      ],
    },
    optionsSchema: {
      fields: [
        { key: "style", type: "select", label: "Brand Style", default: "professional", options: [
          { value: "professional", label: "Professional" },
          { value: "friendly", label: "Friendly & Warm" },
          { value: "urgent", label: "Urgency-focused" },
        ]},
      ],
    },
    modelPipeline: {
      steps: [
        { id: "awareness", type: "image_generate", model: "fal", label: "Awareness Stage", promptTemplate: "Retargeting ad for awareness stage, {{productName}}, {{style}} style, introducing product benefits, professional ad creative, clean design" },
        { id: "consideration", type: "image_generate", model: "fal", label: "Consideration Stage", promptTemplate: "Retargeting ad for consideration stage, {{productName}}, {{style}} style, highlighting {{valueProps}}, building trust, professional ad creative" },
        { id: "conversion_soft", type: "image_generate", model: "fal", label: "Soft Conversion", promptTemplate: "Retargeting ad for conversion, {{productName}}, {{style}} style, gentle call-to-action, value-focused, professional ad creative" },
        { id: "conversion_urgent", type: "image_generate", model: "fal", label: "Urgent Conversion", promptTemplate: "Retargeting ad with urgency, {{productName}}, {{urgency}}, limited time feel, {{style}} style, action-driving design" },
        { id: "cart_abandon", type: "image_generate", model: "fal", label: "Cart Abandonment", promptTemplate: "Cart abandonment retargeting ad, {{productName}}, 'Still thinking about it?' style, {{valueProps}}, persuasive but not pushy" },
      ],
    },
    estimatedCredits: 10,
    costPerRun: 0.50,
    avgRating: 4.5,
    totalRuns: 0,
  },
  {
    slug: "ugc-style-ads",
    name: "UGC-Style Ad Pack",
    category: "ADS" as const,
    description:
      "Generate authentic-looking UGC (user-generated content) style ad creatives. Perfect for social proof and native-feeling ads.",
    inputSchema: {
      fields: [
        { key: "productImage", type: "image", label: "Product Image", required: true },
        { key: "productDescription", type: "textarea", label: "Product Description", required: true },
        { key: "testimonialTheme", type: "text", label: "Testimonial Theme", required: false, placeholder: "This changed my morning routine" },
      ],
    },
    optionsSchema: {
      fields: [
        { key: "numVariants", type: "slider", label: "Number of UGC variants", default: 4, min: 2, max: 8 },
        { key: "demographic", type: "select", label: "Target Demographic", default: "general", options: [
          { value: "general", label: "General Audience" },
          { value: "young", label: "Young Adults (18-30)" },
          { value: "professional", label: "Professionals (30-50)" },
          { value: "parent", label: "Parents" },
        ]},
      ],
    },
    modelPipeline: {
      steps: [
        { id: "ugc_unboxing", type: "image_generate", model: "fal", label: "Unboxing Moment", promptTemplate: "UGC style unboxing photo of {{productDescription}}, authentic smartphone photography look, {{demographic}} demographic, excited discovery moment, natural lighting, raw authentic feel" },
        { id: "ugc_inuse", type: "image_generate", model: "fal", label: "Product In-Use", promptTemplate: "UGC style photo of person using {{productDescription}}, authentic casual photography, {{demographic}} demographic, natural moment, relatable, smartphone quality aesthetic" },
        { id: "ugc_selfie", type: "image_generate", model: "fal", label: "Happy Customer Selfie", promptTemplate: "UGC style selfie with {{productDescription}}, authentic happy customer feel, {{demographic}} demographic, genuine smile, natural lighting, social media authentic" },
        { id: "ugc_flatlay", type: "image_generate", model: "fal", label: "Casual Flat Lay", promptTemplate: "UGC style flat lay featuring {{productDescription}}, authentic lifestyle shot, {{demographic}} demographic, casual arrangement, natural home setting" },
        { id: "ugc_review", type: "image_generate", model: "fal", label: "Review Style", promptTemplate: "UGC style product review photo of {{productDescription}}, {{testimonialTheme}}, authentic testimonial feel, {{demographic}} demographic, trustworthy and relatable" },
      ],
    },
    estimatedCredits: 10,
    costPerRun: 0.50,
    avgRating: 4.8,
    totalRuns: 0,
  },

  // ============================================
  // BRAND TEMPLATES
  // ============================================
  {
    slug: "brand-asset-pack",
    name: "Brand Asset Pack",
    category: "BRAND" as const,
    description:
      "From one logo and brand description → consistent visual assets: social headers, email banners, presentation backgrounds, and more.",
    inputSchema: {
      fields: [
        { key: "logoImage", type: "image", label: "Logo/Brand Mark", required: true },
        { key: "brandName", type: "text", label: "Brand Name", required: true },
        { key: "brandDescription", type: "textarea", label: "Brand Description & Values", required: true, placeholder: "Modern sustainable fashion brand focused on minimalist design and eco-friendly materials" },
        { key: "colorPalette", type: "text", label: "Brand Colors", required: false, placeholder: "Navy blue, cream, gold accents" },
      ],
    },
    optionsSchema: {
      fields: [
        { key: "style", type: "select", label: "Brand Aesthetic", default: "modern", options: [
          { value: "modern", label: "Modern & Clean" },
          { value: "luxury", label: "Luxury & Premium" },
          { value: "playful", label: "Playful & Friendly" },
          { value: "corporate", label: "Corporate & Professional" },
        ]},
      ],
    },
    modelPipeline: {
      steps: [
        { id: "social_header", type: "image_generate", model: "fal", label: "Social Media Header", promptTemplate: "Social media header/banner for {{brandName}}, {{brandDescription}}, {{style}} aesthetic, {{colorPalette}} colors, professional brand design, wide format" },
        { id: "email_banner", type: "image_generate", model: "fal", label: "Email Banner", promptTemplate: "Email marketing banner for {{brandName}}, {{brandDescription}}, {{style}} aesthetic, {{colorPalette}} colors, clean professional design, horizontal format" },
        { id: "presentation_bg", type: "image_generate", model: "fal", label: "Presentation Background", promptTemplate: "Presentation slide background for {{brandName}}, {{brandDescription}}, {{style}} aesthetic, {{colorPalette}} colors, subtle and professional, supports text overlay" },
        { id: "story_template", type: "image_generate", model: "fal", label: "Story Template BG", promptTemplate: "Instagram story background template for {{brandName}}, {{brandDescription}}, {{style}} aesthetic, {{colorPalette}} colors, vertical format, text-friendly" },
        { id: "profile_bg", type: "image_generate", model: "fal", label: "Profile Background", promptTemplate: "Profile/about section background for {{brandName}}, {{brandDescription}}, {{style}} aesthetic, {{colorPalette}} colors, professional and inviting" },
      ],
    },
    estimatedCredits: 10,
    costPerRun: 0.50,
    avgRating: 4.4,
    totalRuns: 0,
  },
  {
    slug: "seasonal-campaign",
    name: "Seasonal Campaign Pack",
    category: "BRAND" as const,
    description:
      "Generate a cohesive seasonal marketing campaign: holiday, summer, back-to-school, or custom season with consistent brand styling.",
    inputSchema: {
      fields: [
        { key: "productImage", type: "image", label: "Product/Brand Image", required: true },
        { key: "brandName", type: "text", label: "Brand Name", required: true },
        { key: "season", type: "text", label: "Season/Holiday", required: true, placeholder: "Summer 2024, Black Friday, Holiday Season" },
        { key: "campaignMessage", type: "textarea", label: "Campaign Message", required: true, placeholder: "Summer Sale - Up to 50% off" },
      ],
    },
    optionsSchema: {
      fields: [
        { key: "mood", type: "select", label: "Campaign Mood", default: "festive", options: [
          { value: "festive", label: "Festive & Celebratory" },
          { value: "cozy", label: "Cozy & Warm" },
          { value: "energetic", label: "Energetic & Exciting" },
          { value: "elegant", label: "Elegant & Sophisticated" },
        ]},
      ],
    },
    modelPipeline: {
      steps: [
        { id: "hero_banner", type: "image_generate", model: "fal", label: "Hero Banner", promptTemplate: "{{season}} campaign hero banner for {{brandName}}, {{campaignMessage}}, {{mood}} mood, seasonal elements, professional marketing design, wide format" },
        { id: "social_square", type: "image_generate", model: "fal", label: "Social Post (Square)", promptTemplate: "{{season}} campaign social post for {{brandName}}, {{campaignMessage}}, {{mood}} mood, seasonal styling, square format, engaging design" },
        { id: "social_story", type: "image_generate", model: "fal", label: "Social Story", promptTemplate: "{{season}} campaign story for {{brandName}}, {{campaignMessage}}, {{mood}} mood, seasonal elements, vertical 9:16 format" },
        { id: "email_header", type: "image_generate", model: "fal", label: "Email Header", promptTemplate: "{{season}} campaign email header for {{brandName}}, {{campaignMessage}}, {{mood}} mood, seasonal design, professional marketing" },
        { id: "promo_badge", type: "image_generate", model: "fal", label: "Promo Badge/Sticker", promptTemplate: "{{season}} promotional badge/sticker for {{brandName}}, {{campaignMessage}}, {{mood}} mood, eye-catching, overlay-ready design" },
      ],
    },
    estimatedCredits: 10,
    costPerRun: 0.50,
    avgRating: 4.6,
    totalRuns: 0,
  },
];

async function main() {
  console.log("🌱 Seeding templates...\n");

  for (const template of templates) {
    const { costPerRun, avgRating, totalRuns, ...templateData } = template;
    
    const existing = await prisma.template.findUnique({
      where: { slug: template.slug },
    });

    if (existing) {
      console.log(`  ⏭️  Template "${template.name}" already exists, updating...`);
      await prisma.template.update({
        where: { slug: template.slug },
        data: templateData,
      });
    } else {
      console.log(`  ✅ Creating template "${template.name}"...`);
      await prisma.template.create({
        data: templateData,
      });
    }
  }

  console.log("\n✨ Seeding complete!");
  console.log(`   Total templates: ${templates.length}`);
  console.log(`   - Ecommerce: ${templates.filter(t => t.category === "ECOMMERCE").length}`);
  console.log(`   - Ads: ${templates.filter(t => t.category === "ADS").length}`);
  console.log(`   - Brand: ${templates.filter(t => t.category === "BRAND").length}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
