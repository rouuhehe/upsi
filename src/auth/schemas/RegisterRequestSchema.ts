import { z } from "zod";

export const RegisterRequestSchema = z.object({
  firstName: z
    .string()
    .trim()
    .nonempty("El nombre no puede estar vacío")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .refine((value) => !/\d/.test(value), "El nombre no debe contener números"),

  lastName: z
    .string()
    .trim()
    .nonempty("El apellido no puede estar vacío")
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .refine(
      (value) => !/\d/.test(value),
      "El apellido no debe contener números",
    ),

  email: z.string().email("Email inválido"),

  password: z
    .string()
    .trim()
    .nonempty("La contraseña no puede estar vacía")
    .min(8, "La contraseña debe ser de 8 caracteres como mínimo")
    .refine((value: string) => {
      return /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
    }, "La contraseña debe contener al menos una letra mayúscula, una minúscula y un número"),
  phoneNumber: z
    .string()
    .trim()
    .min(9, "El número de teléfono debe tener al menos 9 dígitos")
    .max(9, "El número de teléfono no puede tener más de 9 dígitos")
    .nonempty("El número no puede estar vacío")
    .startsWith("9", "El número de teléfono debe comenzar con 9")
    .refine((value) => {
      return !isNaN(Number(value));
    }, "El número de teléfono solo debe contener dígitos"),
});
