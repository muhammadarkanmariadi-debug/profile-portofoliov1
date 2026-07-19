import { z } from 'zod';

export const timelineSchema = z.object({
  type: z.enum(['EDUCATION', 'EXPERIENCE']),
  categoryEn: z.string().min(1, 'Category (EN) is required'),
  categoryId: z.string().min(1, 'Category (ID) is required'),
  titleEn: z.string().min(1, 'Title (EN) is required'),
  titleId: z.string().min(1, 'Title (ID) is required'),
  descriptionEn: z.string().optional().nullable(),
  descriptionId: z.string().optional().nullable(),
  order: z.number().int().default(0),
});
