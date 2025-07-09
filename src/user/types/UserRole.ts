import { z } from "zod";
import type {
  UserRolesSetSchema,
  UserRoleSchema,
} from "../schemas/UserRoleSchema";

export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserRolesSet = z.infer<typeof UserRolesSetSchema>;
