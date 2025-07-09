import { z } from "zod";
import { GuideTypeSchema } from "./GuideTypeSchema";

export const GuideRequestSchema = z.object({
  title: z
    .string()
    .min(1, "El título es obligatorio")
    .max(120, "El título no puede exceder los 120 caracteres")
    .refine((val) => /\D/.test(val), {
      message: "El título no puede ser solo números",
    }),
  type: GuideTypeSchema,
  content: z
    .string()
    .min(1, "El contenido no puede estar vacío")
    .refine((val) => /\D/.test(val.replace(/<[^>]*>?/gm, "").trim()), {
      message: "El contenido no puede ser solo números",
    }),
});

export type GuideRequest = z.infer<typeof GuideRequestSchema>;
