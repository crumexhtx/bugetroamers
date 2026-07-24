import { useEffect } from 'react';

export interface PageMetaProps {
  title: string;
  description: string;
  canonicalPath?: string;
}

export function PageMeta({
  title,
  description,
  canonicalPath = '/',
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

    let canonicalTag = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      document.head.appendChild(canonicalTag);
    }
    const origin = window.location.origin;
    canonicalTag.href = `${origin}${canonicalPath}`;

    const upsertOg = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    upsertOg('og:title', title);
    upsertOg('og:description', description);
    upsertOg('og:type', 'website');
    upsertOg('og:url', `${origin}${canonicalPath}`);
  }, [title, description, canonicalPath]);

  return null;
}

export default PageMeta;
