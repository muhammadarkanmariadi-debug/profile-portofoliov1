import { z } from 'zod';

export const achievementSchema = z.object({
  slug: z.string().optional().nullable().or(z.literal('')),
  titleEn: z.string().min(1, 'Title is required'),
  titleId: z.string().optional().nullable(),
  statusEn: z.string().min(1, 'Status is required'),
  statusId: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  descriptionId: z.string().optional().nullable(),
  date: z.coerce.date({ message: 'Invalid date' }),
  imageUrl: z.string().optional().nullable().or(z.literal('')),
  order: z.number().int().default(0),
});

