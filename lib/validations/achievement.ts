import { z } from 'zod';

export const achievementSchema = z.object({
  slug: z.string().optional().nullable().or(z.literal('')),
  title: z.string().min(1, 'Title is required'),
  status: z.string().min(1, 'Status is required'),
  description: z.string().optional().nullable(),
  date: z.coerce.date({ message: 'Invalid date' }),
  imageUrl: z.string().optional().nullable().or(z.literal('')),
  order: z.number().int().default(0),
});
