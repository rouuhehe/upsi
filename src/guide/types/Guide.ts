import type { z } from "zod";
import type { GuideListSchema, GuideSchema } from "../schemas/GuideSchema";
import type { GuideList } from "../components/GuideList";

export type Guide = z.infer<typeof GuideSchema>;
export type GuideList = z.infer<typeof GuideListSchema>;
