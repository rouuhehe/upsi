import type { z } from "zod";
import type { UserResponseSchema } from "../schemas/UserResponseSchema";

export type UserResponse = z.infer<typeof UserResponseSchema>;
