export interface WikimediaImage {
  url: string;
  pageUrl: string;
  alt: string;
}

export interface WikipediaSummary {
  thumbnail?: { source: string };
  originalimage?: { source: string };
  content_urls?: { desktop?: { page?: string } };
}

interface WikimediaSearchResponse {
  query?: {
    pages?: Record<
      string,
      {
        index?: number;
        title: string;
        imageinfo?: Array<{
          thumburl?: string;
          url?: string;
          descriptionurl?: string;
          mime?: string;
        }>;
      }
    >;
  };
}

interface WikipediaArticleSearchResponse {
  query?: {
    pages?: Record<
      string,
      {
        index?: number;
        title: string;
        fullurl?: string;
        thumbnail?: { source?: string };
      }
    >;
  };
}

const CACHE_PREFIX = 'planora:media:v2:';
export const WIKIMEDIA_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

type CacheValue =
  | WikimediaImage
  | WikimediaImage[]
  | WikipediaSummary
  | null;

interface CacheEntry<T> {
  expiresAt: number;
  value: T;
}

const memoryCache = new Map<string, CacheEntry<CacheValue>>();
const inFlight = new Map<string, Promise<CacheValue>>();

function normalizeCachePart(value: string): string {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
}

function readSessionCache<T>(key: string): CacheEntry<T> | undefined {
  if (typeof sessionStorage === 'undefined') return undefined;
  try {
    const value = sessionStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (value === null) return undefined;
    const entry = JSON.parse(value) as CacheEntry<T>;
    if (
      typeof entry !== 'object' ||
      entry === null ||
      typeof entry.expiresAt !== 'number' ||
      !('value' in entry)
    ) {
      return undefined;
    }
    if (entry.expiresAt <= Date.now()) {
      try {
        sessionStorage.removeItem(`${CACHE_PREFIX}${key}`);
      } catch {
        // Storage access may be denied between reads.
      }
      return undefined;
    }
    return entry;
  } catch {
    return undefined;
  }
}

function writeSessionCache<T>(key: string, entry: CacheEntry<T>): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
  } catch {
    // Storage can be unavailable or full; the in-memory cache still works.
  }
}

function waitForCached<T>(
  key: string,
  signal: AbortSignal,
  load: () => Promise<T>,
  ttlMs = WIKIMEDIA_CACHE_TTL_MS,
): Promise<T> {
  if (signal.aborted) {
    return Promise.reject(new DOMException('The operation was aborted.', 'AbortError'));
  }

  const memoryEntry = memoryCache.get(key);
  if (memoryEntry && memoryEntry.expiresAt > Date.now()) {
    return Promise.resolve(memoryEntry.value as T);
  }
  if (memoryEntry) {
    memoryCache.delete(key);
  }
  const stored = readSessionCache<T>(key);
  if (stored !== undefined) {
    memoryCache.set(key, stored as CacheEntry<CacheValue>);
    return Promise.resolve(stored.value);
  }

  let request = inFlight.get(key) as Promise<T> | undefined;
  if (!request) {
    request = Promise.resolve()
      .then(load)
      .then((value) => {
        const entry = {
          expiresAt: Date.now() + ttlMs,
          value,
        };
        memoryCache.set(key, entry as CacheEntry<CacheValue>);
        writeSessionCache(key, entry);
        return value;
      })
      .finally(() => {
        inFlight.delete(key);
      });
    inFlight.set(
      key,
      request as Promise<CacheValue>,
    );
  }

  return new Promise<T>((resolve, reject) => {
    let settled = false;
    const abort = () => {
      if (settled) return;
      settled = true;
      reject(new DOMException('The operation was aborted.', 'AbortError'));
    };
    signal.addEventListener('abort', abort, { once: true });
    request.then(
      (value) => {
        if (!settled) {
          settled = true;
          resolve(value);
        }
      },
      (error: unknown) => {
        if (!settled) {
          settled = true;
          reject(error);
        }
      },
    ).finally(() => {
      signal.removeEventListener('abort', abort);
    });
  });
}

async function fetchWikipediaSummary(
  title: string,
  signal: AbortSignal,
): Promise<WikipediaSummary | null> {
  const response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    { signal },
  );
  if (!response.ok) return null;
  return response.json() as Promise<WikipediaSummary>;
}

const IMAGE_MATCH_STOP_WORDS = new Set([
  'and',
  'beer',
  'city',
  'drink',
  'food',
  'of',
  'the',
]);

function imageMatchTokens(value: string): string[] {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 2 && !IMAGE_MATCH_STOP_WORDS.has(token));
}

export function isImageRelevantToSubject(
  imageLabel: string,
  subject: string,
): boolean {
  const subjectTokens = imageMatchTokens(subject);
  const imageTokens = new Set(imageMatchTokens(imageLabel));
  if (subjectTokens.length === 0) return false;
  const matches = subjectTokens.filter((token) => imageTokens.has(token)).length;
  return matches >= Math.min(2, subjectTokens.length);
}

async function fetchWikipediaArticleImage(
  query: string,
  signal: AbortSignal,
  subject = query,
): Promise<WikimediaImage | null> {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '0',
    gsrlimit: '3',
    prop: 'pageimages|info',
    piprop: 'thumbnail',
    pithumbsize: '900',
    inprop: 'url',
    format: 'json',
    origin: '*',
  });
  const response = await fetch(
    `https://en.wikipedia.org/w/api.php?${params.toString()}`,
    { signal },
  );
  if (!response.ok) return null;

  const result = (await response.json()) as WikipediaArticleSearchResponse;
  const pages = Object.values(result.query?.pages ?? {}).sort(
    (a, b) => (a.index ?? 99) - (b.index ?? 99),
  );
  const page =
    (pages[0]?.thumbnail?.source ? pages[0] : undefined) ??
    pages
      .slice(1)
      .find(
        (candidate) =>
          candidate.thumbnail?.source &&
          isImageRelevantToSubject(candidate.title, subject),
      );

  if (page?.thumbnail?.source) {
    return {
      url: page.thumbnail.source,
      pageUrl:
        page.fullurl ??
        `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replaceAll(' ', '_'))}`,
      alt: page.title,
    };
  }

  const commonsImages = await fetchWikimediaImages(
    subject,
    signal,
    12,
  );
  return (
    commonsImages.find((image) =>
      isImageRelevantToSubject(image.alt, subject),
    ) ?? null
  );
}

async function fetchWikimediaImages(
  query: string,
  signal: AbortSignal,
  limit = 3,
): Promise<WikimediaImage[]> {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '6',
    gsrlimit: String(Math.max(limit * 3, 6)),
    prop: 'imageinfo',
    iiprop: 'url|mime',
    iiurlwidth: '900',
    format: 'json',
    origin: '*',
  });
  const response = await fetch(
    `https://commons.wikimedia.org/w/api.php?${params.toString()}`,
    { signal },
  );
  if (!response.ok) return [];

  const result = (await response.json()) as WikimediaSearchResponse;
  return Object.values(result.query?.pages ?? {})
    .sort((a, b) => (a.index ?? 99) - (b.index ?? 99))
    .flatMap((page) => {
      const info = page.imageinfo?.[0];
      if (
        !info ||
        !info.mime?.startsWith('image/') ||
        info.mime === 'image/svg+xml' ||
        info.mime === 'image/gif'
      ) {
        return [];
      }
      const url = info.thumburl ?? info.url;
      if (!url) return [];
      return [{
        url,
        pageUrl:
          info.descriptionurl ??
          `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replaceAll(' ', '_'))}`,
        alt: page.title.replace(/^File:/, '').replace(/\.[^.]+$/, ''),
      }];
    })
    .slice(0, limit);
}

export function searchWikipediaArticleImage(
  query: string,
  signal: AbortSignal,
  subject = query,
): Promise<WikimediaImage | null> {
  const key = `article:${normalizeCachePart(query)}:${normalizeCachePart(subject)}`;
  return waitForCached(key, signal, () =>
    fetchWikipediaArticleImage(query, new AbortController().signal, subject),
  );
}

export function searchWikipediaSummary(
  title: string,
  signal: AbortSignal,
): Promise<WikipediaSummary | null> {
  const normalizedTitle = normalizeCachePart(title);
  return waitForCached(`summary:${normalizedTitle}`, signal, () =>
    fetchWikipediaSummary(title.trim(), new AbortController().signal),
  );
}

export function searchWikimediaImages(
  query: string,
  signal: AbortSignal,
  limit = 3,
): Promise<WikimediaImage[]> {
  const key = `commons:${normalizeCachePart(query)}:${Math.max(0, limit)}`;
  return waitForCached(key, signal, () =>
    fetchWikimediaImages(query, new AbortController().signal, limit),
  );
}

export function clearWikimediaImageCache(): void {
  memoryCache.clear();
  inFlight.clear();
  if (typeof sessionStorage === 'undefined') return;
  try {
    const keys: string[] = [];
    for (let index = 0; index < sessionStorage.length; index += 1) {
      const key = sessionStorage.key(index);
      if (key?.startsWith(CACHE_PREFIX)) keys.push(key);
    }
    keys.forEach((key) => sessionStorage.removeItem(key));
  } catch {
    // Tests and privacy-restricted browsers may deny all storage access.
  }
}
