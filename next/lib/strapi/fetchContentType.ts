// lib/strapi/fetchContentType.ts
import { draftMode } from "next/headers";
import qs from "qs";

/** A Strapi response can be single or array */
export type StrapiResponse<T = unknown> =
  | { data: T }
  | { data: T[] };

export function spreadStrapiData<T>(payload: StrapiResponse<T>): T | null {
  const d = (payload as any).data as T | T[] | undefined;
  if (Array.isArray(d)) return d[0] ?? null;
  return (d as T) ?? null;
}

export default async function fetchContentType<T = any>(
  contentType: string,
  params: Record<string, unknown> = {},
  spreadData = false
): Promise<T | StrapiResponse<T> | null> {
  const { isEnabled } = await draftMode();

  try {
    const BASE = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

    // Build query params
    const queryParams: Record<string, unknown> = { ...params };
    if (isEnabled) {
      // Preview draft content in Strapi
      queryParams.publicationState = "preview";
    }

    // Safe URL build
    const url = new URL(`/api/${contentType}`, BASE);
    const query = qs.stringify(queryParams, { encodeValuesOnly: true });

    const res = await fetch(query ? `${url.href}?${query}` : url.href, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch ${contentType} from Strapi (status=${res.status})`
      );
    }

    const json = (await res.json()) as StrapiResponse<T>;
    return spreadData ? (spreadStrapiData(json) as T | null) : json;
  } catch (err) {
    console.error("FetchContentTypeError", err);
    return null;
  }
}
