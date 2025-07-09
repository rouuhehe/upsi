import { ResultAsync } from "neverthrow";
import { apiClient } from "../../utils/api";
import axios from "axios";

export function deleteSessionById(id: string): ResultAsync<void, Error> {
  return ResultAsync.fromPromise(
    apiClient.deleteSessionById(undefined, { params: { id } }),
    (err) => {
      if (axios.isAxiosError(err)) {
        return new Error(err.message);
      }
      return new Error("Error deleting session");
    },
  );
}
