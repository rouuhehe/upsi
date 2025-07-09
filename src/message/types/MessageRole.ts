import type { z } from "zod";
import type {
  MessageRoleSchema,
  MessageRolesSetSchema,
} from "../schemas/MessageRoleSchema";

export type MessageRole = z.infer<typeof MessageRoleSchema>;
export type MessageRolesSet = z.infer<typeof MessageRolesSetSchema>;
