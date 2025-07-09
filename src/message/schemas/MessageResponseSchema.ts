import { z } from "zod";
import { MessageRoleSchema } from "./MessageRoleSchema";

export const MessageResponseSchema = z.object({
  id: z.string(),
  role: MessageRoleSchema,
  createdAt: z.string().datetime(),
  content: z.string(),
});

export const MessageResponseArraySchema = z.array(MessageResponseSchema);
