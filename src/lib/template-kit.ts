// Vendored from @wetnose/shared/template-kit.
// Wire-level types for the public CMS manifest + page endpoints.
// Update this file when the upstream contract changes.

export type PageKind = "standard" | "content" | "special";

export interface SiteManifestSite {
  id: string;
  subdomain: string;
  customDomain: string | null;
  themeTokens: Record<string, unknown>;
  publishedAt: string | null;
}

export interface SiteManifestTemplate {
  id: string;
  slug: string;
  name: string;
  slotManifest: Record<string, unknown>;
}

export interface SiteManifestKennel {
  id: string;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  locality: string | null;
  region: string | null;
  country: string | null;
}

export interface SiteManifestPageStub {
  id: string;
  parentId: string | null;
  slug: string;
  title: string;
  pageKind: PageKind;
  sortOrder: number;
}

export interface SiteManifest {
  site: SiteManifestSite;
  template: SiteManifestTemplate | null;
  kennel: SiteManifestKennel | null;
  pages: SiteManifestPageStub[];
}

export interface SitePage {
  id: string;
  siteId: string;
  parentId: string | null;
  slug: string;
  title: string;
  pageKind: PageKind;
  slotValues: Record<string, unknown>;
  bodyMarkdown: string | null;
  sortOrder: number;
}
