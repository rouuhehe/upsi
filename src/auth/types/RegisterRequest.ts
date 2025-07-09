import type z from "zod";
import type { RegisterRequestSchema } from "../schemas/RegisterRequestSchema";

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
