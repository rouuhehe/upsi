import { apiClient } from "../../utils/api";
import { ResultAsync } from "neverthrow";
import type { LawyerResponse } from "../schemas/LawyerResponseSchema";

export function editLawyerDescription(
  newDescription: string,
): ResultAsync<LawyerResponse, string> {
  return ResultAsync.fromPromise(
    apiClient.editCurrentUserLawyerDescription(undefined, {
      queries: { newDescription },
    }),
    (e) => {
      const error = e as {
        response?: { data?: { message?: string } };
        cause?: Array<{ message?: string }>;
      };
      const msg =
        error?.response?.data?.message ??
        error?.cause?.[0]?.message ??
        "No se pudo enviar la solicitud de contacto.";
      return msg;
    },
  );
}
