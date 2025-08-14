import { Metadata } from 'next';
import PageContent from '@/lib/shared/PageContent';
import fetchContentType from '@/lib/strapi/fetchContentType';
import { generateMetadataObject } from '@/lib/shared/metadata';
import ClientSlugHandler from '../ClientSlugHandler';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const pageData = await fetchContentType(
    'pages',
    {
      locale: params.locale,
      filters: { slug: { $eq: params.slug } },
      populate: 'seo.metaImage',
    },
    true
  );
  return generateMetadataObject(pageData?.seo);
}

export default async function Page({ params }: { params: { locale: string; slug: string } }) {
  const pageData = await fetchContentType(
    'pages',
    {
      locale: params.locale,
      filters: { slug: { $eq: params.slug } },
      populate: 'deep',
    },
    true
  );

  if (!pageData) notFound();

  const localizedSlugs =
    pageData.localizations?.reduce(
      (acc: Record<string, string>, l: any) => { acc[l.locale] = l.slug; return acc; },
      { [params.locale]: params.slug }
    ) ?? { [params.locale]: params.slug };

  return (
    <>
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <PageContent pageData={pageData} />
    </>
  );
}
