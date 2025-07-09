import { z } from "zod";
import { ProvinceSchema } from "./ProvinceSchema";
import { LawyerSpecializationsSetSchema } from "./LawyerSpecializationSchema";

export const LawyerRegisterSchema = z.object({
  tuitionNumber: z
    .string()
    .trim()
    .nonempty("El número de matrícula no puede estar vacío")
    .length(10, "El número de matrícula debe tener exactamente 10 dígitos")
    .refine((value) => {
      return !isNaN(Number(value));
    }, "El número de matrícula solo debe contener dígitos"),
  contactPrice: z.coerce
    .number({
      invalid_type_error: "El precio debe ser un número válido",
    })
    .min(1, "El precio de contacto debe ser al menos S/.1"),

  yearExperience: z.coerce
    .number({
      invalid_type_error: "El precio debe ser un número válido",
    })
    .min(0, "Los años de experiencia no pueden ser negativos")
    .refine((value) => {
      return !isNaN(Number(value));
    }, "Los años de experiencia deben ser un número válido"),

  province: ProvinceSchema,
  specializations: LawyerSpecializationsSetSchema,
});
