import type { z } from "zod";
import type {
  SessionStatusSchema,
  SessionStatusSetSchema,
} from "../schemas/SessionStatus";

export type SessionStatus = z.infer<typeof SessionStatusSchema>;
export type SessionStatusSet = z.infer<typeof SessionStatusSetSchema>;
