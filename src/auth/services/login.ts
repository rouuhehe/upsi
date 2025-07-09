import { ResultAsync } from "neverthrow";
import { apiClient } from "../../utils/api";
import type { LoginRequest } from "../types/LoginRequest";
import type { AuthResponse } from "../types/AuthResponse";
import axios from "axios";

export function login(
  loginRequest: LoginRequest,
): ResultAsync<AuthResponse, Error> {
  return ResultAsync.fromPromise(apiClient.login(loginRequest), (err) => {
    if (axios.isAxiosError(err)) {
      if (err.status === 404) {
        return new Error("Credenciales inválidas");
      }
      if (err.status === 403) {
        return new Error("Usuario no verificado y/o credenciales inválidas");
      }
      return new Error(err.message);
    }
    return new Error("Error inesperado");
  });
}
