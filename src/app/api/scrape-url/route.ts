import { NextRequest, NextResponse } from "next/server";

// Simple product page scraper
// In production, you'd use a proper scraping service like Browserless, ScrapingBee, etc.
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL required" }, { status: 400 });
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();

    // Extract data using regex patterns (simple approach)
    // In production, use cheerio or a proper HTML parser
    const data = extractProductData(html, parsedUrl.hostname);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      { error: "Failed to scrape URL" },
      { status: 500 }
    );
  }
}

function extractProductData(html: string, hostname: string) {
  const data: {
    title: string;
    description: string;
    images: string[];
    price?: string;
    brand?: string;
    features?: string[];
  } = {
    title: "",
    description: "",
    images: [],
  };

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    data.title = cleanText(titleMatch[1]).split("|")[0].split("-")[0].trim();
  }

  // Extract OG title (often better)
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
  if (ogTitleMatch) {
    data.title = cleanText(ogTitleMatch[1]);
  }

  // Extract description
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  if (metaDescMatch) {
    data.description = cleanText(metaDescMatch[1]);
  }

  const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
  if (ogDescMatch) {
    data.description = cleanText(ogDescMatch[1]);
  }

  // Extract images
  const images: string[] = [];

  // OG image (usually the hero)
  const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
  if (ogImageMatch) {
    images.push(ogImageMatch[1]);
  }

  // Product images from common patterns
  const imgMatches = Array.from(html.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi));
  for (const match of imgMatches) {
    const src = match[1];
    if (isProductImage(src, hostname)) {
      const fullUrl = src.startsWith("//") ? `https:${src}` : src;
      if (!images.includes(fullUrl)) {
        images.push(fullUrl);
      }
    }
  }

  // Also check data-src and data-srcset
  const dataSrcMatches = Array.from(html.matchAll(/data-src=["']([^"']+)["']/gi));
  for (const match of dataSrcMatches) {
    const src = match[1];
    if (isProductImage(src, hostname)) {
      const fullUrl = src.startsWith("//") ? `https:${src}` : src;
      if (!images.includes(fullUrl)) {
        images.push(fullUrl);
      }
    }
  }

  data.images = images.slice(0, 8); // Max 8 images

  // Extract price
  const priceMatch = html.match(/["']price["'][^>]*>\s*\$?([\d,.]+)/i) ||
                     html.match(/\$\s*([\d,.]+)/);
  if (priceMatch) {
    data.price = `$${priceMatch[1]}`;
  }

  // Extract brand (common meta tags)
  const brandMatch = html.match(/<meta[^>]*property=["']og:brand["'][^>]*content=["']([^"']+)["']/i) ||
                     html.match(/<meta[^>]*name=["']brand["'][^>]*content=["']([^"']+)["']/i);
  if (brandMatch) {
    data.brand = cleanText(brandMatch[1]);
  }

  // Extract features (look for bullet points)
  const features: string[] = [];
  const liMatches = Array.from(html.matchAll(/<li[^>]*>([^<]{10,100})<\/li>/gi));
  for (const match of liMatches) {
    const text = cleanText(match[1]);
    if (text.length > 10 && text.length < 150 && !text.includes("<")) {
      features.push(text);
      if (features.length >= 5) break;
    }
  }
  if (features.length > 0) {
    data.features = features;
  }

  return data;
}

function cleanText(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isProductImage(src: string, _hostname: string): boolean {
  void _hostname; // Reserved for future host-specific rules
  if (!src) return false;
  
  // Skip small images, icons, logos
  if (src.includes("logo") || src.includes("icon") || src.includes("sprite")) return false;
  if (src.includes("1x1") || src.includes("pixel")) return false;
  if (src.endsWith(".svg") || src.endsWith(".gif")) return false;
  
  // Must be a reasonable image
  if (!src.includes(".jpg") && !src.includes(".jpeg") && !src.includes(".png") && !src.includes(".webp")) {
    // Check if it's a CDN URL that might not have extension
    if (!src.includes("images") && !src.includes("media") && !src.includes("cdn")) {
      return false;
    }
  }

  // Must be large enough (if dimensions are in URL)
  const sizeMatch = src.match(/(\d{2,4})x(\d{2,4})/);
  if (sizeMatch) {
    const width = parseInt(sizeMatch[1]);
    const height = parseInt(sizeMatch[2]);
    if (width < 200 || height < 200) return false;
  }

  return true;
}
