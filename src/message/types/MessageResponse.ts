import type { z } from "zod";
import type {
  MessageResponseArraySchema,
  MessageResponseSchema,
} from "../schemas/MessageResponseSchema";

export type MessageResponse = z.infer<typeof MessageResponseSchema>;
export type MessageResponseArray = z.infer<typeof MessageResponseArraySchema>;
