import { z } from "zod";

export const LawyerResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  tuitionNumber: z.string(),
  yearExperience: z.number(),
  contactPrice: z.number(),
  province: z.string().nullable(),
  description: z.string().nullable(),
  specializations: z.array(z.string()),
  isPublic: z.boolean(),
});

export type LawyerResponse = z.infer<typeof LawyerResponseSchema>;
export const LawyerResponseArraySchema = z.array(LawyerResponseSchema);
export type LawyerResponseArray = z.infer<typeof LawyerResponseArraySchema>;
