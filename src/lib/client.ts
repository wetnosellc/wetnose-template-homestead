import {
  KennelApiClient,
  Dog,
  Litter,
  SiteManifest,
  SitePage,
  ApplicationForm,
  ApiError,
  type ListDogsOptions,
  type ListLittersOptions,
  type PedigreeNode,
  type ApplicationSubmission,
  type Testimonial,
} from '@wetnosellc/template-kit';

export {
  Dog,
  Litter,
  SiteManifest,
  SitePage,
  ApplicationForm,
  ApiError,
};
export type { PedigreeNode, ApplicationSubmission, Testimonial };

let cached: KennelApiClient | null = null;

export function getClient(): KennelApiClient | null {
  if (cached) return cached;
  const url = process.env.WETNOSE_API_URL;
  const key = process.env.WETNOSE_API_KEY;
  if (!key) {
    console.warn('[template-kit] WETNOSE_API_KEY not set — skipping API calls');
    return null;
  }
  cached = new KennelApiClient(url || undefined, key);
  return cached;
}

// SITE_ID is still needed for the manifest endpoint (which is site-scoped).
// KENNEL_ID is no longer needed — the read-only key auto-scopes to the
// kennel server-side.
export const SITE_ID = process.env.WETNOSE_SITE_ID || '';

// ─── Build-time caches ───────────────────────────────────────────────────────
// Astro renders every page in the same Node process during a build, and the
// API data is a snapshot for the whole build. Without caches, BaseLayout's
// safeGetManifest call would hit the API once per page (50+ pages × 1 = burst
// of identical requests that CF rate-limits, which is what we saw in prod).
// Each helper memoizes its first successful or failed result by key.

const manifestPromise: { current: Promise<SiteManifest | null> | null } = { current: null };
let dogsListPromise: Promise<Dog[]> | null = null;
let littersListPromise: Promise<Litter[]> | null = null;
const dogPromises = new Map<string, Promise<Dog | null>>();
const pedigreePromises = new Map<string, Promise<PedigreeNode | null>>();
// One bulk fetch covers every page in the site. Per-slug lookups read from
// this map, so the build makes one /pages request instead of N.
let allSitePagesPromise: Promise<Map<string, SitePage> | null> | null = null;
let applicationFormPromise: Promise<ApplicationForm | null> | null = null;
let testimonialsPromise: Promise<Testimonial[]> | null = null;

export async function safeGetTestimonials(): Promise<Testimonial[]> {
  const client = getClient();
  if (!client) return [];
  if (testimonialsPromise) return testimonialsPromise;
  testimonialsPromise = (async () => {
    try {
      return await client.getTestimonials();
    } catch (err) {
      console.error('[template-kit] getTestimonials failed:', err);
      return [];
    }
  })();
  return testimonialsPromise;
}

// Templates almost always want every dog at build time. Default to the API's
// max page size (200). Callers that need filtering can pass their own opts.
//
// Caches a single "all dogs" list under the hood — if a caller passes custom
// opts, we bypass the cache and hit the API directly.
export async function safeGetDogs(opts: ListDogsOptions = {}): Promise<Dog[]> {
  const client = getClient();
  if (!client) return [];

  const isDefault = Object.keys(opts).length === 0;
  if (isDefault && dogsListPromise) return dogsListPromise;

  const promise = (async () => {
    try {
      const result = await client.getDogs({ limit: 200, ...opts });
      return result.items;
    } catch (err) {
      console.error('[template-kit] getDogs failed:', err);
      return [];
    }
  })();

  if (isDefault) dogsListPromise = promise;
  return promise;
}

export async function safeGetDog(dogId: string): Promise<Dog | null> {
  const client = getClient();
  if (!client) return null;
  const cached = dogPromises.get(dogId);
  if (cached) return cached;

  const promise = (async () => {
    try {
      return await client.getDog(dogId);
    } catch (err) {
      console.error('[template-kit] getDog failed:', err);
      return null;
    }
  })();
  dogPromises.set(dogId, promise);
  return promise;
}

export async function safeGetLitters(opts: ListLittersOptions = {}): Promise<Litter[]> {
  const client = getClient();
  if (!client) return [];

  const isDefault = Object.keys(opts).length === 0;
  if (isDefault && littersListPromise) return littersListPromise;

  const promise = (async () => {
    try {
      const result = await client.getLitters({ limit: 200, ...opts });
      return result.items;
    } catch (err) {
      console.error('[template-kit] getLitters failed:', err);
      return [];
    }
  })();

  if (isDefault) littersListPromise = promise;
  return promise;
}

export async function safeGetManifest(): Promise<SiteManifest | null> {
  const client = getClient();
  if (!client || !SITE_ID) return null;
  if (manifestPromise.current) return manifestPromise.current;

  manifestPromise.current = (async () => {
    try {
      return await client.getSiteManifest(SITE_ID);
    } catch (err) {
      console.error('[template-kit] getSiteManifest failed:', err);
      return null;
    }
  })();
  return manifestPromise.current;
}

export async function safeGetPedigree(
  dogId: string,
  generations: number = 3,
): Promise<PedigreeNode | null> {
  const client = getClient();
  if (!client) return null;
  const key = `${dogId}:${generations}`;
  const cached = pedigreePromises.get(key);
  if (cached) return cached;

  const promise = (async () => {
    try {
      return await client.getPedigree(dogId, generations);
    } catch (err) {
      console.error('[template-kit] getPedigree failed:', err);
      return null;
    }
  })();
  pedigreePromises.set(key, promise);
  return promise;
}

export async function safeGetSitePage(slug: string): Promise<SitePage | null> {
  const client = getClient();
  if (!client || !SITE_ID) return null;
  if (!allSitePagesPromise) {
    allSitePagesPromise = (async () => {
      try {
        const pages = await client.getSitePages(SITE_ID);
        return new Map(pages.map((p) => [p.slug, p]));
      } catch (err) {
        console.error('[template-kit] getSitePages failed:', err);
        return null;
      }
    })();
  }
  const map = await allSitePagesPromise;
  return map?.get(slug) ?? null;
}

export async function safeGetApplicationForm(): Promise<ApplicationForm | null> {
  const client = getClient();
  if (!client) return null;
  if (applicationFormPromise) return applicationFormPromise;

  applicationFormPromise = (async () => {
    try {
      const manifest = await safeGetManifest();
      if (!manifest?.kennelId) return null;
      return await client.getApplicationForm(manifest.kennelId);
    } catch (err) {
      console.error('[template-kit] getApplicationForm failed:', err);
      return null;
    }
  })();
  return applicationFormPromise;
}
