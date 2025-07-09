import { ResultAsync } from "neverthrow";
import { apiClient } from "../../utils/api";
import axios from "axios";

export function resendVerification(token: string): ResultAsync<void, Error> {
  return ResultAsync.fromPromise(
    apiClient.resendVerification({ queries: { token } }),
    (err) => {
      if (axios.isAxiosError(err)) {
        return new Error(err.message);
      }
      return new Error("Error resending verification");
    },
  );
}
