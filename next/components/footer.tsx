import React from "react";
import { Logo } from "@/components/logo";
import { Link } from "next-view-transitions";

type RawLink = { text?: string; URL?: string; url?: string };

const normalizeLink = (l: RawLink): { text: string; url: string } | null => {
  const text = (l?.text ?? "").trim();
  const url  = (l?.URL ?? l?.url ?? "").trim();
  if (!text || !url) return null;
  return { text, url };
};

const toLinkArray = (value: unknown) =>
  Array.isArray(value) ? value.map(normalizeLink).filter(Boolean) as {text:string; url:string}[] : [];

const makeHref = (locale: string, url: string) => {
  // absolute/external or protocols
  if (/^(https?:|mailto:|tel:)/i.test(url)) return url;
  const path = url.startsWith("/") ? url : `/${url}`;
  // you use localePrefix="always"
  return `/${locale}${path}`;
};

export const Footer = async ({ data, locale }: { data: any; locale: string }) => {
  const internal = toLinkArray(data?.internal_links);
  const policy   = toLinkArray(data?.policy_links);
  const social   = toLinkArray(data?.social_media_links);

  return (
    <div id="footer" className="relative">
      <div className="border-t border-neutral-900 px-8 pt-20 pb-20 relative bg-primary">
        <div className="max-w-7xl mx-auto text-sm text-neutral-500 flex sm:flex-row flex-col justify-between items-start">
          <div>
            <div className="mr-4 md:flex mb-6">
              {data?.logo?.image && <Logo image={data.logo.image} />}
            </div>
            <div className="max-w-xs mb-7">{data?.description}</div>
            <div className="mt-4">{data?.copyright}</div>
          </div>

          <div className="grid grid-cols-3 gap-10 items-start mt-10 md:mt-0">
            <LinkSection links={internal} locale={locale} />
            <LinkSection links={policy}   locale={locale} />
            <LinkSection links={social}   locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
};

const LinkSection = ({
  links = [],
  locale,
}: {
  links?: { text: string; url: string }[];
  locale: string;
}) => (
  <div className="flex justify-center space-y-4 flex-col mt-4 gap-y-4">
    {links.map((link) => (
      <Link
        key={`${link.text}-${link.url}`}
        className="transition-colors hover:text-neutral-400 text-muted text-xs sm:text-sm"
        href={makeHref(locale, link.url)}
      >
        {link.text}
      </Link>
    ))}
  </div>
);
