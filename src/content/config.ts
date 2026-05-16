import { defineCollection, z } from 'astro:content';

const about = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().default(0),
    showHero: z.boolean().default(false),
    showScreeningCta: z.boolean().default(false),
  }),
});

const breedInfo = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().default(0),
    subtitle: z.string().optional(),
    faults: z.array(z.string()).optional(),
    severeFaults: z.array(z.string()).optional(),
    disqualifyingFaults: z.array(z.string()).optional(),
    nb: z.array(z.string()).optional(),
  }),
});

const resources = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { about, 'breed-info': breedInfo, resources };
