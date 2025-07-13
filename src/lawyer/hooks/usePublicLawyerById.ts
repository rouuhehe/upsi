import { useEffect, useState } from "react";
import { apiClient } from "../../utils/api";
import { err, ok, ResultAsync } from "neverthrow";
import { z } from "zod";
import { LawyerResponseSchema } from "../schemas/LawyerResponseSchema";

type Lawyer = z.infer<typeof LawyerResponseSchema>;

function fetchLawyer(id: string) {
  return ResultAsync.fromPromise(
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
    }
  ).andThen((res) => {
    if (res.status === 200) {
      return ok(res.body);
    }
    return err(res.body.message);
  });
}


export function usePublicLawyerById(id: string) {
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLawyer(id).match(
      (data: Lawyer) => {
        setLawyer(data);
        setError(null);
      },
      (error: string) => setError(error),
    );
  }, [id]);

  return {
    lawyer,
    error,
    reloadLawyer: fetchLawyer,
  };
}
