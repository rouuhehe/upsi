import { GuideRequestSchema } from "../schemas/GuideRequestSchema";
import { apiClient, wrap } from "../../utils/api";
import { err, ok } from "neverthrow";
import type { Guide } from "../types/Guide";

function validateGuideInput(data: unknown) {
  const parsed = GuideRequestSchema.safeParse(data);
  if (!parsed.success) return err(parsed.error);
  return ok(parsed.data);
}

export async function submitGuide(data: unknown) {
  return validateGuideInput(data).asyncAndThen((validatedData) =>
    wrap<Guide>(apiClient.createGuide({ body: validatedData })),
  );
}
