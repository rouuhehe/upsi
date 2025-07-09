import { useState, useCallback } from "react";
import { apiClient } from "../../utils/api";
import { ResultAsync } from "neverthrow";
import { sendLawyerReview } from "../services/review-lawyer";

type ReviewSummary = {
  average: number;
  numReviews: number;
};

export function useLawyerReview(lawyerId: string) {
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(() => {
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
    );

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
  }, [lawyerId]);

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
