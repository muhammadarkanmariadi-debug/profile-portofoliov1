import { z } from 'zod';

export const timelineSchema = z.object({
  type: z.enum(['EDUCATION', 'EXPERIENCE']),
  category: z.string().min(1, 'Category / Period is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  order: z.number().int().default(0),
});
