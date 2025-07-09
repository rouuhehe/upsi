import z from "zod";

const UserRoles = ["ADMIN", "USER", "LAWYER"] as const;

export const UserRoleSchema = z.enum(UserRoles);
export const UserRolesSetSchema = z.array(UserRoleSchema);
