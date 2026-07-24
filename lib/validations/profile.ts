import { z } from 'zod';

export const profileSchema = z.object({
  phone: z.string().optional().nullable(),
  email: z.string().email('Invalid email').optional().nullable(),
  address: z.string().optional().nullable(),
  linkedinUrl: z.string().url('Invalid URL').optional().nullable(),
  instagramUrl: z.string().url('Invalid URL').optional().nullable(),
  githubUrl: z.string().url('Invalid URL').optional().nullable(),
  twitterUrl: z.string().url('Invalid URL').optional().nullable(),
  lanyardImageUrl: z.string().optional().nullable(),
  shortDescriptionEn: z.string().optional().nullable(),
  shortDescriptionId: z.string().optional().nullable(),
  fullBiographyEn: z.string().optional().nullable(),
  fullBiographyId: z.string().optional().nullable(),
  cvFileUrl: z.string().optional().nullable(),
});
