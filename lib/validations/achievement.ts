import { z } from 'zod';

export const achievementSchema = z.object({
  titleEn: z.string().min(1, 'Title (EN) is required'),
  titleId: z.string().min(1, 'Title (ID) is required'),
  statusEn: z.string().min(1, 'Status (EN) is required'),
  statusId: z.string().min(1, 'Status (ID) is required'),
  descriptionEn: z.string().optional().nullable(),
  descriptionId: z.string().optional().nullable(),
  date: z.coerce.date({
    required_error: 'Date is required',
    invalid_type_error: 'That is not a valid date',
  }),
  imageUrl: z.string().url('Invalid URL').optional().nullable().or(z.literal('')),
  order: z.number().int().default(0),
});
