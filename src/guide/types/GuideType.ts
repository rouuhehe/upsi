import type { z } from "zod";
import type { GuideTypeSchema } from "../schemas/GuideTypeSchema";

export type GuideType = z.infer<typeof GuideTypeSchema>;
