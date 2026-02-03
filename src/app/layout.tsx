import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { Navbar } from "@/components/layout/navbar";
import { OnboardingWrapper } from "@/components/onboarding";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LOLA – AI Creative Engine for Teams",
  description:
    "LOLA gives you Weavy-level power as one-click recipes. Upload one asset, get your whole visual campaign. No node graphs required.",
  keywords: [
    "LOLA",
    "AI creative engine",
    "AI workflows",
    "multi-model orchestration",
    "product photography",
    "ecommerce images",
    "social media ads",
    "AI image generation",
    "Weavy alternative",
    "creative automation",
  ],
  openGraph: {
    title: "LOLA – AI Creative Engine for Teams",
    description:
      "Upload one asset, LOLA builds your whole visual campaign. Weavy-level power as one-click recipes.",
    type: "website",
    siteName: "LOLA",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOLA – AI Creative Engine for Teams",
    description: "Upload one asset, get your whole visual campaign.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-white min-h-screen`}
      >
        <SessionProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
          <OnboardingWrapper />
        </SessionProvider>
      </body>
    </html>
  );
}
