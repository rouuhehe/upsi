import { ResultAsync } from "neverthrow";
import { apiClient } from "../../utils/api";
import type { RegisterRequest } from "../types/RegisterRequest";
import type { AuthResponse } from "../types/AuthResponse";
import axios from "axios";

export function register(
  registerRequest: RegisterRequest,
): ResultAsync<AuthResponse, Error> {
  return ResultAsync.fromPromise(apiClient.register(registerRequest), (err) => {
    if (axios.isAxiosError(err)) {
      return new Error(err.message);
    }
    return new Error("Error inesperado");
  });
}
