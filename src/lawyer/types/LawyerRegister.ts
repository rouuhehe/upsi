import { z } from "zod";
import type { LawyerRegisterSchema } from "../schemas/LawyerRegisterSchema";

export type LawyerRegister = z.infer<typeof LawyerRegisterSchema>;
