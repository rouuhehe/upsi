import { apiClient } from "../../utils/api";
import { ResultAsync } from "neverthrow";

export function sendLawyerContact({
  lawyerId,
  subject,
  message,
}: {
  lawyerId: string;
  subject: string;
  message: string;
}): ResultAsync<void, string> {
  return ResultAsync.fromPromise(
    apiClient.sendLawyerContact({ subject, message }, { params: { lawyerId } }),
    (e: unknown) => {
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
