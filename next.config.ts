import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google User Avatare
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co', // Supabase Storage
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://api.mapbox.com https://*.googletagmanager.com https://*.google-analytics.com; worker-src 'self' blob:; child-src 'self' blob:; frame-src 'self' https://www.youtube.com https://youtube.com https://*.googletagmanager.com; style-src 'self' 'unsafe-inline' https://api.mapbox.com https://fonts.googleapis.com; img-src 'self' data: blob: https://*.supabase.co https://lh3.googleusercontent.com https://api.mapbox.com https://*.tile.openstreetmap.org https://events.mapbox.com https://*.googletagmanager.com https://*.google-analytics.com https://*.g.doubleclick.net; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.mapbox.com https://events.mapbox.com https://translate.googleapis.com https://*.google-analytics.com https://*.analytics.google.com https://*.g.doubleclick.net; font-src 'self' https://fonts.gstatic.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
