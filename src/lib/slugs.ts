import slugify from "slugify";

const slugifyOpts = { lower: true, strict: true };

export function dogSlug(dog: { callName: string | null; registeredName: string; id: string }): string {
  const base = dog.callName ?? dog.registeredName;
  return slugify(base, slugifyOpts) || dog.id.slice(0, 8);
}

export function litterSlug(litter: { litterName: string | null; id: string }): string {
  return (litter.litterName ? slugify(litter.litterName, slugifyOpts) : '') || litter.id.slice(0, 8);
}

export function buildDogSlugMap(dogs: Array<{ callName: string | null; registeredName: string; id: string }>): Map<string, string> {
  const map = new Map<string, string>();
  const seen = new Map<string, number>();
  for (const dog of dogs) {
    let slug = dogSlug(dog);
    const count = seen.get(slug) ?? 0;
    seen.set(slug, count + 1);
    if (count > 0) slug = `${slug}-${count}`;
    map.set(slug, dog.id);
  }
  return map;
}

export function buildLitterSlugMap(litters: Array<{ litterName: string | null; id: string }>): Map<string, string> {
  const map = new Map<string, string>();
  const seen = new Map<string, number>();
  for (const litter of litters) {
    if (litter.litterName === null) continue;
    let slug = litterSlug(litter);
    const count = seen.get(slug) ?? 0;
    seen.set(slug, count + 1);
    if (count > 0) slug = `${slug}-${count}`;
    map.set(slug, litter.id);
  }
  return map;
}
