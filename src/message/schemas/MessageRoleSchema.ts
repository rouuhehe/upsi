import { z } from "zod";

const MessageRoles = ["USER", "ASSISTANT"] as const;

export const MessageRoleSchema = z.enum(MessageRoles);
export const MessageRolesSetSchema = z.array(MessageRoleSchema);
