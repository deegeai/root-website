// lib/strapi/fetchContentType.ts
import { draftMode } from "next/headers";
import qs from "qs";

export type StrapiResponse<T = unknown> = { data: T } | { data: T[] };

export function spreadStrapiData<T>(payload: StrapiResponse<T>): T | null {
  const d = (payload as any).data as T | T[] | undefined;
  if (Array.isArray(d)) return d[0] ?? null;
  return (d as T) ?? null;
}

function getBase() {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!base && process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is not set");
  }
  return base ?? "http://localhost:1337";
}

function toApiPath(contentType: string) {
  let ct = contentType.trim();
  if (ct.startsWith("/")) ct = ct.slice(1);
  if (ct.startsWith("api/")) ct = ct.slice(4);
  return `/api/${ct}`;
}

export default async function fetchContentType<T = any>(
  contentType: string,
  params: Record<string, unknown> = {},
  spreadData = false
): Promise<T | StrapiResponse<T> | null> {
  const { isEnabled } = await draftMode();

  try {
    const BASE = getBase();
    const queryParams: Record<string, unknown> = { ...params };
    if (isEnabled) queryParams.publicationState = "preview";

    const url = new URL(toApiPath(contentType), BASE);
    const query = qs.stringify(queryParams, { encodeValuesOnly: true });
    const href = query ? `${url.href}?${query}` : url.href;

    const res = await fetch(href, { method: "GET", cache: "no-store" });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`Strapi fetch failed: ${href} -> ${res.status} ${body}`);
      throw new Error(`Failed to fetch ${contentType} (status=${res.status})`);
    }

    const json = (await res.json()) as StrapiResponse<T>;
    return spreadData ? (spreadStrapiData(json) as T | null) : json;
  } catch (err) {
    console.error("FetchContentTypeError", err);
    return null;
  }
}
