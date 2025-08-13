"use client";

import { useEffect } from "react";
import { useSlugContext } from "@/app/context/SlugContext";
import { useRouter } from "next/navigation";

// Base Strapi URL (prod from Vercel env, fallback to local dev)
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// Origin string like "https://deege-backend-lfra.onrender.com"
let STRAPI_ORIGIN = "http://localhost:1337";
try {
  STRAPI_ORIGIN = new URL(STRAPI_URL).origin;
} catch {
  // keep fallback
}

export default function ClientSlugHandler({
  localizedSlugs,
}: {
  localizedSlugs: Record<string, string>;
}) {
  const { dispatch } = useSlugContext();
  const router = useRouter();

  // keep slug state in context
  useEffect(() => {
    if (localizedSlugs) {
      dispatch({ type: "SET_SLUGS", payload: localizedSlugs });
    }
  }, [localizedSlugs, dispatch]);

  // listen for Strapi preview "strapiUpdate" messages from the Strapi origin
  useEffect(() => {
    const handleMessage = (message: MessageEvent) => {
      if (
        message.origin === STRAPI_ORIGIN &&
        typeof message.data === "object" &&
        message.data !== null &&
        (message.data as any).type === "strapiUpdate"
      ) {
        router.refresh();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  return null; // no UI
}
