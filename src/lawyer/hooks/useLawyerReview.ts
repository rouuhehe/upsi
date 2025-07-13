import { useState } from "react";
import { apiClient } from "../../utils/api";
import { err, ok, ResultAsync } from "neverthrow";
import { sendLawyerReview } from "../services/review-lawyer";

type ReviewSummary = {
  average: number;
  numReviews: number;
};

export function useLawyerReview(lawyerId: string) {
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = () => {
    const result = ResultAsync.fromPromise(
      apiClient.getLawyerReviewSummary({ params: { lawyerId } }),
      (e) => {
        const error = e as {
          response?: { data?: { message?: string } };
          cause?: Array<{ message?: string }>;
        };
        const msg =
          error?.response?.data?.message ??
          error?.cause?.[0]?.message ??
          "No se pudo cargar el resumen.";
        return msg;
      },
    ).andThen((res) => {
      if (res.status === 200) {
        return ok(res.body);
      }

      return err(res.body.message);
    });

    result
      .map((res) => {
        setSummary(res);
        setError(null);
        return res;
      })
      .mapErr((errMsg) => {
        setError(errMsg);
        setSummary(null);
      });

    return result;
  };

  const submitReview = (
    rating: number,
    content: string,
  ): ResultAsync<{ success: boolean; message?: string }, Error> => {
    if (!lawyerId) {
      return ResultAsync.fromPromise(
        Promise.reject(),
        () => new Error("ID de abogado inválido"),
      );
    }
    return sendLawyerReview({
      lawyerId,
      rating,
      content,
    });
  };

  return {
    summary,
    submitReview,
    error,
    reloadSummary: fetchSummary,
  };
}
