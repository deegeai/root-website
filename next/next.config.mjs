// next.config.mjs

/** @type {import('next').NextConfig} */

// Require the Strapi base in production so we don't build with localhost by mistake
const isProd = process.env.NODE_ENV === 'production';
const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  (isProd ? (() => { throw new Error('NEXT_PUBLIC_STRAPI_URL is not set'); })() : 'http://localhost:1337');

// Derive hostname for images.remotePatterns
let hostname = 'localhost';
try {
  const u = new URL(API_URL);
  hostname = u.hostname;
} catch {
  // keep 'localhost'
}

async function fetchRedirections() {
  // Defensive: time out quickly & don't crash the build if Strapi is down
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`${API_URL}/api/redirections`, {
      // If your redirections are public, this is fine. If not, add an API token header.
      // headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}` },
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!res.ok) return [];

    const result = await res.json();

    // Accept either flat fields or Strapi v4 { data: [{ id, attributes: { source, destination }}, ...] }
    const rows = Array.isArray(result?.data) ? result.data : [];
    return rows
      .map((row) => {
        const src = row?.source ?? row?.attributes?.source;
        const dst = row?.destination ?? row?.attributes?.destination;
        if (!src || !dst) return null;

        // Normalize leading slashes to avoid double slashes after we prefix /:locale
        const norm = (p) => (p.startsWith('/') ? p : `/${p}`);

        return {
          source: `/:locale${norm(src)}`,
          destination: `/:locale${norm(dst)}`,
          permanent: false,
        };
      })
      .filter(Boolean);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

const nextConfig = {
  images: {
    remotePatterns: [
      // Strapi uploads (Render)
      { protocol: 'https', hostname, pathname: '/uploads/**' },
      { protocol: 'http',  hostname, pathname: '/uploads/**' },

      // OPTIONAL: uncomment if/when you switch to Cloudinary/S3
      // { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      // { protocol: 'https', hostname: '*.amazonaws.com', pathname: '/**' },
    ],
  },
  pageExtensions: ['ts', 'tsx'],

  async redirects() {
    return await fetchRedirections();
  },
};

export default nextConfig;
