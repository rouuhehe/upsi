import { ResultAsync } from "neverthrow";
import { apiClient } from "../../utils/api";
import axios from "axios";

export function deleteCurrentUser(): ResultAsync<void, Error> {
  return ResultAsync.fromPromise(
    apiClient.deleteCurrentUser(undefined),
    (err) => {
      if (axios.isAxiosError(err)) {
        return new Error(err.message);
      }
      return new Error("Error deleting user");
    },
  );
}
