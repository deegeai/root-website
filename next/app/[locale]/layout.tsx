// app/[locale]/layout.tsx (or wherever this file lives)
import React from "react";
import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import { generateMetadataObject } from "@/lib/shared/metadata";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { CartProvider } from "@/context/cart-context";
import { cn } from "@/lib/utils";
import { ViewTransitions } from "next-view-transitions";
import fetchContentType from "@/lib/strapi/fetchContentType";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug?: string };
}): Promise<Metadata> {
  // ❗ locale is top-level; no filters for single types
  const global = await fetchContentType(
    "global",
    { locale: params.locale, populate: "seo.metaImage" },
    true
  );
  return generateMetadataObject(global?.seo);
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // ❗ fetch global with top-level locale; populate what you need
  const global = await fetchContentType(
    "global",
    { locale, populate: "deep" }, // or 'navbar,footer' if you prefer
    true
  );

  // Guard against null (e.g., Strapi 502/cold start)
  const navbar = global?.navbar ?? null;
  const footer = global?.footer ?? null;

  return (
    <html lang={locale}>
      <ViewTransitions>
        <CartProvider>
          <body className={cn(robotoMono.className, "bg-[#08090A] antialiased h-full w-full")}>
            {/* Components should handle null/undefined gracefully */}
            <Navbar data={navbar} locale={locale} />
            {children}
            <Footer data={footer} locale={locale} />
          </body>
        </CartProvider>
      </ViewTransitions>
    </html>
  );
}
