import { ResultAsync } from "neverthrow";
import { apiClient, wrap } from "../../utils/api";

export function sendLawyerReview({
  lawyerId,
  rating,
  content,
}: {
  lawyerId: string;
  rating: number;
  content: string;
}): ResultAsync<{ success: boolean; message?: string }, Error> {
  return wrap(
    apiClient.createLawyerReview({
      body: { rating, content },
      params: { lawyerId },
    }),
  ).map(() => ({ success: true }));
}
