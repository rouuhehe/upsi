import { z } from "zod";

export const LawyerRatingSummarySchema = z.object({
  numReviews: z.number(),
  average: z.number(),
});
