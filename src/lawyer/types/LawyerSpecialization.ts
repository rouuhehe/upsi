import type { z } from "zod";
import type {
  LawyerSpecializationSchema,
  LawyerSpecializationsSetSchema,
} from "../schemas/LawyerSpecializationSchema";

export type LawyerSpecialization = z.infer<typeof LawyerSpecializationSchema>;
export type LawyerSpecializationsSet = z.infer<
  typeof LawyerSpecializationsSetSchema
>;
