import { useEffect, useState } from "react";
import { err, ok, ResultAsync } from "neverthrow";
import { apiClient } from "../../utils/api";
import { z } from "zod";
import { LawyerReviewSchema } from "../schemas/LawyerReviewSchema";

type Review = z.infer<typeof LawyerReviewSchema>;


function fetchReviews(lawyerId: string) {
  return ResultAsync.fromPromise(
    apiClient.listLawyerReviews({ params: { lawyerId } }),
    (e: unknown) => {
      const error = e as {
        response?: { data?: { message?: string } };
        cause?: Array<{ message?: string }>;
      };
      const msg =
        error?.response?.data?.message ??
        error?.cause?.[0]?.message ??
        "No se pudieron cargar las reseñas.";
      return msg;
    }
  ).andThen((res) => {
    if (res.status === 200) {
      return ok(res.body);
    }
    return err(res.body.message);
  });
}


export function useLawyerReviewList(lawyerId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
 
  
  useEffect(() => {
    fetchReviews(lawyerId).match(
      (data: Review[]) => {
        setReviews(data);
        setError(null);
      },
      (error: string) => setError(error),
    );
  }, [lawyerId]);

  return {
    reviews,
    error,
    reloadReviews: fetchReviews,
  };
}
