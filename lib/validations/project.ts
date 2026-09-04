import { z } from 'zod';

export const projectSchema = z.object({
  slug: z.string().optional().nullable().or(z.literal('')),
  categoryEn: z.string().min(1, 'Category is required'),
  categoryId: z.string().optional().nullable(),
  titleEn: z.string().min(1, 'Title is required'),
  titleId: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionId: z.string().optional().nullable(),
  roleEn: z.string().optional().nullable(),
  roleId: z.string().optional().nullable(),
  isDeploy: z.boolean().default(false),
  liveUrl: z.string().optional().nullable().or(z.literal('')),
  sourceCodeUrl: z.string().optional().nullable().or(z.literal('')),
  imageUrl: z.string().optional().nullable().or(z.literal('')),
  order: z.number().int().default(0),
  techStackIds: z.array(z.string()).default([]), // Array of Skill IDs
});

