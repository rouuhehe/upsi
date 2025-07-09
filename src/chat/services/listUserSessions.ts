import { ResultAsync } from "neverthrow";
import type { SessionResponseArray } from "../types/SessionResponse";
import { apiClient } from "../../utils/api";
import axios from "axios";

export function listUserSessions(): ResultAsync<SessionResponseArray, Error> {
  return ResultAsync.fromPromise(apiClient.listUserSessions(), (err) => {
    if (axios.isAxiosError(err)) {
      return new Error(err.message);
    }
    return new Error("Error listing user sessions");
  });
}
