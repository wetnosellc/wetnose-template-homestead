# Homestead Template — Design Spec

> **Read this before touching any widget.** Homestead is NOT "Classic with a different palette." It must be structurally, layout-wise different. If you find yourself making a `grid grid-cols-3` of cards somewhere, stop — that's the Classic shape and Homestead does not use it.

## Concept

**Farm Journal.** Editorial, magazine-style, vertical-rhythm-driven. Think *The Bitter Southerner*, a printed kennel yearbook, or a Substack essay — not a SaaS marketing site.

The reader scrolls through long-form content with generous whitespace and one focal element per row. Where Classic stacks grids of equal-weight cards, Homestead alternates and stacks single full-width compositions.

## Design language

### Palette (already in `src/styles/global.css`)
- Background: cream `oklch(0.978 0.005 80)` (~`#FAF7F2`)
- Primary: sage `oklch(0.55 0.05 140)` (~`#7C8B6F`)
- Accent: sienna `oklch(0.58 0.15 35)` (~`#B86B4A`)
- Foreground: charcoal `oklch(0.13 0.02 30)` (~`#2B2622`)

Use CSS variables (`var(--color-primary)`, etc.) inside scoped `<style>` blocks. **Do NOT use `@apply` with Tailwind classes inside Astro scoped styles** — it fails to resolve. Use either inline Tailwind classes on elements, or plain CSS with the theme variables.

### Type
- **Serif** (`Fraunces`): all headlines, all dog/litter/page titles, drop caps.
- **Sans** (`Inter`): body, nav, labels.
- **Small caps** (`uppercase tracking-widest text-xs`): kicker labels above headlines, section dividers, status badges.
- Headline scale is **bigger than Classic** — heros at `text-6xl md:text-8xl`, section titles at `text-4xl md:text-5xl`.

### Rhythm
- Generous vertical padding between sections: `py-24 md:py-32` for major sections, `py-16` for sub-sections.
- Max-width content rails: prose at `max-w-2xl`, profile rows at `max-w-6xl`, hero text at `max-w-3xl`.
- Section-to-section: NO card borders or background tints separating them. Sections are delineated by whitespace and one thin hairline rule (`border-t border-stone-200/60`) when needed.

### Shapes
- `rounded-2xl` on images.
- **No** card-style containers (no `border rounded-xl shadow p-6` boxes). Content sits directly on the cream background.

## Layout primitives — what changes vs Classic

| Element | Classic | Homestead |
|---|---|---|
| Header | logo left, nav inline right, Contact as button | logo **centered**, nav row beneath it as thin underline-on-hover links; no contact button |
| Hero | full-bleed image, overlay text centered | left-aligned narrow-column composition: small kicker → huge serif headline → tagline → optional CTA → optional photo plate *below* with caption |
| DogsGrid | 3-col card grid | **alternating L/R profile rows**, one dog per row, image ~45% / text ~55% |
| LittersGrid | 3-col card grid | **vertical timeline** with left rail + dot markers + date column |
| CTAStrip | full-width horizontal banner | **centered single column**, `max-w-md`, intimate |
| Footer | multi-column link grid | **single column**, generous padding, long-form about copy, thin inline nav row, copyright tiny at bottom |
| Cards anywhere | bordered + shadow | **no card chrome**. Image + text on bare background. |

## Per-widget specs

For each, the file is `src/components/widgets/<Name>.astro`. Keep the same component name, props interface, and data-fetching — only change the markup/layout.

### Hero.astro
```
┌─────────────────────────────────────────────┐
│                                             │
│  ESTABLISHED 2008 · FAMILY-BRED  ← kicker   │
│                                             │
│  Big Serif Headline                         │
│  Wraps to multiple lines                    │
│  in a narrow column                         │
│                                             │
│  Subheadline / tagline sentence             │
│                                             │
│  [Sienna CTA pill]                          │
│                                             │
│  ─────────────────────────────              │
│  (optional photo plate below, max-w-4xl)    │
│  caption italic small below                 │
└─────────────────────────────────────────────┘
```
- Container: `<section class="py-24 md:py-32 px-6">`, content wrapper `max-w-6xl mx-auto`.
- Text column: `max-w-3xl` (NOT centered — left-aligned).
- Kicker: `text-xs uppercase tracking-widest text-primary mb-6`. Use a fixed string like "From our kennel" if no kicker prop exists; do not derive from headline.
- Headline: `text-6xl md:text-8xl font-serif font-bold leading-[1.05] mb-8`.
- Subheadline: `text-xl md:text-2xl text-foreground/70 leading-relaxed mb-10 max-w-2xl`.
- CTA: sienna pill `bg-accent text-white px-8 py-3 rounded-full`. **No image-overlay positioning.**
- If `image` prop present: render BELOW the text block, inside a `max-w-4xl mx-auto mt-16` wrapper, `aspect-[16/10] rounded-2xl object-cover`, with optional caption styled as `text-sm italic text-foreground/60 mt-3 text-center`.
- **DO NOT** do `absolute inset-0 bg-gradient-to-t` overlay text on image. That's the Classic shape.

### DogsGrid.astro
Alternating L/R profile rows. **No grid, no cards.**
```
┌─────────────────────────────────────────────┐
│  [   image   ]    SIRE                      │
│  [   image   ]    Big Serif Name            │
│  [   image   ]    STATUS · BREED            │
│  [   image   ]    Description paragraph     │
│  [   image   ]    that runs multiple lines  │
└─────────────────────────────────────────────┘
            (hairline divider)
┌─────────────────────────────────────────────┐
│  DAM                  [   image   ]         │
│  Big Serif Name       [   image   ]         │
│  STATUS · BREED       [   image   ]         │
│  Description          [   image   ]         │
└─────────────────────────────────────────────┘
```
- Container: `<section class="py-20 px-6"><div class="max-w-6xl mx-auto space-y-24">`.
- Each row: `grid grid-cols-1 md:grid-cols-12 gap-10 items-center`.
- Even-indexed (0, 2, 4): image on `md:col-span-5 md:col-start-1`, text on `md:col-span-6 md:col-start-7`.
- Odd-indexed (1, 3, 5): text on `md:col-span-6 md:col-start-1`, image on `md:col-span-5 md:col-start-8` (use `md:order-1` / `md:order-2` to flip).
- Image: `aspect-[4/5] rounded-2xl object-cover w-full`.
- Text block:
  - Kicker (status or "OUR DOG"): `text-xs uppercase tracking-widest text-accent mb-3`.
  - Name: `text-4xl md:text-5xl font-serif font-bold text-primary mb-2`.
  - Meta line (`{status} · {breed}` or similar): `text-sm uppercase tracking-wider text-foreground/60 mb-6`.
  - Description: `text-lg leading-relaxed text-foreground/80`.
- Between rows: `border-t border-stone-200/60 pt-24` on rows after the first (or just rely on `space-y-24` — pick one, not both).
- Layout prop "list" vs "grid" still accepted but **both render as profile rows**. There is no grid mode. (If we ever want a denser view, we'll add a third mode later.)

### LittersGrid.astro
Vertical timeline. **No grid, no cards.**
```
┌─────────────────────────────────────────────┐
│  MAR 2026  ●─── Big Serif Litter Name      │
│             │   Sire × Dam                  │
│             │   Description / availability  │
│             │                               │
│  JAN 2026  ●─── Litter Name                │
│             │   ...                         │
│             │                               │
│  OCT 2025  ●─── Litter Name                │
└─────────────────────────────────────────────┘
```
- Container: `<section class="py-20 px-6"><div class="max-w-4xl mx-auto">`.
- Each entry: `grid grid-cols-[120px_24px_1fr] gap-6` (date column, rail column, content column).
- Date column: `text-sm uppercase tracking-widest text-foreground/60 pt-2 text-right`.
- Rail column: a `<div class="relative">` with a vertical line `absolute left-1/2 top-0 bottom-0 w-px bg-stone-300` and a `w-3 h-3 rounded-full bg-accent relative z-10 mt-3 mx-auto` dot. The last entry's vertical line should stop at the dot (use a `bottom-auto h-3` for the last item, or render the line via `::before` on the dot — pick the simplest).
- Content column:
  - Title: `text-2xl md:text-3xl font-serif font-bold text-primary mb-2`.
  - Sire × Dam: `text-sm text-foreground/60 mb-3`.
  - Description: `text-base text-foreground/80 leading-relaxed`.
  - Status pill if applicable: `inline-block mt-3 text-xs uppercase tracking-widest text-accent`.
- Bottom padding per entry: `pb-16` (last: `pb-0`).

### RichText.astro
Long-form essay layout.
- Container: `<section class="py-20 px-6"><div class="max-w-2xl mx-auto richtext-content">` (~`60ch` measure).
- First paragraph: serif drop cap on first letter — `:global(.richtext-content) > p:first-of-type::first-letter { float: left; font-family: var(--font-serif); font-size: 4.5rem; line-height: 0.85; padding-right: 0.5rem; padding-top: 0.3rem; color: var(--color-primary); }`.
- Use the plain-CSS-with-theme-vars approach (already done in the current file). Don't reintroduce `@apply`.
- Blockquote: pulled to the edge with `margin-left: -2rem; margin-right: -2rem; text-align: center; font-family: var(--font-serif); font-style: italic; font-size: 1.5rem;` (responsive).

### CTAStrip.astro
Intimate, centered, single-column.
```
┌─────────────────────────────────────────────┐
│                                             │
│              GET IN TOUCH  ← kicker         │
│                                             │
│           Big Serif Headline                │
│           Possibly two lines                │
│                                             │
│          Short body paragraph               │
│          (max ~2 lines)                     │
│                                             │
│           [Sienna CTA pill]                 │
│                                             │
└─────────────────────────────────────────────┘
```
- Container: `<section class="py-24 px-6 bg-primary/5">` (a soft sage tint, NOT solid accent fill).
- Inner: `max-w-md mx-auto text-center`.
- Kicker: small caps `text-primary` above headline.
- Headline: `text-4xl md:text-5xl font-serif font-bold text-foreground mb-4`.
- Body: `text-foreground/70 mb-8`.
- CTA: sienna pill same as Hero.
- **DO NOT** do a horizontal `flex justify-between` strip with text-left/button-right. That's the Classic shape.

### TestimonialCarousel.astro
Single rotating pull-quote, **not a carousel of cards**.
- Container: `<section class="py-24 px-6"><div class="max-w-3xl mx-auto text-center">`.
- Open quote glyph: large serif `"` decorative element above quote (`text-7xl font-serif text-accent leading-none mb-4`).
- Quote: `text-2xl md:text-3xl font-serif italic text-foreground leading-relaxed mb-8`.
- Attribution: `— Name`, small caps, `text-sm uppercase tracking-widest text-foreground/60`.
- Dot navigation beneath, simple `flex gap-2 justify-center` of `w-2 h-2 rounded-full` dots.
- Only ONE testimonial visible at a time. JS swaps the text/attribution.

### FAQ.astro
Numbered editorial list, not accordion cards.
- Container: `<section class="py-20 px-6"><div class="max-w-3xl mx-auto">`.
- Each Q: `<details>` element styled as a typographic entry.
- Number column on left (`01`, `02`, ... in serif large), question to its right in serif bold, click to expand.
- Border-t hairline between entries; no card backgrounds.

### ImageGallery.astro
Magazine-style asymmetric photo layout (NOT uniform grid).
- Use a 12-column CSS grid with photos that span varying col-counts (e.g. first photo `col-span-8`, second `col-span-4`, third `col-span-5`, fourth `col-span-7`) cycling.
- `gap-4`, all images `rounded-2xl object-cover`.
- Captions optional below each image in small italic.

### ContactForm.astro
- Container: `<section class="py-20 px-6"><div class="max-w-xl mx-auto">`.
- Form is **single column**, full-width inputs (no two-column first/last name row).
- Inputs: `border-0 border-b border-stone-300 bg-transparent rounded-none px-0 py-3 focus:border-primary focus:ring-0` — minimalist underline inputs, not boxed.
- Labels: small caps above each field.
- Submit: sienna pill, full-width on mobile, auto width centered on desktop.

### PuppyApplicationForm.astro
Same underline input treatment as ContactForm. Long single-column form with section dividers (small-caps headers between groups of fields).

### Base.astro (layout chrome)
- Header:
  - Two rows: row 1 centered logo (image OR serif kennel name), row 2 thin nav.
  - Header bg: `bg-background` (cream), border-b hairline.
  - Nav row: `flex justify-center gap-8 py-3 border-t border-stone-200/60`.
  - Nav links: `text-sm text-foreground/80 hover:text-primary hover:underline underline-offset-8 decoration-1`.
  - **No contact button** in nav. Contact is just one of the nav links.
- Footer (when no footer widgets configured):
  - Single column, `max-w-2xl mx-auto text-center py-20 px-6`.
  - Top: serif kennel name, then a 2–3 sentence about paragraph (`resolvedDescription`).
  - Below: thin inline nav row with separators (`<a>Dogs</a> · <a>Litters</a> · <a>Contact</a>`).
  - Copyright at the very bottom, `text-xs text-foreground/40 pt-12`.

## Anti-patterns — do not do these (they're Classic's shape)

- `grid grid-cols-3` of cards anywhere
- Card containers (`border rounded-xl shadow p-6` style boxes around content)
- Full-bleed hero image with absolute-positioned overlay text
- Header with logo left + nav right + CTA button right
- Footer with 4 columns of link lists
- Horizontal CTA strip with text-left and button-right
- `@apply text-4xl md:text-5xl` inside Astro scoped `<style>` blocks (it doesn't resolve — use plain CSS or inline classes)

## Implementation order

1. Base.astro — get the header/footer shell right first; everything else inherits the cream + serif feel.
2. Hero.astro — sets the editorial tone for the page top.
3. DogsGrid.astro — the most prominent content widget, biggest visual delta from Classic.
4. LittersGrid.astro — second biggest delta (timeline vs grid).
5. CTAStrip, RichText, TestimonialCarousel — content widgets.
6. FAQ, ImageGallery, ContactForm, PuppyApplicationForm — round out the set.

After each widget, commit + push and let CI build. Verify on `moroshepherds.wetnose.app` (currently switched to Homestead in dev). When all 10 are done + Base is right, do one final visual sweep to confirm no widget regressed to a grid/card shape.

## Verifying you're done

Open the live Homestead build and the live Classic build side-by-side. If you can't tell at a glance which is which without reading the colors, **you are not done.** The shapes — where blocks are placed, what the page silhouette looks like when you blur your eyes — must be obviously different.
