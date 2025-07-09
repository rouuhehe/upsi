import { z } from "zod";
import { GuideTypeSchema } from "./GuideTypeSchema";

export const GuideSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  type: GuideTypeSchema,
  authorId: z.string().uuid(),
  createdAt: z.string().datetime(),
  content: z.string(),
});

export const GuideListSchema = z.array(GuideSchema);
