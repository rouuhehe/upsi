import { ResultAsync } from "neverthrow";
import { apiClient } from "../../utils/api";

export function sendLawyerReview({
  lawyerId,
  rating,
  content,
}: {
  lawyerId: string;
  rating: number;
  content: string;
}): ResultAsync<{ success: boolean; message?: string }, Error> {
  return ResultAsync.fromPromise(
    apiClient.createLawyerReview({ rating, content }, { params: { lawyerId } }),
    (error) => new Error("Error al enviar la reseña: " + JSON.stringify(error)),
  ).map(() => ({ success: true }));
}
