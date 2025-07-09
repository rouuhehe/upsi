import { z } from "zod";

export const LawyerReviewSchema = z.object({
  id: z.string().uuid(),
  rating: z.number().min(1).max(5),
  content: z.string(),
  createdAt: z.string().datetime(),
  reviewerFirstName: z.string(),
  reviewerLastName: z.string(),
});

export const LawyerReviewArraySchema = z.array(LawyerReviewSchema);
