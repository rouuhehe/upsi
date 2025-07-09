import { ResultAsync } from "neverthrow";
import { apiClient } from "../../utils/api";
import axios from "axios";
import type { AuthResponse } from "../types/AuthResponse";

export function verifyUser(token: string): ResultAsync<AuthResponse, Error> {
  return ResultAsync.fromPromise(
    apiClient.verifyUser({ queries: { token } }),
    (err) => {
      if (axios.isAxiosError(err)) {
        return new Error(err.message);
      }
      return new Error("Error verifying user");
    },
  );
}
