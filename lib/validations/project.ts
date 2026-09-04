import { z } from 'zod';

export const projectSchema = z.object({
  slug: z.string().optional().nullable().or(z.literal('')),
  category: z.string().min(1, 'Category is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  isDeploy: z.boolean().default(false),
  liveUrl: z.string().optional().nullable().or(z.literal('')),
  sourceCodeUrl: z.string().optional().nullable().or(z.literal('')),
  imageUrl: z.string().optional().nullable().or(z.literal('')),
  order: z.number().int().default(0),
  techStackIds: z.array(z.string()).default([]), // Array of Skill IDs
});
