// src/middlewares/deep-populate.ts
import type { Core } from '@strapi/strapi';
import type { UID } from '@strapi/types';
import { contentTypes } from '@strapi/utils';
import pluralize from 'pluralize';

interface Options { relationalFields?: string[] }

const { CREATED_BY_ATTRIBUTE, UPDATED_BY_ATTRIBUTE } = contentTypes.constants;

const getContentTypeFromUrl = (url: string) => {
  const path = url.split('?')[0];
  const parts = path.split('/').filter(Boolean); // e.g. ['api','pages']
  return parts[1] || ''; // 'pages' / 'global' / etc.
};

const getDeepPopulate = (
  strapi: Core.Strapi,
  uid: UID.ContentType | UID.Component,
  opts: Options = {}
) => {
  const model = strapi.getModel(uid);
  if (!model) return {};

  const attributes = Object.entries(model.attributes ?? {});
  return attributes.reduce((acc: any, [attributeName, attribute]: any) => {
    switch (attribute.type) {
      case 'relation': {
        const isMorph = String(attribute.relation || '').toLowerCase().startsWith('morph');
        if (isMorph) break;

        const isVisible = contentTypes.isVisibleAttribute(model, attributeName);
        const isCreatorField = [CREATED_BY_ATTRIBUTE, UPDATED_BY_ATTRIBUTE].includes(attributeName);
        if (isVisible || isCreatorField) {
          if (attributeName === 'testimonials') {
            // more correct nested populate than 'user.image'
            acc[attributeName] = { populate: { user: { populate: 'image' } } };
          } else {
            acc[attributeName] = { populate: '*' };
          }
        }
        break;
      }
      case 'media': {
        acc[attributeName] = { populate: '*' };
        break;
      }
      case 'component': {
        const compUID = attribute.component as UID.Component;
        acc[attributeName] = { populate: getDeepPopulate(strapi, compUID, opts) };
        break;
      }
      case 'dynamiczone': {
        const comps = (attribute.components || []).reduce((m: any, compUID: string) => {
          m[compUID] = { populate: getDeepPopulate(strapi, compUID as UID.Component, opts) };
          return m;
        }, {});
        acc[attributeName] = { on: comps };
        break;
      }
      default:
        break;
    }
    return acc;
  }, {});
};

export default (config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    const url = ctx.request.url;

    if (
      url.startsWith('/api/') &&
      ctx.request.method === 'GET' &&
      !ctx.query.populate &&
      !url.includes('/api/users') &&
      !url.includes('/api/seo')
    ) {
      const ct = getContentTypeFromUrl(url);           // 'pages' | 'global' | ...
      const singular = pluralize.singular(ct);         // 'page'  | 'global'
      if (singular) {
        const uid = `api::${singular}.${singular}` as UID.ContentType;
        const populate = getDeepPopulate(strapi, uid);
        if (Object.keys(populate).length) {
          ctx.query.populate = {
            ...populate,
            ...(!url.includes('products') && { localizations: { populate: {} } }),
          };
        }
      }
    }

    await next();
  };
};
