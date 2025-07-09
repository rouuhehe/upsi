import { ResultAsync } from "neverthrow";
import type { SessionResponse } from "../types/SessionResponse";
import { apiClient } from "../../utils/api";
import axios from "axios";

export function createSession(): ResultAsync<SessionResponse, Error> {
  return ResultAsync.fromPromise(apiClient.createSession(undefined), (err) => {
    if (axios.isAxiosError(err)) {
      return new Error(err.message);
    }
    return new Error("Error creating new session");
  });
}
