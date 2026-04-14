import { type NextConfig } from 'next';

// =============================================================================
// A36 Earn — next.config.ts
// Platform: earn.a36labs.com
// Stripped: next-axiom, next-pwa, Privy, Superteam CSP origins
// =============================================================================

const baseCsp = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://us-assets.i.posthog.com https://www.google-analytics.com https://challenges.cloudflare.com;
  style-src 'self' 'unsafe-inline' https://unpkg.com https://fonts.googleapis.com https://us.posthog.com;
  img-src 'self' blob: data: https://res.cloudinary.com https://*.googleusercontent.com https://googletagmanager.com https://dl.airtable.com https://*.airtableusercontent.com;
  connect-src 'self' blob: https://api.mainnet-beta.solana.com https://api.devnet.solana.com https://api.testnet.solana.com https://us.i.posthog.com https://app.posthog.com https://internal-j.posthog.com https://us.posthog.com https://*.helius-rpc.com wss://mainnet.helius-rpc.com https://ipapi.co https://res.cloudinary.com https://api.cloudinary.com https://www.google-analytics.com;
  media-src 'self' blob: data: https://res.cloudinary.com;
  font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  child-src 'self' https://loom.com https://www.loom.com;
  frame-src 'self' https://www.youtube.com https://challenges.cloudflare.com https://res.cloudinary.com https://airtable.com https://*.airtable.com https://loom.com https://www.loom.com;
  frame-ancestors 'self';
  worker-src 'self';
  manifest-src 'self';
  ${process.env.NODE_ENV === 'production' ? 'upgrade-insecure-requests;' : ''}
`;

const csp = baseCsp.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      pino: 'pino/browser',
    },
  },
  poweredByHeader: false,
  trailingSlash: true,
  reactStrictMode: true,
  reactCompiler: false,
  images: {
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-*',
      '@solana/*',
      '@tanstack/react-query',
      '@tiptap/*',
      'ai',
      'cmdk',
      'dayjs',
      'embla-carousel-autoplay',
      'embla-carousel-react',
      'flag-icons',
      'jotai',
      'lowlight',
      'lucide-react',
      'nprogress',
      'react-day-picker',
      'react-hook-form',
      'react-select',
      'sonner',
      'tailwind-merge',
      'typescript-cookie',
      'vaul',
      'zod',
    ],
  },
  serverExternalPackages: ['isomorphic-dompurify', 'jsdom', 'parse5'],
  async headers() {
    const headers = [];

    headers.push({
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Content-Security-Policy', value: csp },
      ],
    });

    const isPreviewEnv =
      process.env.VERCEL_ENV === 'preview' ||
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview';

    if (isPreviewEnv) {
      headers.push({
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      });
    }

    headers.push({
      source: '/sitemap/:path*.xml',
      headers: [
        {
          key: 'Content-Type',
          value: 'application/xml; charset=UTF-8',
        },
        {
          key: 'Cache-Control',
          value:
            'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400, stale-if-error=86400',
        },
      ],
    });

    headers.push({
      source: '/',
      headers: [
        {
          key: 'Link',
          value:
            '</assets/banner/banner-mobile.avif>; rel=preload; as=image; type=image/avif; fetchpriority=high; media="(max-width: 639px)", </assets/banner/banner.avif>; rel=preload; as=image; type=image/avif; fetchpriority=high; media="(min-width: 640px)"',
        },
      ],
    });

    headers.push({
      source: '/assets/banner/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    });

    return headers;
  },
  async redirects() {
    return [
      {
        source: '/earn/api/email/unsubscribe/:path*',
        destination: '/api/email/unsubscribe/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/docs-keep/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/docs-keep/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/api/geo/world.geojson',
        destination:
          'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson',
      },
      {
        source: '/cdn/coinmarketcap/:path*',
        destination: 'https://s2.coinmarketcap.com/:path*',
      },
      {
        source: '/cdn/bnbstatic/:path*',
        destination: 'https://bin.bnbstatic.com/:path*',
      },
      {
        source: '/cdn/solscan/:path*',
        destination: 'https://statics.solscan.io/:path*',
      },
      {
        source: '/cdn/coingecko/:path*',
        destination: 'https://assets.coingecko.com/:path*',
      },
      {
        source: '/cdn/github/:path*',
        destination: 'https://avatars.githubusercontent.com/:path*',
      },
      {
        source: '/cdn/phantom/:path*',
        destination: 'https://api.phantom.app/:path*',
      },
      {
        source: '/cdn/arweave/:path*',
        destination: 'https://arweave.net/:path*',
      },
      {
        source: '/cdn/ipfs-io/:path*',
        destination: 'https://ipfs.io/:path*',
      },
      {
        source: '/cdn/imagedelivery/:path*',
        destination: 'https://imagedelivery.net/:path*',
      },
    ];
  },
  skipTrailingSlashRedirect: true,
  logging: {
    browserToTerminal: true,
  },
};

export default nextConfig;
