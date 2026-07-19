import { z } from 'zod';

export const projectSchema = z.object({
  categoryEn: z.string().min(1, 'Category (EN) is required'),
  categoryId: z.string().min(1, 'Category (ID) is required'),
  titleEn: z.string().min(1, 'Title (EN) is required'),
  titleId: z.string().min(1, 'Title (ID) is required'),
  descriptionEn: z.string().optional().nullable(),
  descriptionId: z.string().optional().nullable(),
  roleEn: z.string().optional().nullable(),
  roleId: z.string().optional().nullable(),
  isDeploy: z.boolean().default(false),
  liveUrl: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
  sourceCodeUrl: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
  imageUrl: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
  order: z.number().int().default(0),
  techStackIds: z.array(z.string()).default([]), // Array of Skill IDs
});
