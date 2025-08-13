// lib/strapi/strapiImage.ts
import { unstable_noStore as noStore } from 'next/cache';

const BASE = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export function strapiImage(url: string): string {
  noStore();
  if (!url) return '';

  // data URLs pass through
  if (url.startsWith('data:')) return url;

  // protocol-relative -> normalize to https
  if (url.startsWith('//')) return `https:${url}`;

  // absolute http(s) -> pass through
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  // relative path -> prefix with base
  const needsSlash = url.startsWith('/') ? '' : '/';
  return `${BASE}${needsSlash}${url}`;
}
