import { z } from "zod";
import { UserRolesSetSchema } from "./UserRoleSchema";

export const UserResponseSchema = z.object({
  id: z.string().uuid(),
  roles: UserRolesSetSchema,
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email("Email inválido"),
  phoneNumber: z.string().refine((value) => {
    return !isNaN(Number(value));
  }, "El número de teléfono solo debe contener dígitos"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
