// next.config.mjs

/** @type {import('next').NextConfig} */
const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

let hostname = 'localhost';
try {
  const u = new URL(API_URL);
  hostname = u.hostname;
} catch {
  // keep default
}

const nextConfig = {
  images: {
    // allow images served by your Strapi host (prod + local)
    remotePatterns: [
      { protocol: 'https', hostname, pathname: '/uploads/**' },
      { protocol: 'http',  hostname, pathname: '/uploads/**' },
    ],
  },
  pageExtensions: ['ts', 'tsx'],
  async redirects() {
    try {
      const res = await fetch(`${API_URL}/api/redirections`);
      const result = await res.json();
      return (result?.data ?? []).map(({ source, destination }) => ({
        source: `/:locale${source}`,
        destination: `/:locale${destination}`,
        permanent: false,
      }));
    } catch {
      return [];
    }
  },
};

export default nextConfig;
