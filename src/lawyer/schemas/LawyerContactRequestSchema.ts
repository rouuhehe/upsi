import { z } from "zod";

export const LawyerContactRequestSchema = z.object({
  id: z.string().uuid(),
  subject: z.string().min(1),
  message: z.string().min(1),
});
