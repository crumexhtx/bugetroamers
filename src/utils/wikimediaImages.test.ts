import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearWikimediaImageCache,
  isImageRelevantToSubject,
  searchWikipediaArticleImage,
  WIKIMEDIA_CACHE_TTL_MS,
} from './wikimediaImages';

function articleResponse() {
  return new Response(
    JSON.stringify({
      query: {
        pages: {
          1: {
            index: 1,
            title: 'Eiffel Tower',
            fullurl: 'https://en.wikipedia.org/wiki/Eiffel_Tower',
            thumbnail: { source: 'https://images.example/eiffel.jpg' },
          },
        },
      },
    }),
    { status: 200 },
  );
}

describe('Wikimedia image relevance validation', () => {
  beforeEach(() => {
    clearWikimediaImageCache();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('accepts images whose labels match the requested subject', () => {
    expect(
      isImageRelevantToSubject(
        'Bottle of Modelo Especial lager',
        'Modelo Especial',
      ),
    ).toBe(true);
    expect(isImageRelevantToSubject('Colosseum at dusk', 'Colosseum')).toBe(
      true,
    );
  });

  it('rejects unrelated image search results', () => {
    expect(
      isImageRelevantToSubject(
        'Ryanair Boeing 737 at Marrakesh Airport',
        'Koutoubia Mosque',
      ),
    ).toBe(false);
  });

  it('deduplicates in-flight requests and reuses cached results', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async () => articleResponse());
    const firstController = new AbortController();
    const secondController = new AbortController();

    const [first, second] = await Promise.all([
      searchWikipediaArticleImage(
        'Eiffel Tower',
        firstController.signal,
        'Eiffel Tower',
      ),
      searchWikipediaArticleImage(
        'Eiffel Tower',
        secondController.signal,
        'Eiffel Tower',
      ),
    ]);
    const cached = await searchWikipediaArticleImage(
      'Eiffel Tower',
      new AbortController().signal,
      'Eiffel Tower',
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(first).toEqual(second);
    expect(cached).toEqual(first);
  });

  it('does not let one consumer abort shared work for another', async () => {
    let finishRequest!: (response: Response) => void;
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          finishRequest = resolve;
        }),
    );
    const firstController = new AbortController();
    const secondController = new AbortController();
    const first = searchWikipediaArticleImage(
      'Eiffel Tower',
      firstController.signal,
    );
    const second = searchWikipediaArticleImage(
      'Eiffel Tower',
      secondController.signal,
    );
    const firstResult = expect(first).rejects.toMatchObject({
      name: 'AbortError',
    });

    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    firstController.abort();
    finishRequest(articleResponse());

    await firstResult;
    await expect(second).resolves.toMatchObject({
      url: 'https://images.example/eiffel.jpg',
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('expires cached responses after the TTL', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async () => articleResponse());

    await searchWikipediaArticleImage(
      'Eiffel Tower',
      new AbortController().signal,
    );
    vi.setSystemTime(Date.now() + WIKIMEDIA_CACHE_TTL_MS + 1);
    await searchWikipediaArticleImage(
      'Eiffel Tower',
      new AbortController().signal,
    );

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('falls back to memory when session storage throws', async () => {
    vi.stubGlobal('sessionStorage', {
      get length() {
        throw new Error('storage blocked');
      },
      getItem() {
        throw new Error('storage blocked');
      },
      setItem() {
        throw new Error('storage blocked');
      },
      removeItem() {
        throw new Error('storage blocked');
      },
      key() {
        throw new Error('storage blocked');
      },
    });
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async () => articleResponse());

    const first = await searchWikipediaArticleImage(
      'Eiffel Tower',
      new AbortController().signal,
    );
    const cached = await searchWikipediaArticleImage(
      '  eiffel   tower ',
      new AbortController().signal,
      'eiffel tower',
    );

    expect(cached).toEqual(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
