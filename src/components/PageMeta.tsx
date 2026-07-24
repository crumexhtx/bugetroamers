import { useEffect } from 'react';
import {
  DEFAULT_SOCIAL_IMAGE_ALT,
  DEFAULT_SOCIAL_IMAGE_HEIGHT,
  DEFAULT_SOCIAL_IMAGE_URL,
  DEFAULT_SOCIAL_IMAGE_WIDTH,
  SITE_NAME,
  SITE_URL,
} from '../config/site';

export interface PageMetaProps {
  title: string;
  description: string;
  canonicalPath?: string;
  noIndex?: boolean;
  image?: string;
  imageAlt?: string;
}

export function PageMeta({
  title,
  description,
  canonicalPath,
  noIndex = false,
  image = DEFAULT_SOCIAL_IMAGE_URL,
  imageAlt = DEFAULT_SOCIAL_IMAGE_ALT,
}: PageMetaProps) {
  useEffect(() => {
    document.title = title;

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute('content', description);

    const existingCanonicalTag = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;
    let canonicalTag = existingCanonicalTag;
    if (canonicalPath) {
      if (!canonicalTag) {
        canonicalTag = document.createElement('link');
        canonicalTag.rel = 'canonical';
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.href = `${SITE_URL}${canonicalPath}`;
    } else {
      canonicalTag?.remove();
    }

    let robotsTag = document.querySelector('meta[name="robots"]');
    if (noIndex) {
      if (!robotsTag) {
        robotsTag = document.createElement('meta');
        robotsTag.setAttribute('name', 'robots');
        document.head.appendChild(robotsTag);
      }
      robotsTag.setAttribute('content', 'noindex, nofollow');
    } else {
      robotsTag?.remove();
    }

    const upsertMeta = (
      attribute: 'name' | 'property',
      key: string,
      content: string,
    ) => {
      let tag = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    const canonicalUrl = canonicalPath
      ? `${SITE_URL}${canonicalPath}`
      : `${window.location.origin}${window.location.pathname}`;
    const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta(
      'property',
      'og:url',
      canonicalUrl,
    );
    upsertMeta('property', 'og:image', imageUrl);
    if (image === DEFAULT_SOCIAL_IMAGE_URL) {
      upsertMeta(
        'property',
        'og:image:width',
        String(DEFAULT_SOCIAL_IMAGE_WIDTH),
      );
      upsertMeta(
        'property',
        'og:image:height',
        String(DEFAULT_SOCIAL_IMAGE_HEIGHT),
      );
    } else {
      document.querySelector('meta[property="og:image:width"]')?.remove();
      document.querySelector('meta[property="og:image:height"]')?.remove();
    }
    upsertMeta('property', 'og:image:alt', imageAlt);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', imageUrl);
    upsertMeta('name', 'twitter:image:alt', imageAlt);

    document.getElementById('seo-static')?.setAttribute('hidden', '');
  }, [title, description, canonicalPath, noIndex, image, imageAlt]);

  return null;
}

export default PageMeta;
