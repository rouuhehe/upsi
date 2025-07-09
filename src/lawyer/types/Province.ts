import type { z } from "zod";
import type {
  ProvinceSchema,
  ProvinceSetSchema,
} from "../schemas/ProvinceSchema";

export type Province = z.infer<typeof ProvinceSchema>;
export type ProvinceSet = z.infer<typeof ProvinceSetSchema>;
