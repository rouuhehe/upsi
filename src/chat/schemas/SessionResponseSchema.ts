import { z } from "zod";
import { SessionStatusSchema } from "./SessionStatus";

export const SessionResponseSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  createdAt: z.string().datetime(),
  status: SessionStatusSchema,
});

export const SessionResponseArraySchema = z.array(SessionResponseSchema);
