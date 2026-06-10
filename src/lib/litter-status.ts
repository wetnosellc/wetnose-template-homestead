import type { Litter } from '@wetnosellc/template-kit';

export type LitterStatus = "Planned" | "Upcoming" | "Current" | "Sold Out" | "Past" | "Unknown";

const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;

export function getLitterStatus(litter: Litter): LitterStatus {
  const breeding = litter.breeding;
  const birthDate = litter.birthDate; // already a Date
  const puppies = litter.puppies;

  if (!breeding) {
    if (birthDate) return birthDate < new Date(Date.now() - SIX_MONTHS_MS) ? "Past" : "Current";
    return "Unknown";
  }

  if (breeding.status === "Planned" && !birthDate) return "Planned";
  if ((breeding.status === "Bred" || breeding.status === "Confirmed") && !birthDate) return "Upcoming";

  if (breeding.status === "Whelped" && birthDate) {
    const isOld = birthDate < new Date(Date.now() - SIX_MONTHS_MS);
    if (isOld) return "Past";
    const activeStatuses = new Set(["available", "reserved"]);
    const hasActive = puppies.some(p => p.salesStatus && activeStatuses.has(p.salesStatus));
    if (hasActive) return "Current";
    return "Sold Out";
  }

  if (breeding.status === "Failed") return "Past";

  return "Unknown";
}
