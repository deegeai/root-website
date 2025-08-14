// lib/strapi/strapiImage.ts
import { unstable_noStore as noStore } from "next/cache";

function getBase() {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!base && process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is not set");
  }
  return base ?? "http://localhost:1337";
}
const BASE = getBase();

export function strapiImage(url: string): string {
  noStore();
  if (!url) return "";

  if (url.startsWith("data:")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  const needsSlash = url.startsWith("/") ? "" : "/";
  return `${BASE}${needsSlash}${url}`;
}
