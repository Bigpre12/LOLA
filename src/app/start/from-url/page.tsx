"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, CardContent } from "@/components/ui";

interface ScrapedData {
  title: string;
  description: string;
  images: string[];
  price?: string;
  brand?: string;
  colors?: string[];
  features?: string[];
}

function FromUrlContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url") || "";
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setError("No URL provided");
      setIsLoading(false);
      return;
    }

    const scrapeUrl = async () => {
      try {
        const response = await fetch("/api/scrape-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          throw new Error("Failed to scrape URL");
        }

        const data = await response.json();
        setScrapedData(data);
        if (data.images?.length > 0) {
          setSelectedImage(data.images[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to scrape URL");
      } finally {
        setIsLoading(false);
      }
    };

    scrapeUrl();
  }, [url]);

  const handleContinue = () => {
    if (!scrapedData || !selectedImage) return;

    // Store scraped data in sessionStorage and navigate to run page
    const runData = {
      productImage: selectedImage,
      productName: scrapedData.title,
      productDescription: scrapedData.description,
      features: scrapedData.features?.join("\n") || "",
      sourceUrl: url,
    };

    sessionStorage.setItem("prefill_data", JSON.stringify(runData));
    router.push("/run/full-asset-engine?prefill=true");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Analyzing product page...</h2>
          <p className="text-slate-400">Scraping images, copy, and brand vibes</p>
          <p className="text-sm text-slate-500 mt-4 font-mono">{url}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Couldn&apos;t scrape that URL</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <div className="space-y-3">
              <Link href="/start">
                <Button className="w-full">Try another URL</Button>
              </Link>
              <Link href="/run/full-asset-engine">
                <Button variant="outline" className="w-full">Upload manually instead</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/start" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
          <h1 className="text-white font-medium">Review scraped content</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Image selection */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Select your hero image</h2>
            
            {/* Main selected image */}
            {selectedImage && (
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-800 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage}
                  alt="Selected product"
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  Selected
                </div>
              </div>
            )}

            {/* Image thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {scrapedData?.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? "border-violet-500 ring-2 ring-violet-500/30"
                      : "border-slate-700 hover:border-slate-600"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`Option ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Extracted info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Extracted product info</h2>
              
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="text-sm text-slate-400">Product Name</label>
                    <p className="text-white font-medium mt-1">{scrapedData?.title || "—"}</p>
                  </div>

                  {scrapedData?.brand && (
                    <div>
                      <label className="text-sm text-slate-400">Brand</label>
                      <p className="text-white mt-1">{scrapedData.brand}</p>
                    </div>
                  )}

                  {scrapedData?.price && (
                    <div>
                      <label className="text-sm text-slate-400">Price</label>
                      <p className="text-white mt-1">{scrapedData.price}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-slate-400">Description</label>
                    <p className="text-slate-300 mt-1 text-sm line-clamp-4">
                      {scrapedData?.description || "No description found"}
                    </p>
                  </div>

                  {scrapedData?.features && scrapedData.features.length > 0 && (
                    <div>
                      <label className="text-sm text-slate-400">Key Features</label>
                      <ul className="mt-1 space-y-1">
                        {scrapedData.features.slice(0, 5).map((feature, i) => (
                          <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                            <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* What you'll get */}
            <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20">
              <CardContent className="p-6">
                <h3 className="text-white font-semibold mb-3">What you&apos;ll get</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-violet-500/20 rounded flex items-center justify-center text-violet-400 text-xs">5</span>
                    Amazon-ready gallery images
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-violet-500/20 rounded flex items-center justify-center text-violet-400 text-xs">6</span>
                    Lifestyle scene variations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-violet-500/20 rounded flex items-center justify-center text-violet-400 text-xs">5</span>
                    Social ad formats
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-violet-500/20 rounded flex items-center justify-center text-violet-400 text-xs">4</span>
                    Platform-specific crops
                  </li>
                </ul>
                <p className="text-xs text-slate-500 mt-4">
                  ~20 assets • ~$2.00 • Organized by platform
                </p>
              </CardContent>
            </Card>

            {/* CTA */}
            <Button
              onClick={handleContinue}
              disabled={!selectedImage}
              className="w-full py-6 text-lg"
            >
              Continue with this product
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FromUrlPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    }>
      <FromUrlContent />
    </Suspense>
  );
}
