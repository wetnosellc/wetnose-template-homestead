# Static Images Convention

Images in this directory are for non-API-driven content (section banners, page heroes, etc.).
API-driven images (dog photos, litter photos) are managed in the Wetnose app and served via `thumbnailPhotoUrl`.

## Dogs List Page (`/dogs`) — section banners

| File | Used by |
|------|---------|
| `dogs-females-hero.jpg` | "Our Females" section in `src/pages/dogs/index.astro` |
| `dogs-males-hero.jpg`   | "Our Males" section in `src/pages/dogs/index.astro` |
| `dogs-for-sale-hero.jpg` | "Dogs For Sale" section in `src/pages/dogs/index.astro` |
| `dogs-retired-hero.jpg` | "Retired Champions" section in `src/pages/dogs/index.astro` |

To activate a banner, set the `imageUrl` for the matching section in `src/pages/dogs/index.astro`:
```ts
imageUrl: '/images/dogs-females-hero.jpg'
```

## Litters List Page (`/litters`)

| File | Used by |
|------|---------|
| `litters-hero.jpg` | Hero banner in `src/pages/litters/index.astro` (if added) |

## Guidelines
- Preferred format: `.jpg` or `.webp`
- Recommended width: 1400px+ for hero banners, 800px for section banners
- Keep files under 500KB for fast page loads
