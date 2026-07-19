import { z } from 'zod';

export const skillSchema = z.object({
  category: z.enum([
    'FRONTEND',
    'BACKEND',
    'DATABASE_ORM',
    'BAHASA_LAINNYA',
    'VERSION_CONTROL',
    'CLOUD_DEPLOYMENT',
    'DESIGN_PROTOTYPING',
    'SISTEM_OPERASI',
  ]),
  title: z.string().min(1, 'Title is required'),
  logoUrl: z.string().optional().nullable().or(z.literal('')),
  order: z.number().int().default(0),
});
