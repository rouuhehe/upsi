import type z from "zod";
import type { AuthResponseSchema } from "../schemas/AuthResponseSchema";

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
