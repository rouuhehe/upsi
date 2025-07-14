import { z } from "zod";

export const ImageResponseSchema = z.object({
  full: z.string(),
  profile: z.string(),
  thumbnail: z.string(),
  altText: z.string(),
});