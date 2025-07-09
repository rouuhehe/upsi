import { z } from "zod";

export const LawyerSpecializations = [
  "CRIMINAL",
  "CIVIL",
  "FAMILY",
  "LABOR",
  "CONSTITUTIONAL",
  "COMMERCIAL",
  "PROCEDURAL",
  "ADMINISTRATIVE",
  "TAX",
  "INTERNATIONAL",
  "ENVIRONMENTAL",
] as const;

export const LawyerSpecializationSchema = z.enum(LawyerSpecializations);

export const LawyerSpecializationsSetSchema = z
  .array(LawyerSpecializationSchema)
  .min(1, "Debe seleccionar al menos una especialización");

export type LawyerSpecialization = z.infer<typeof LawyerSpecializationSchema>;
