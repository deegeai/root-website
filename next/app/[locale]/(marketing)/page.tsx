import { Metadata } from 'next';
import React from 'react';
import PageContent from '@/lib/shared/PageContent';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { generateMetadataObject } from '@/lib/shared/metadata';
import ClientSlugHandler from './ClientSlugHandler';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const pageData = await fetchContentType(
    'pages',
    {
      locale: params.locale,                 // top-level
      filters: { slug: { $eq: 'homepage' }}, // explicit operator
      populate: 'seo.metaImage',
    },
    true
  );
  return generateMetadataObject(pageData?.seo);
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  const pageData = await fetchContentType(
    'pages',
    {
      locale: params.locale,
      filters: { slug: { $eq: 'homepage' } },
      populate: 'deep',
    },
    true
  );

  if (!pageData) notFound();

  const localizedSlugs =
    pageData.localizations?.reduce(
      (acc: Record<string, string>, l: any) => { acc[l.locale] = ''; return acc; },
      { [params.locale]: '' }
    ) ?? { [params.locale]: '' };

  return (
    <>
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <PageContent pageData={pageData} />
    </>
  );
}
