import z from "zod";

export const LoginRequestSchema = z.object({
  username: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe ser de 8 caracteres como mínimo"),
});
