import type { z } from "zod";
import { GuideRequestSchema } from "../schemas/GuideRequestSchema";

export type GuideRequest = z.infer<typeof GuideRequestSchema>;
export type GuideFormData = Omit<GuideRequest, "type"> & {
  type: GuideRequest["type"] | "";
};
