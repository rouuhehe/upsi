import type z from "zod";
import type { LoginRequestSchema } from "../schemas/LoginRequestSchema";

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
