import { z } from "zod";

export const LawyerResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  tuitionNumber: z.string(),
  contactPrice: z.number(),
  yearExperience: z.number(),
  province: z.string(),
  isPublic: z.boolean(),
  description: z.string().nullable(),
  specializations: z.array(z.string()),
  numReviews: z.number(),
  avgRating: z.number(),
  imageURL: z.string().nullable(),
});

export type LawyerResponse = z.infer<typeof LawyerResponseSchema>;
export const LawyerResponseArraySchema = z.array(LawyerResponseSchema);
export type LawyerResponseArray = z.infer<typeof LawyerResponseArraySchema>;
