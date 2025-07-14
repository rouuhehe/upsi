import type { z } from "zod";
import type { ImageResponseSchema } from "../schemas/ImageResponseSchema";

export type ImageResponse = z.infer<typeof ImageResponseSchema>;