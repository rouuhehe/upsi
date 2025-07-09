import { z } from "zod";

const SessionStatus = ["OPEN", "CLOSED"] as const;

export const SessionStatusSchema = z.enum(SessionStatus);
export const SessionStatusSetSchema = z.array(SessionStatusSchema);
