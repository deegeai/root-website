import Image from 'next/image';
import { unstable_noStore as noStore } from 'next/cache';
import type { ComponentProps } from 'react';

interface StrapiImageProps extends Omit<ComponentProps<typeof Image>, 'src' | 'alt'> {
  src: string | null;
  alt: string | null;
}

export function getStrapiMedia(url: string | null): string | null {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  if (!url) return null;

  // data URLs pass through
  if (url.startsWith('data:')) return url;

  // protocol-relative -> normalize to https
  if (url.startsWith('//')) return `https:${url}`;

  // absolute http(s)
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  // relative path -> prefix with base
  const needsSlash = url.startsWith('/') ? '' : '/';
  return `${base}${needsSlash}${url}`;
}

export function StrapiImage({
  src,
  alt,
  className,
  ...rest
}: Readonly<StrapiImageProps>) {
  noStore();
  const imageUrl = getStrapiMedia(src);
  if (!imageUrl) return null;

  return (
    <Image
      src={imageUrl}
      alt={alt ?? 'Decorative image'}
      className={className}
      {...rest}
    />
  );
}
