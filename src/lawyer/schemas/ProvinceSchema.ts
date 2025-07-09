import { z } from "zod";

const Province = ["LIMA", "OTHER"] as const;

export const ProvinceSchema = z.enum(Province, {
  required_error: "La provincia es requerida",
});
export const ProvinceSetSchema = z.array(ProvinceSchema);
