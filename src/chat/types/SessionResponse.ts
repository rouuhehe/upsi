import type { z } from "zod";
import type {
  SessionResponseArraySchema,
  SessionResponseSchema,
} from "../schemas/SessionResponseSchema";

export type SessionResponse = z.infer<typeof SessionResponseSchema>;
export type SessionResponseArray = z.infer<typeof SessionResponseArraySchema>;
