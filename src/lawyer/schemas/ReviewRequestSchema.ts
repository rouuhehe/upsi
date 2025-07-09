import { z } from "zod";

export const ReviewRequestSchema = z.object({
  rating: z.number().int().min(1).max(5),
  content: z.string().min(1),
});
