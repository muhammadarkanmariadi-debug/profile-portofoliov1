import { z } from 'zod';

export const timelineSchema = z.object({
  type: z.enum(['EDUCATION', 'EXPERIENCE']),
  categoryEn: z.string().min(1, 'Category is required'),
  categoryId: z.string().optional().nullable(),
  titleEn: z.string().min(1, 'Title is required'),
  titleId: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionId: z.string().optional().nullable(),
  order: z.number().int().default(0),
});

