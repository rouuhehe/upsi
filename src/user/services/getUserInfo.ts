import { ResultAsync } from "neverthrow";
import type { UserResponse } from "../types/UserResponse";
import { apiClient } from "../../utils/api";
import axios from "axios";

export function getUserInfo(): ResultAsync<UserResponse, Error> {
  return ResultAsync.fromPromise(apiClient.getUserInfo(), (err) => {
    if (axios.isAxiosError(err)) {
      return new Error(err.message);
    }
    return new Error("Error getting user info");
  });
}
