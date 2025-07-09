import { useEffect, useState, useCallback } from "react";
import { apiClient } from "../../utils/api";
import { ResultAsync } from "neverthrow";
import { z } from "zod";
import { LawyerResponseSchema } from "../schemas/LawyerResponseSchema";

type Lawyer = z.infer<typeof LawyerResponseSchema>;

export function usePublicLawyerById(id: string) {
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchLawyer = useCallback(
    (): ResultAsync<Lawyer, string> =>
      ResultAsync.fromPromise(
        apiClient.getPublicLawyerById({ params: { id } }),
        (e: unknown) => {
          const error = e as {
            response?: { data?: { message?: string } };
            cause?: Array<{ message?: string }>;
          };
          const msg =
            error?.response?.data?.message ??
            error?.cause?.[0]?.message ??
            "No se pudo cargar la información del abogado.";
          return msg;
        },
      ),
    [id],
  );

  useEffect(() => {
    fetchLawyer().match(
      (data: Lawyer) => {
        setLawyer(data);
        setError(null);
      },
      (error: string) => setError(error),
    );
  }, [fetchLawyer]);

  return {
    lawyer,
    error,
    reloadLawyer: fetchLawyer,
  };
}
