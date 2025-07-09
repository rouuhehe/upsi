import { GuideRequestSchema } from "../schemas/GuideRequestSchema";
import { apiClient } from "../../utils/api";
import { ResultAsync, err, ok } from "neverthrow";

function validateGuideInput(data: unknown) {
  const parsed = GuideRequestSchema.safeParse(data);
  if (!parsed.success) return err(parsed.error);
  return ok(parsed.data);
}

export async function submitGuide(data: unknown) {
  return validateGuideInput(data).asyncAndThen((validatedData) =>
    ResultAsync.fromPromise(
      apiClient.createGuide(validatedData),
      (error) => new Error(`Error al crear guía: ${error}`),
    ),
  );
}
