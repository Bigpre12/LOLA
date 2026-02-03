/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from AI model providers
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.fal.ai',
      },
      {
        protocol: 'https',
        hostname: 'fal.media',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
      {
        protocol: 'https',
        hostname: '**.replicate.com',
      },
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'api.together.xyz',
      },
      {
        protocol: 'https',
        hostname: '**.stability.ai',
      },
    ],
  },
  // Output standalone for Railway
  output: 'standalone',
};

export default nextConfig;
