import { z } from "zod";

export const GuideTypeValues = {
  CRIMINAL: "Penal",
  CIVIL: "Civil",
  FAMILY: "Familiar",
  LABOR: "Laboral",
  CONSTITUTIONAL: "Constitucional",
  COMMERCIAL: "Comercial",
  PROCEDURAL: "Procesal",
  ADMINISTRATIVE: "Administrativo",
  TAX: "Tributario",
  INTERNATIONAL: "Internacional",
  ENVIRONMENTAL: "Ambiental",
} as const;

export const GuideTypeSchema = z.enum(
  Object.keys(GuideTypeValues) as [keyof typeof GuideTypeValues],
);
export type GuideType = z.infer<typeof GuideTypeSchema>;
export const GuideTypeLabels: Record<GuideType, string> = GuideTypeValues;
