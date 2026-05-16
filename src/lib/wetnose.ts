// Vendored CMS manifest types — see src/lib/template-kit.ts.
import type { SiteManifest, SitePage } from "./template-kit";
export type { SiteManifest, SitePage } from "./template-kit";

// Kennel shape consumed throughout this template. Synthesized from the CMS
// manifest: hard kennel fields come from `manifest.kennel`; brand/site fields
// (logo, description, website, cover) live in `themeTokens`.
export interface Kennel {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  website: string | null;
  logoUrl: string | null;
  coverPhotoUrl: string | null;
}

export interface DogStub {
  id: string;
  registeredName: string;
  callName: string | null;
  sex?: "M" | "F";
}

export interface Photo {
  id: string;
  url: string;
  caption: string | null;
  sortOrder: number;
}

export interface Dog {
  id: string;
  kennelId: string;
  registeredName: string;
  callName: string | null;
  sex: "M" | "F";
  birthDate: string | null;
  status: string;
  altered: boolean;
  description: string | null;
  thumbnailPhotoUrl: string | null;
  microchips: string[];
  dateOfDeath: string | null;
  sireId: string | null;
  damId: string | null;
  weight: string | null;
  height: string | null;
  frozenSemenAvailable: boolean;
  studServiceAvailable: boolean;
  companionPrice: string | null;
  studPrice: string | null;
  forSaleReason: string | null;
  forSale: boolean;
  price: string | null;
  showOnWebsite: boolean;
  photos: Photo[];
  createdAt: string;
  updatedAt: string;
  sire?: DogStub | null;
  dam?: DogStub | null;
}

export interface PedigreeNode {
  id: string;
  registeredName: string;
  callName: string | null;
  sex: "M" | "F";
  thumbnailPhotoUrl: string | null;
  sire: PedigreeNode | null;
  dam: PedigreeNode | null;
}

export interface LitterPuppySummary {
  id: string;
  sex: "M" | "F";
  callName: string | null;
  salesStatus: string | null;
}

export interface BreedingStub {
  id: string;
  status: "Planned" | "Bred" | "Confirmed" | "Whelped" | "Failed";
  dueRangeStart: string | null;
  dueRangeEnd: string | null;
}

export interface Litter {
  id: string;
  kennelId: string;
  breedingId: string | null;
  sireId: string;
  damId: string;
  litterName: string | null;
  birthDate: string | null;
  expectedTraits: string[];
  notes: string | null;
  thumbnailPhotoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  sire?: DogStub;
  dam?: DogStub;
  breeding?: BreedingStub | null;
  puppies?: LitterPuppySummary[];
  photos?: Photo[];
}

export interface DogHealthClearance {
  id: string;
  dogId: string;
  result: string;
  testDate: string | null;
  expirationDate: string | null;
  certificateNumber: string | null;
  healthTestType?: {
    id: string;
    name: string;
    shortName: string | null;
    category?: { id: string; name: string };
  };
  organization?: { id: string; name: string; abbreviation: string } | null;
}

export interface DogTitle {
  id: string;
  dogId: string;
  dateAwarded: string;
  isPermanent: boolean;
  title?: {
    id: string;
    titleName: string;
    titleShortname: string;
    organization?: { id: string; name: string; abbreviation: string } | null;
  } | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

const BASE = import.meta.env.WETNOSE_API_URL ?? "";
const KEY = import.meta.env.WETNOSE_API_KEY ?? "";
const KENNEL_ID = import.meta.env.WETNOSE_KENNEL_ID ?? "";
const SITE_ID = import.meta.env.WETNOSE_SITE_ID ?? "";

// Re-export KENNEL_ID for use elsewhere
export { KENNEL_ID, SITE_ID };

async function wetnoseFetch<T>(
  path: string,
  params?: Record<string, string>,
  opts: { auth?: boolean } = { auth: true },
): Promise<T> {
  const url = new URL(`${BASE}/api/v1${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
  }
  const target = url.toString();
  const headers: Record<string, string> = {};
  if (opts.auth !== false) headers.Authorization = `ReadOnly ${KEY}`;
  const delays = [500, 1500, 4000];
  let lastErr: unknown;
  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const res = await fetch(target, { headers });
      if (res.ok) return (await res.json()) as T;
      // Retry on 5xx and 429; bail on other 4xx.
      if (res.status < 500 && res.status !== 429) {
        throw new Error(`Wetnose API error ${res.status}: ${await res.text()}`);
      }
      lastErr = new Error(`Wetnose API error ${res.status}: ${await res.text()}`);
    } catch (err) {
      lastErr = err;
    }
    if (attempt < delays.length) {
      await new Promise((r) => setTimeout(r, delays[attempt]));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

// ─── CMS manifest (Phase 2 wiring) ──────────────────────────────────────────

// Single-flight memo for the manifest fetch — the build hits this from many
// places (Base.astro, index.astro, about pages) and should only call once.
let manifestPromise: Promise<SiteManifest> | null = null;

export function fetchManifest(): Promise<SiteManifest> {
  if (!SITE_ID) {
    return Promise.reject(new Error("WETNOSE_SITE_ID is not set"));
  }
  if (!manifestPromise) {
    manifestPromise = wetnoseFetch<SiteManifest>(
      `/public/sites/${SITE_ID}/manifest`,
    );
  }
  return manifestPromise;
}

export function fetchSitePage(slug: string): Promise<SitePage> {
  if (!SITE_ID) {
    return Promise.reject(new Error("WETNOSE_SITE_ID is not set"));
  }
  return wetnoseFetch<SitePage>(
    `/public/sites/${SITE_ID}/pages/${encodeURIComponent(slug)}`,
  );
}

function stringToken(tokens: Record<string, unknown>, key: string): string | null {
  const v = tokens[key];
  return typeof v === "string" && v.length > 0 ? v : null;
}

// Synthesize the legacy Kennel shape from the manifest. Brand/site fields are
// driven by `themeTokens`, hard kennel fields come from `manifest.kennel`.
export async function fetchKennel(): Promise<Kennel> {
  const manifest = await fetchManifest();
  const tokens = manifest.site.themeTokens ?? {};
  const k = manifest.kennel;
  return {
    id: k?.id ?? KENNEL_ID,
    name: k?.name ?? "",
    slug: null,
    description: stringToken(tokens, "description"),
    website: stringToken(tokens, "website"),
    logoUrl: stringToken(tokens, "logoUrl"),
    coverPhotoUrl: stringToken(tokens, "coverPhotoUrl"),
  };
}

export function fetchDogs(params?: Record<string, string>): Promise<PaginatedResponse<Dog>> {
  return wetnoseFetch(`/dogs`, params);
}

export function fetchDog(id: string): Promise<Dog> {
  return wetnoseFetch(`/dogs/${id}`);
}

export function fetchDogPhotos(id: string): Promise<Photo[]> {
  return wetnoseFetch(`/dogs/${id}/photos`);
}

export function fetchDogPedigree(id: string, generations = 3): Promise<PedigreeNode> {
  return wetnoseFetch(`/dogs/${id}/pedigree`, { generations: String(generations) });
}

export function fetchProgeny(id: string): Promise<Dog[]> {
  return wetnoseFetch(`/dogs/${id}/progeny`);
}

export function fetchHealthClearances(id: string): Promise<DogHealthClearance[]> {
  return wetnoseFetch(`/dogs/${id}/health-clearances`);
}

export function fetchTitles(id: string): Promise<DogTitle[]> {
  return wetnoseFetch(`/dogs/${id}/titles`);
}

export function fetchLitters(params?: Record<string, string>): Promise<PaginatedResponse<Litter>> {
  return wetnoseFetch(`/litters`, params);
}

export function fetchLitter(id: string): Promise<Litter> {
  return wetnoseFetch(`/litters/${id}`);
}
