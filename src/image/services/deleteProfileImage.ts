import { ResultAsync } from "neverthrow";
import { apiClient } from "../../utils/api";
import axios from "axios";

export function deleteProfileImage(): ResultAsync<void, Error> {
  return ResultAsync.fromPromise(
    apiClient.deleteProfileImage(undefined),
    (err) => {
      if (axios.isAxiosError(err)) {
        return new Error(err.message);
      }
      return new Error("Error deleting profile image");
    },
  );
}
